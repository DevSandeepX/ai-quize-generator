"use client";

import { QuizCard } from "@/components/QuizCard";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

interface Props {
    initialQuizzes: any[];
    categoryId: string;
    search: string;
}

const PAGE_SIZE = 3;

export default function QuizInfiniteList({
    initialQuizzes,
    categoryId,
    search,
}: Props) {
    const [quizzes, setQuizzes] =
        useState(initialQuizzes);
    const [loading, setLoading] =
        useState(false);
    const [hasMore, setHasMore] =
        useState(
            initialQuizzes.length ===
            PAGE_SIZE
        );

    const pageRef = useRef(2);
    const lastElementRef =
        useRef<HTMLDivElement>(null);

    const loadMore = useCallback(async () => {
        if (loading || !hasMore)
            return;

        setLoading(true);

        try {
            const res = await fetch(
                `/api/quizzes?page=${pageRef.current}&limit=${PAGE_SIZE}&category=${categoryId}&search=${search}`
            );

            if (!res.ok) {
                throw new Error(
                    "Failed to fetch quizzes"
                );
            }

            const data = await res.json();

            setQuizzes((prev) => [
                ...prev,
                ...data.quizzes,
            ]);

            setHasMore(data.hasMore);
            pageRef.current += 1;
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [
        loading,
        hasMore,
        categoryId,
        search,
    ]);

    useIntersectionObserver({
        target: lastElementRef,
        onIntersect: loadMore,
        enabled:
            hasMore && !loading,
        threshold: 0,
        rootMargin: "200px",
    });

    useEffect(() => {
        setQuizzes(initialQuizzes);
        setHasMore(
            initialQuizzes.length ===
            PAGE_SIZE
        );
        pageRef.current = 2;
    }, [initialQuizzes]);

    return (
        <>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {quizzes.map(
                    (quiz, index) => (
                        <div
                            key={quiz.id}
                            ref={
                                index ===
                                    quizzes.length - 1
                                    ? lastElementRef
                                    : null
                            }
                        >
                            <QuizCard
                                quiz={quiz}
                            />
                        </div>
                    )
                )}
            </div>

            {loading && (
                <div className="mt-6 text-center text-sm text-muted-foreground">
                    Loading...
                </div>
            )}

            {!hasMore &&
                quizzes.length > 0 && (
                    <div className="mt-6 text-center text-sm text-muted-foreground">
                        No more quizzes.
                    </div>
                )}
        </>
    );
}