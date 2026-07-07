import Link from "next/link";
import { FileQuestion, ArrowRight } from "lucide-react";

export default function NoAttempt() {
    return (
        <div className="flex min-h-[60vh] items-center justify-center px-4">
            <div className="w-full max-w-md rounded-2xl border bg-card p-8 text-center shadow-sm">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                    <FileQuestion className="h-10 w-10 text-primary" />
                </div>

                <h2 className="text-2xl font-bold tracking-tight">
                    No Attempts Yet
                </h2>

                <p className="mt-3 text-muted-foreground">
                    You haven't attempted any quizzes yet. Start a quiz and your
                    results will appear here.
                </p>

                <Link
                    href="/quizes"
                    className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                >
                    Browse Quizzes
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
        </div>
    );
}