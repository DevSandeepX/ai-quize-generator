"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { actionToast } from "@/lib/actionToast";
import { useRouter } from "next/navigation";

interface QuizFormProps {
    categories: {
        id: string;
        text: string;
        createdAt: Date;
        updatedAt: Date;
    }[];
}

export default function QuizForm({
    categories,
}: QuizFormProps) {
    const [title, setTitle] = useState("");
    const [categoryId, setCategoryId] = useState(
        categories[0]?.id ?? ""
    );
    const [difficulty, setDifficulty] =
        useState("Medium");
    const [totalQuestions, setTotalQuestions] =
        useState(10);
    const [duration, setDuration] = useState(10);
    const [prompt, setPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [generatedQuestions, setGeneratedQuestions] =
        useState<{
            text: string,
            explanation?: string
            options: { text: string, isCorrect: boolean }[]
        }[]>([]);
    const router = useRouter()

    async function onSubmit() {
        try {
            setIsGenerating(true);

            const selectedCategoryName =
                categories.find(
                    (c) => c.id === categoryId
                )?.text ?? "";

            const res = await fetch(
                "/api/quiz/generate",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        title,
                        category:
                            selectedCategoryName,
                        difficulty,
                        totalQuestions,
                        duration,
                        prompt,
                    }),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                actionToast({
                    success: false,
                    message: "Failed to generate quiz"
                })
            }

            setGeneratedQuestions(
                data.questions
            );

            actionToast({
                success: true,
                message: "Successfully genereted quiz."
            })

        } catch (error) {
            actionToast({
                success: false,
                message: "Failed to generate quiz"
            })
        } finally {
            setIsGenerating(false);
        }
    }
    console.log(generatedQuestions);


    async function onSaveQuiz() {
        try {
            setIsSaving(true)
            if (
                generatedQuestions.length === 0
            ) {
                return alert(
                    "Generate quiz first."
                );
            }

            const res = await fetch(
                "/api/quiz/save",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        title,
                        duration,
                        categoryId,
                        prompt,
                        questions:
                            generatedQuestions,
                    }),
                }
            );

            const data = await res.json();


            actionToast({
                success: true,
                message: "Successfully quiz created"
            })

            router.replace("/dashboard/quizes")


        } catch (error) {
            actionToast({
                success: false,
                message: "Failed to save quiz"
            })
        } finally {
            setIsSaving(false)
        }
    }

    return (
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

                {/* Selects */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Difficulty
                        </label>

                        <select
                            value={difficulty}
                            onChange={(e) =>
                                setDifficulty(
                                    e.target.value
                                )
                            }
                            className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 transition focus:border-indigo-500 focus:bg-white focus:outline-none"
                        >
                            <option value="Easy">
                                Easy
                            </option>
                            <option value="Medium">
                                Medium
                            </option>
                            <option value="Hard">
                                Hard
                            </option>
                        </select>
                    </div>

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
                        Additional Instructions
                    </label>

                    <textarea
                        value={prompt}
                        onChange={(e) =>
                            setPrompt(
                                e.target.value
                            )
                        }
                        placeholder="Include scenario-based questions, code snippets, real-world examples..."
                        className="min-h-[150px] w-full rounded-xl border border-slate-200 bg-slate-50 p-4 transition focus:border-indigo-500 focus:bg-white focus:outline-none"
                    />
                </div>

                {
                    generatedQuestions.length > 0 ? (
                        <div className="rounded-lg border p-4">
                            <h3 className="mb-4 font-semibold">
                                Generated Questions
                            </h3>

                            <div className="space-y-4">
                                {generatedQuestions.map((q, index) => (
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
                    ) : (<p className="text-shadow-muted-foreground">No Questions.</p>)
                }

                <div className="flex gap-3">
                    <Button
                        type="submit"
                        disabled={isGenerating}
                        className="h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 text-white hover:opacity-90"
                    >
                        {isGenerating ? "Generating..." : "✨ Generate Quiz"}
                    </Button>

                    <Button
                        type="button"
                        onClick={onSaveQuiz}
                        disabled={generatedQuestions.length === 0 || isSaving}
                        className="h-12 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    >
                        {isSaving ? "Saving..." : "💾 Save Quiz"}
                    </Button>

                </div>

            </div>
        </form>
    );
}