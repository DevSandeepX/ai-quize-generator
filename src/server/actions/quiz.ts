"use server"
import { revalidateQuizCache } from "../cache/quiz";
import { createQuizDb } from "../db/quiz";
import { prisma } from "@/lib/db";
import { QuizStatus } from "../../generated/prisma/enums";
import { requireAdmin } from "@/lib/requireAdmin";

type QuestionInput = {
    text: string;
    explanation?: string;
    options: {
        text: string;
        isCorrect: boolean;
    }[];
};

export async function createQuiz(
    data: {
        title: string;
        duration: number;
        totalQuestions: number;
        questions: QuestionInput[];
    },
    {
        categoryId,
        promptId,
    }: {
        categoryId: string;
        promptId?: string;
    }
) {
    try {
        const user = await requireAdmin();

        const quiz = await createQuizDb({
            ...data,
            userId: user.id,
            categoryId,
            promptId,
        });

        revalidateQuizCache(
            quiz.id,
            quiz.categoryId ?? undefined
        );

        return {
            success: true,
            message: "Quiz created successfully.",
        };
    } catch (error) {
        console.error("Create quiz error:", error);

        return {
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Failed to create quiz.",
        };
    }
}

export async function deleteQuiz(id: string) {

    try {
        await requireAdmin()
        const data = await prisma.quiz.delete({
            where: {
                id,
            },
        });
        revalidateQuizCache(data.id, data.categoryId || undefined)

        return {
            success: true,
            message: "Quiz deleted successfully.",
        };
    } catch (error) {
        console.error(error);

        return {
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Failed to delete quiz"
        };
    }
}

export async function updateQuiz({
    id,
    status,
}: {
    id: string;
    status: QuizStatus;
}) {
    try {
        await requireAdmin();

        const quiz = await prisma.quiz.update({
            where: {
                id,
            },
            data: {
                status,
            },
        });

        revalidateQuizCache(
            quiz.id,
            quiz.categoryId ?? undefined
        );

        return {
            success: true,
            message: "Quiz updated successfully.",
        };
    } catch (error) {
        console.error("Update quiz error:", error);

        return {
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Failed to update quiz.",
        };
    }
}