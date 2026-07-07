import React from "react";
import { Clock, FileText, Trophy, Calendar } from "lucide-react";

interface AttemptCardProps {
    attempt: {
        id: string;
        score: number;
        submittedAt: Date | null;
        quiz: {
            title: string;
            totalQuestions: number;
            duration: number;
            category: {
                text: string;
            } | null;
        };
    };
}

export default function AttemptCard({ attempt }: AttemptCardProps) {
    const percentage = Math.round(
        (attempt.score / attempt.quiz.totalQuestions) * 100
    );

    return (
        <div className="rounded-2xl border bg-card p-5 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h3 className="text-lg font-semibold">{attempt.quiz.title}</h3>

                    {attempt.quiz.category && (
                        <span className="mt-2 inline-flex rounded-full bg-muted px-3 py-1 text-xs font-medium">
                            {attempt.quiz.category.text}
                        </span>
                    )}
                </div>

                <div className="rounded-xl bg-primary/10 px-4 py-2 text-center">
                    <p className="text-2xl font-bold text-primary">
                        {attempt.score}/{attempt.quiz.totalQuestions}
                    </p>
                    <p className="text-xs text-muted-foreground">Score</p>
                </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="flex items-center gap-2 rounded-lg border p-3">
                    <FileText className="size-4 text-muted-foreground" />
                    <div>
                        <p className="text-xs text-muted-foreground">Questions</p>
                        <p className="font-medium">
                            {attempt.quiz.totalQuestions}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 rounded-lg border p-3">
                    <Clock className="size-4 text-muted-foreground" />
                    <div>
                        <p className="text-xs text-muted-foreground">Duration</p>
                        <p className="font-medium">
                            {attempt.quiz.duration} min
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 rounded-lg border p-3">
                    <Trophy className="size-4 text-muted-foreground" />
                    <div>
                        <p className="text-xs text-muted-foreground">Percentage</p>
                        <p className="font-medium">{percentage}%</p>
                    </div>
                </div>
            </div>

            {attempt.submittedAt && (
                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="size-4" />
                    <span>
                        Submitted on{" "}
                        {new Date(attempt.submittedAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                        })}
                    </span>
                </div>
            )}
        </div>
    );
}