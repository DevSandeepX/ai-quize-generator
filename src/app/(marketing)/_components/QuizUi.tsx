"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Clock3, FileQuestion, Trophy } from "lucide-react";
import React from "react";
import { createAttempt } from "@/server/actions/attempt";
import { actionToast } from "@/lib/actionToast";
import { useRouter } from "next/navigation";

interface QuizUiProps {
    id: string,
    questions: any[];
    title: string;
    totalQuestions: number;
    duration: number;
}

export default function QuizUi({
    id,
    questions,
    title,
    totalQuestions,
    duration,
}: QuizUiProps) {
    const [selectedOptions, setSelectedOptions] = React.useState<{ [questionId: string]: string; }>({});

    const handleSelectOption = (
        questionId: string,
        optionId: string
    ) => {
        setSelectedOptions((prev) => ({
            ...prev,
            [questionId]: optionId,
        }));
    };

    const [isSubmitPending, startSubmittransition] = useTransition()
    const router = useRouter()

    return (
        <div className="w-full">
            <Card className="overflow-hidden border shadow-sm">
                {/* Header */}


                <CardHeader className="border-b bg-gradient-to-r from-background to-muted/40 p-4 sm:p-6">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        {/* Left */}
                        <div className="flex-1">
                            <div className="mb-2 flex items-center gap-2">
                                <Trophy className="size-5 text-yellow-500" />
                                <span className="text-sm font-medium text-muted-foreground">
                                    Quiz Challenge
                                </span>
                            </div>

                            <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight break-words">
                                {title}
                            </CardTitle>

                            <p className="mt-2 text-sm text-muted-foreground">
                                Read each question carefully and select the correct answer.
                            </p>
                        </div>

                        {/* Right */}
                        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:w-auto">
                            {/* Total Questions */}
                            <div className="flex items-center gap-3 rounded-xl border bg-background p-4 shadow-sm">
                                <div className="rounded-lg bg-blue-500/10 p-2">
                                    <FileQuestion className="size-5 text-blue-500" />
                                </div>

                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Total Questions
                                    </p>
                                    <p className="text-lg font-bold">
                                        {totalQuestions}
                                    </p>
                                </div>
                            </div>

                            {/* Duration */}
                            <div className="flex items-center gap-3 rounded-xl border bg-background p-4 shadow-sm">
                                <div className="rounded-lg bg-orange-500/10 p-2">
                                    <Clock3 className="size-5 text-orange-500" />
                                </div>

                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Duration
                                    </p>
                                    <p className="text-lg font-bold">
                                        {duration} mins
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardHeader>

                {/* Questions */}
                <CardContent className="space-y-8 p-2 md:p-6">
                    {questions.map((question, index) => (
                        <Card
                            key={question.id}
                            className="border shadow-none"
                        >
                            <CardContent className="p-4 sm:p-6">
                                {/* Question Title */}
                                <div className="mb-5 flex items-start gap-3 sm:gap-4">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground sm:h-10 sm:w-10 sm:text-sm">
                                        {index + 1}
                                    </div>

                                    <h2 className="break-words text-sm font-semibold leading-6 sm:text-base sm:leading-7 lg:text-lg">
                                        {question.text}
                                    </h2>
                                </div>

                                {/* Options */}
                                <div className="grid gap-3">
                                    {question.options.map(
                                        (
                                            option: {
                                                id: string;
                                                text: string;
                                                isCorrect: boolean;
                                            },
                                            optionIndex: number
                                        ) => (
                                            <Button
                                                key={option.id}
                                                variant="outline"
                                                disabled={!!selectedOptions[question.id]}
                                                className={`h-auto justify-start p-3 sm:p-4 text-left font-normal whitespace-normal break-words
              ${selectedOptions[question.id] && option.isCorrect
                                                        ? "bg-green-500 text-white hover:bg-green-500"
                                                        : selectedOptions[question.id] === option.id
                                                            ? "bg-red-500 text-white hover:bg-red-500"
                                                            : "hover:bg-muted"
                                                    }`}
                                                onClick={() =>
                                                    handleSelectOption(question.id, option.id)
                                                }
                                            >
                                                <span
                                                    className={`mr-3 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold sm:h-8 sm:w-8 sm:text-sm ${selectedOptions[question.id]
                                                        ? "border-white"
                                                        : ""
                                                        }`}
                                                >
                                                    {String.fromCharCode(65 + optionIndex)}
                                                </span>

                                                <span className="text-left text-sm sm:text-base break-words">
                                                    {option.text}
                                                </span>
                                            </Button>
                                        )
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    <div className="flex justify-end  my-8">
                        <Button
                            className="rounded px-8 md:px-16  py-6 text-lg bg-blue-500 text-white"
                            disabled={isSubmitPending || Object.values(selectedOptions).length !== questions.length}
                            onClick={() => startSubmittransition(async () => {
                                const data = await createAttempt({ selectedOptions, quizId: id })
                                if (data.success) {
                                    router.push("/my-attempts");
                                }

                                actionToast(data)

                            })}

                        >Submit Quiz</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}