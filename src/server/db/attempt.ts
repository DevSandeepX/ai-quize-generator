import { prisma } from "@/lib/db";
import { getGlobalTag, getUserTag } from "@/lib/dbCache";
import { cacheLife, cacheTag, unstable_cache } from "next/cache";


export async function createAttemptDb(data: {
    userId: string;
    quizId: string;
    answers: Record<string, string>;
}) {
    const selectedOptionIds = Object.values(data.answers);

    // Correct options count
    const score = await prisma.option.count({
        where: {
            id: {
                in: selectedOptionIds,
            },
            isCorrect: true,
        },
    });

    const attempt = await prisma.attempt.create({
        data: {
            userId: data.userId,
            quizId: data.quizId,
            score,
            submittedAt: new Date(),
        }
    });

    return attempt;
}

export async function getMyAttempts(
    userId: string,
    {
        limit = 20,
        page = 1,
    }: {
        limit?: number;
        page?: number;
    }
) {
    "use cache"

    cacheTag(getUserTag(userId, 'attempts'))
    cacheTag(getGlobalTag("attempts"))
    cacheLife("minutes");

    return getMyAttemptsInternal(userId, { limit, page });
}

export async function getAllAttempts({
    page,
    limit,
    search,
    categoryId,
}: {
    page: number;
    limit: number;
    search: string;
    categoryId: string;
}) {
    "use cache"

    cacheTag(getGlobalTag("attempts"));
    cacheLife("minutes")
    return getAllAttemptsInternal({
        limit,
        page,
        categoryId,
        search,
    });

}

async function getAllAttemptsInternal({
    page,
    limit,
    search,
    categoryId,
}: {
    page: number;
    limit: number;
    search: string;
    categoryId: string;
}) {
    const where = {
        AND: [
            categoryId
                ? {
                    quiz: {
                        categoryId,
                    },
                }
                : {},
            search
                ? {
                    OR: [
                        {
                            user: {
                                name: {
                                    contains: search,
                                    mode: "insensitive" as const,
                                },
                            },
                        },
                        {
                            user: {
                                email: {
                                    contains: search,
                                    mode: "insensitive" as const,
                                },
                            },
                        },
                        {
                            quiz: {
                                title: {
                                    contains: search,
                                    mode: "insensitive" as const,
                                },
                            },
                        },
                    ],
                }
                : {},
        ],
    };

    const [attempts, totalAttempts] = await Promise.all([
        prisma.attempt.findMany({
            where,
            include: {
                user: true,
                quiz: true,
            },
            skip: (page - 1) * limit,
            take: limit,
            orderBy: {
                createdAt: "desc",
            },
        }),

        prisma.attempt.count({
            where,
        }),
    ]);

    return {
        attempts,
        totalPages: Math.ceil(totalAttempts / limit),
        totalAttempts,
    };
}

async function getMyAttemptsInternal(userId: string, { limit = 20, page = 1 }: { limit?: number, page?: number }) {
    console.log("Fetching data from DB")
    return prisma.attempt.findMany({
        take: limit,
        skip: page > 1 ? (page - 1) * limit : 0,
        where: {
            userId
        },
        orderBy: {
            submittedAt: "desc"
        },
        select: {
            id: true,
            score: true,
            quizId: true,
            submittedAt: true,
            quiz: {
                select: {
                    duration: true,
                    title: true,
                    totalQuestions: true,
                    category: {
                        select: {
                            text: true
                        }
                    }
                }
            }
        }
    })
}
