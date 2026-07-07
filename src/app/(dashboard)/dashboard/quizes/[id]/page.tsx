import { Suspense } from 'react'
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import {
    Clock3,
    FileQuestion,
    Settings,
    Users,
} from "lucide-react";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button'
import { getQuiz, getQuizWithStats } from '@/server/db/quiz';


export default async function QuizDetail({ params }: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    return (
        <Suspense>
            <div className='container py-10'>
                <Suspense fallback={null}>
                    <SuspendedPage
                        id={id}
                    />
                </Suspense>
            </div>
        </Suspense>
    )
}


async function SuspendedPage({
    id,
}: {
    id: string;
}) {
    const quiz = await getQuizWithStats(id);
    console.log("Quiz", quiz)

    if (!quiz) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                Quiz not found
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <QuizHeader quiz={quiz} />
            <QuizStats quiz={quiz} />
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <QuizInfo quiz={quiz} />
                </div>

                <TeacherCard teacher={quiz.teacher} />
            </div>
        </div>
    );
}

export function QuizHeader({ quiz }: {
    quiz: any

}) {
    return (
        <div className="rounded-2xl border bg-card p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold">
                        {quiz.title}
                    </h1>
                    <Badge
                        variant={
                            quiz.status === "PUBLISHED"
                                ? "default"
                                : "secondary"
                        }
                    >
                        {quiz.status}
                    </Badge>

                    <p className="text-muted-foreground">
                        {quiz.description}
                    </p>
                </div>
                <Link href={`/dashboard/quizes/${quiz.id}/settings`}>
                    <Button variant="outline" size="icon">
                        <Settings className="size-5" />
                        <span className="sr-only">Open settings</span>
                    </Button>
                </Link>
            </div>
        </div>
    );

}

export function QuizStats({ quiz }: any) {
    const cards = [
        {
            title: "Questions",
            value: quiz._count.questions,
            icon: FileQuestion,
        },
        {
            title: "Attempts",
            value: quiz._count.attempts,
            icon: Users,
        },
        {
            title: "Duration",
            value: `${quiz.duration} Min`,
            icon: Clock3,
        },
    ];

    return (
        <div className="grid gap-5 md:grid-cols-3">
            {cards.map((item) => (
                <div
                    key={item.title}
                    className="rounded-2xl border bg-card p-5"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                {item.title}
                            </p>

                            <h3 className="mt-2 text-3xl font-bold">
                                {item.value}
                            </h3>
                        </div>

                        <div className="rounded-xl bg-primary/10 p-3">
                            <item.icon className="size-6 text-primary" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export function QuizInfo({ quiz }: any) {
    return (
        <div className="rounded-2xl border bg-card p-6 space-y-6">
            <div>
                <h3 className="font-semibold">
                    AI Prompt
                </h3>

                <p className="mt-2 text-muted-foreground">
                    {quiz.prompt ? quiz.prompt.text : "No prompt available"}
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div>
                    <p className="text-sm text-muted-foreground">
                        Total Questions
                    </p>

                    <p className="font-semibold">
                        {quiz.totalQuestions}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-muted-foreground">
                        Created
                    </p>

                    <p className="font-semibold">
                        {new Date(
                            quiz.createdAt
                        ).toLocaleDateString()}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-muted-foreground">
                        Updated
                    </p>

                    <p className="font-semibold">
                        {new Date(
                            quiz.updatedAt
                        ).toLocaleDateString()}
                    </p>
                </div>
            </div>
        </div>


    );
}



export function TeacherCard({
    teacher,
}: any) {
    return (
        <div className="rounded-2xl border bg-card p-6">
            <h3 className="mb-5 font-semibold">
                Teacher
            </h3>

            <div className="flex items-center gap-4">
                <Avatar className="size-14">
                    <AvatarImage
                        src={teacher.avatarUrl ?? ""}
                    />
                </Avatar>

                <div>
                    <p className="font-semibold">
                        {teacher.name}
                    </p>

                    <p className="text-sm text-muted-foreground">
                        {teacher.email}
                    </p>
                </div>
            </div>
        </div>
    );
}

