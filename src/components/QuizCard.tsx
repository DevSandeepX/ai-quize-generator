import Link from "next/link";
import {
    Clock,
    FileQuestion,
    PlayCircle,
    Users,
} from "lucide-react";
import { getCategoryQuizes } from "@/app/(marketing)/quizes/page";

export function QuizCard({
    quiz,
}: {
    quiz: Awaited<ReturnType<typeof getCategoryQuizes>>[number];
}) {
    return (
        <div className="group rounded-2xl border bg-background p-5 transition-all hover:-translate-y-1 hover:shadow-lg">
            <div className="mb-3 flex items-center justify-between">
                {quiz.category && (
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        {quiz.category.text}
                    </span>
                )}

                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="size-3" />
                    {quiz._count.attempts}
                </div>
            </div>

            <h3 className="line-clamp-1 text-lg font-semibold">
                {quiz.title}
            </h3>

            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                {quiz.description}
            </p>

            <div className="mt-5 space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                    <Clock className="size-4" />
                    {quiz.duration} minutes
                </div>

                <div className="flex items-center gap-2">
                    <FileQuestion className="size-4" />
                    {quiz.totalQuestions} Questions
                </div>
            </div>

            <div className="mt-5 flex items-center gap-3 border-t pt-4">
                <img
                    src={quiz.teacher.avatarUrl ?? "/avatar.png"}
                    alt={quiz.teacher.name ?? ""}
                    className="size-10 rounded-full object-cover"
                />

                <div className="flex-1 overflow-hidden">
                    <p className="truncate text-sm font-medium">
                        {quiz.teacher.name}
                    </p>

                    <p className="truncate text-xs text-muted-foreground">
                        {quiz.teacher.email}
                    </p>
                </div>
            </div>

            <Link
                href={`/quizes/${quiz.id}`}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground transition hover:opacity-90"
            >
                <PlayCircle className="size-4" />
                Start Quiz
            </Link>
        </div>
    );
}