import { Suspense } from "react";
import QuizForm from "@/components/QuizForm";
import { PageHeader } from "@/components/PageHeader";
import { Sparkles } from "lucide-react";
import { getAllCategories } from "@/server/db/category";

export default function AiGenerate() {
    return (
        <div className="container py-8">
            {/* Header */}
            <div className="mb-8 rounded-3xl border bg-white p-8">
                <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50">
                        <Sparkles className="size-7" />
                    </div>

                    <div>
                        <PageHeader title="Generate Quiz With AI" />
                        <p className="mt-2 text-blue-700">
                            Create engaging quizzes in seconds using AI. Select a
                            category, describe your topic, and let AI do the work.
                        </p>
                    </div>
                </div>
            </div>

            {/* Form Card */}
            <div className="rounded-3xl border bg-white p-6 shadow-sm">
                <Suspense
                    fallback={
                        <div className="space-y-4">
                            <div className="h-12 animate-pulse rounded-lg bg-gray-200" />
                            <div className="h-12 animate-pulse rounded-lg bg-gray-200" />
                            <div className="h-32 animate-pulse rounded-lg bg-gray-200" />
                        </div>
                    }
                >
                    <SuspendedQuizForm />
                </Suspense>
            </div>
        </div>
    );
}

async function SuspendedQuizForm() {
    const categories = await getAllCategories();

    return <QuizForm categories={categories ?? []} />;
}

