"use client"

import React, { useState } from 'react'
import { questionSchema } from "@/server/schema/questionSchema"
import { jsonParser } from '@/lib/jsonParser';
import { actionToast } from '@/lib/actionToast';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { createQuiz } from '@/server/actions/quiz';

interface QuizFormProps {
    categories: {
        id: string;
        text: string;
        createdAt: Date;
        updatedAt: Date;
    }[];
}

export default function ManualQuizForm({ categories,
}: QuizFormProps) {

    const [title, setTitle] = useState("");
    const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
    const [totalQuestions, setTotalQuestions] = useState(10);
    const [duration, setDuration] = useState(10);
    const [validQuestionJson, setValidQuestionJson] = useState<{
        text: string;
        explanation: string;
        options: {
            text: string;
            isCorrect: boolean;
        }[];
    }[] | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isPreview, setIsPreview] = useState(false)
    const [questionJson, setQuestionJson] = useState("");
    const router = useRouter()
    async function onSubmit() {
        try {
            if (!validQuestionJson) {
                actionToast({
                    success: false,
                    message: "Preview questions first.",
                });
                return;
            }

            if (
                validQuestionJson.length <
                totalQuestions
            ) {
                actionToast({
                    success: false,
                    message: `Please add ${totalQuestions -
                        validQuestionJson.length
                        } more question(s) before publishing.`,
                });

                return;
            }

            setIsSaving(true);

            const res = await createQuiz({
                duration,
                questions: validQuestionJson,
                title,
                totalQuestions,
            }, { categoryId })

            actionToast(res);

            router.replace(
                "/dashboard/quizes"
            );
        } catch (error) {
            actionToast({
                success: false,
                message:
                    "Failed to save quiz",
            });
        } finally {
            setIsSaving(false);
        }
    }
    function onPreview() {
        const data = jsonParser(questionJson, { schema: questionSchema })
        if (data == null) {
            actionToast({
                success: false,
                message: "Invalid json"
            })

            return null
        }
        setIsPreview(true)
        setValidQuestionJson(data)
        actionToast({
            success: true,
            message: "Question parsed successfully"
        })
    }

    return (
        <>
            {
                validQuestionJson?.length &&
                validQuestionJson.length < totalQuestions && (
                    <div className=" z-20 w-full rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-yellow-900">
                        <h2 className="text-lg font-semibold">
                            ⚠️ Warning
                        </h2>

                        <p className="mt-1 text-sm">
                            You currently have{" "}
                            <span className="font-semibold">
                                {validQuestionJson.length}
                            </span>{" "}
                            valid question
                            {validQuestionJson.length !== 1 &&
                                "s"}
                            , but this quiz requires{" "}
                            <span className="font-semibold">
                                {totalQuestions}
                            </span>{" "}
                            questions. Please add{" "}
                            <span className="font-semibold">
                                {totalQuestions -
                                    validQuestionJson.length}
                            </span>{" "}
                            more question
                            {totalQuestions -
                                validQuestionJson.length !==
                                1 && "s"}{" "}
                            before publishing.
                        </p>
                    </div>
                )

            }
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    onSubmit();
                }}
                className="w-full"
            >
                <div className="mx-auto flex w-full flex-col gap-6 rounded-xl  bg-white p-6 ">
                    {/* Category */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Category
                        </label>

                        <select
                            value={categoryId}
                            onChange={(e) =>
                                setCategoryId(
                                    e.target.value
                                )
                            }
                            className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 transition focus:border-indigo-500 focus:bg-white focus:outline-none"
                        >
                            {categories.map(
                                (category) => (
                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.text}
                                    </option>
                                )
                            )}
                        </select>
                    </div>

                    {/* Quiz Title */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Quiz Title
                        </label>

                        <input
                            value={title}
                            onChange={(e) =>
                                setTitle(
                                    e.target.value
                                )
                            }
                            placeholder="JavaScript Fundamentals Quiz"
                            className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 transition focus:border-indigo-500 focus:bg-white focus:outline-none"
                        />
                    </div>

                    <div className='flex gap-4 items-start'>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Questions
                            </label>

                            <select
                                value={totalQuestions}
                                onChange={(e) =>
                                    setTotalQuestions(
                                        Number(
                                            e.target.value
                                        )
                                    )
                                }
                                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 transition focus:border-indigo-500 focus:bg-white focus:outline-none"
                            >
                                {[10, 15, 30, 50, 100].map(
                                    (num) => (
                                        <option
                                            key={num}
                                            value={num}
                                        >
                                            {num}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Duration
                            </label>

                            <select
                                value={duration}
                                onChange={(e) =>
                                    setDuration(
                                        Number(
                                            e.target.value
                                        )
                                    )
                                }
                                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 transition focus:border-indigo-500 focus:bg-white focus:outline-none"
                            >
                                {[10, 20, 45, 90].map(
                                    (min) => (
                                        <option
                                            key={min}
                                            value={min}
                                        >
                                            {min} min
                                        </option>
                                    )
                                )}
                            </select>
                        </div>
                    </div>


                    {/* Additional Instructions */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Question Json
                        </label>

                        <textarea
                            value={questionJson}
                            onChange={(e) =>
                                setQuestionJson(
                                    e.target.value
                                )
                            }
                            placeholder="Include scenario-based questions, code snippets, real-world examples..."
                            className="min-h-[540px] w-full rounded-xl border border-slate-200 bg-slate-50 p-4 transition focus:border-indigo-500 focus:bg-white focus:outline-none"
                        />
                    </div>

                    {
                        isPreview && questionJson.length > 0 && (
                            <div className="rounded-lg border p-4">
                                <div className='flex items-start justify-between'>

                                    <h3 className="mb-4 font-semibold">
                                        Generated Questions
                                    </h3>
                                    <p>{validQuestionJson?.length}/{totalQuestions}</p>
                                </div>

                                <div className="space-y-4">
                                    {validQuestionJson && validQuestionJson.map((q, index) => (
                                        <div
                                            key={index}
                                            className="rounded-xl border border-slate-200 p-4"
                                        >
                                            <h4 className="font-semibold">
                                                Q{index + 1}. {q.text}
                                            </h4>

                                            <ul className="mt-3 space-y-2">
                                                {q.options?.map(
                                                    (
                                                        option: {
                                                            text: string;
                                                            isCorrect: boolean;
                                                        },
                                                        i: number
                                                    ) => (
                                                        <li
                                                            key={i}
                                                            className={`rounded-lg border p-2 ${option.isCorrect
                                                                ? "border-green-200 bg-green-50 text-green-700"
                                                                : "bg-slate-50"
                                                                }`}
                                                        >
                                                            <span className="font-medium mr-2">
                                                                {String.fromCharCode(65 + i)}.
                                                            </span>
                                                            {option.text}

                                                            {option.isCorrect && (
                                                                <span className="ml-2 text-xs font-semibold">
                                                                    ✓ Correct
                                                                </span>
                                                            )}
                                                        </li>
                                                    )
                                                )}
                                            </ul>

                                            {q.explanation && (
                                                <div className="mt-4 rounded-lg bg-blue-50 p-3 text-sm">
                                                    <span className="font-semibold">
                                                        Explanation:
                                                    </span>{" "}
                                                    {q.explanation}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    }

                    <div className="flex gap-3">
                        <Button
                            type="button"
                            onClick={onPreview}
                            disabled={questionJson.length == 0}
                            className="h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 text-white hover:opacity-90"
                        >
                            Preview
                        </Button>

                        <Button
                            type="submit"

                            disabled={
                                validQuestionJson == null ||
                                validQuestionJson.length !== totalQuestions ||
                                validQuestionJson && validQuestionJson.length === 0
                                || isSaving}
                            className="h-12 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        >
                            {isSaving ? "Saving..." : "💾 Save Quiz"}
                        </Button>

                    </div>

                </div>
            </form>
        </>
    );

}
