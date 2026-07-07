"use server";

import { auth } from "@clerk/nextjs/server";
import { getUser } from "../db/user";
import { createAttemptDb } from "../db/attempt";
import { revalidateAttemptCache } from "../cache/attempt";
import { prisma } from "@/lib/db";

export async function createAttempt(data: {
    quizId: string;
    selectedOptions: Record<string, string>;
}) {
    const { userId, redirectToSignIn } = await auth();

    if (!userId) {
        return redirectToSignIn();
    }

    try {
        const user = await getUser(userId);

        if (!user) {
            return {
                success: false,
                message: "User not found.",
            };
        }

        const existingAttempt = await prisma.attempt.findFirst({
            where: {
                userId: user.id,
                quizId: data.quizId,
            },
        });

        if (existingAttempt) {
            return {
                success: false,
                message: "You have already attempted this quiz.",
            };
        }

        const attempt = await createAttemptDb({
            userId: user.id,
            quizId: data.quizId,
            answers: data.selectedOptions,
        });

        revalidateAttemptCache(
            attempt.id,
            attempt.quizId,
            attempt.userId
        );

        return {
            success: true,
            message: "Quiz submitted successfully.",
        };
    } catch (error) {
        console.error("Create attempt error:", error);

        return {
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Failed to submit quiz.",
        };
    }
}