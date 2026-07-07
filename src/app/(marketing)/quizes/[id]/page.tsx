import { Card, CardContent } from "@/components/ui/card";
import { getQuiz } from "@/server/db/quiz";
import { Suspense } from "react";
import QuizUi from "../../_components/QuizUi";
import { AlertCircle, Loader2 } from "lucide-react";

export default async function Quiz({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    return (
        <div className="container py-6 space-y-6">
            <Suspense fallback={<QuizLoading />}>
                <SuspendedQuizUi id={id} />
            </Suspense>
        </div>
    );
}

async function SuspendedQuizUi({ id }: { id: string }) {
    const quiz = await getQuiz(id);

    if (!quiz) {
        return <NoQuiz />;
    }

    const { title, totalQuestions, duration, questions } = quiz;

    return (
        <QuizUi
            id={id}
            questions={questions}
            title={title}
            totalQuestions={totalQuestions}
            duration={duration}
        />
    );
}

function QuizLoading() {
    return (
        <Card>
            <CardContent className="flex h-60 items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="size-8 animate-spin text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                        Loading quiz...
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}

function NoQuiz() {
    return (
        <Card>
            <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-4 rounded-full bg-destructive/10 p-4">
                    <AlertCircle className="size-10 text-destructive" />
                </div>

                <h2 className="text-2xl font-bold">
                    Quiz Not Available
                </h2>

                <p className="mt-2 max-w-md text-muted-foreground">
                    The quiz you are looking for either doesn't exist,
                    has been removed, or is not published yet.
                </p>
            </CardContent>
        </Card>
    );
}