import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/requireAdmin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    req: NextRequest
) {
    try {
        const loggedInUser = await requireAdmin()

        const {
            title,
            duration,
            categoryId,
            prompt,
            questions,
        } = await req.json();

        const quiz = await prisma.$transaction(async (tx) => {
            const savedPrompt = await tx.prompt.create({
                data: {
                    text: prompt,
                    userId: loggedInUser.id,
                },
            });

            return tx.quiz.create({
                data: {
                    title,
                    duration,
                    totalQuestions: questions.length,
                    teacherId: loggedInUser.id,
                    categoryId,
                    promptId: savedPrompt.id,
                    status: "DRAFT",
                },
            });
        });

        await Promise.all(
            questions.map((q: any) =>
                prisma.question.create({
                    data: {
                        text: q.text,
                        explanation: q.explanation,
                        quizId: quiz.id,
                        options: {
                            create: q.options.map(
                                (option: any) => ({
                                    text: option.text,
                                    isCorrect: option.isCorrect,
                                })
                            ),
                        },
                    },
                })
            )
        );

        return NextResponse.json({
            success: true,
            quiz,
        });
    } catch (error) {
        console.log(error);

        return NextResponse.json(
            {
                message:
                    "Failed to save quiz",
            },
            {
                status: 500,
            }
        );
    }
}