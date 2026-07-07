import CategoryButton from "@/components/CategoryButton";
import { Suspense } from "react";
import QuizInfiniteList from "../_components/InfinitQuizList";
import { getCategoryPublishQuizes } from "@/server/db/quiz";
import { getAllCategories } from "@/server/db/category";

interface PageProps {
    searchParams: Promise<{
        category?: string;
        search?: string;
        page?: string;
    }>;
}

export default async function QuizList({
    searchParams,
}: PageProps) {
    const params = await searchParams;

    const categoryId = params.category ?? "all";
    const search = params.search ?? "";
    const page = Number(params.page ?? "1");

    return (
        <div className="space-y-8 container">
            <Suspense fallback={<CategorySkeleton />}>
                <SuspendedCategoryList />
            </Suspense>

            <Suspense
                key={`${categoryId}-${search}-${page}`}
                fallback={<QuizGridSkeleton />}
            >
                <SuspendedQuizList
                    categoryId={categoryId}
                    search={search}
                />
            </Suspense>
        </div>
    );
}

async function SuspendedQuizList({
    categoryId,
    search,

}: {
    categoryId: string;
    search: string;
}) {
    const quizzes = await getCategoryPublishQuizes({
        limit: 12,
        page: 1,
        search,
        categoryId,
    });

    if (quizzes.length === 0) {
        return (
            <div className="flex h-60 items-center justify-center rounded-2xl border border-dashed">
                <p className="text-muted-foreground">
                    No quizzes found.
                </p>
            </div>
        );
    }

    return (
        <QuizInfiniteList
            initialQuizzes={quizzes}
            categoryId={categoryId}
            search={search}
        />
    );
}



async function SuspendedCategoryList() {
    const categories = await getAllCategories();

    if (categories.length === 0) {
        return null;
    }

    return (
        <div className="sticky top-0 z-20 bg-background py-2">
            <div className="flex gap-3 overflow-x-auto no-scrollbar">
                <CategoryButton
                    category={{
                        id: "all",
                        text: "All",
                    }}
                />

                {categories.map((category) => (
                    <CategoryButton
                        key={category.id}
                        category={category}
                    />
                ))}
            </div>
        </div>
    );
}



function CategorySkeleton() {
    return (
        <div className="flex gap-3 overflow-hidden">
            {Array.from({ length: 8 }).map((_, i) => (
                <div
                    key={i}
                    className="h-10 w-24 animate-pulse rounded-full bg-muted"
                />
            ))}
        </div>
    );
}

function QuizGridSkeleton() {
    return (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
                <div
                    key={i}
                    className="h-72 animate-pulse rounded-2xl border bg-muted/30"
                />
            ))}
        </div>
    );
}