import { QueryParams } from "@/app/(dashboard)/dashboard/quizes/page";
import { cacheLife, cacheTag } from "next/cache";
import { prisma } from "@/lib/db";
import { getCategoryQuizTag, getGlobalTag, getIdTag } from "@/lib/dbCache";

export async function getQuiz(id: string) {
    "use cache"

    const quiz = await prisma.quiz.findFirst({
        where: {
            id,
            status: "PUBLISHED",
        },
        select: {
            id: true,
            title: true,
            status: true,
            totalQuestions: true,
            duration: true,
            teacher: {
                select: {
                    id: true,
                    email: true,
                    name: true,
                    avatarUrl: true,
                }
            },
            questions: {
                select: {
                    id: true,

                    text: true,
                    explanation: true,
                    options: {
                        select: {
                            id: true,
                            text: true,
                            isCorrect: true,
                        },
                    },
                },
            },
        },
    });

    cacheTag(getIdTag(id, "quizzes"))
    return quiz;
}


type QuestionInput = {
    text: string;
    explanation?: string;
    options: {
        text: string;
        isCorrect: boolean;
    }[];
};

export async function createQuizDb(data: {
    title: string,
    duration: number,
    totalQuestions: number,
    questions: QuestionInput[]
    userId: string,
    categoryId: string,
    promptId?: string
}) {
    const quiz = await prisma.quiz.create({
        data: {
            title: data.title,
            duration: data.duration,
            totalQuestions:
                data.totalQuestions,
            status: "DRAFT",
            teacherId: data.userId,
            categoryId: data.categoryId,
            promptId: data.promptId,

            questions: {
                create: data.questions.map(
                    (question) => ({
                        text: question.text,
                        explanation:
                            question.explanation,
                        options: {
                            create:
                                question.options,
                        },
                    })
                ),
            },
        },
    });

    return quiz;

}

export async function getAllQuizes({
    limit,
    page,
    search,
}: QueryParams) {

    "use cache"

    cacheTag(getGlobalTag("quizzes"))
    cacheLife("minutes")
    const where = search
        ? {
            title: {
                contains: search,
                mode: "insensitive" as const,
            },
        }
        : {};

    const [quizes, totalQuizes] = await Promise.all([
        prisma.quiz.findMany({
            where,
            take: limit,
            skip: page > 0 ? (page - 1) * limit : 0,
            orderBy: {
                createdAt: "desc",
            },
            include: {
                category: true,
                teacher: {
                    select: {
                        name: true,
                    },
                },
                _count: {
                    select: {
                        questions: true,
                        attempts: true,
                    },
                },
            },
        }),

        prisma.quiz.count({ where }),
    ]);

    return {
        quizes,
        totalPages: Math.ceil(totalQuizes / limit),
        totalQuizes,
    };

}

export async function getCategoryPublishQuizes({
    limit,
    page,
    search,
    categoryId,
}: {
    limit: number;
    page: number;
    search: string;
    categoryId: string;
}) {
    "use cache"
    cacheTag(getGlobalTag("quizzes"))
    if (categoryId !== "all") {
        cacheTag(getCategoryQuizTag(categoryId));
    }
    cacheLife("minutes")

    return getCategoryPublishQuizesInternal({ categoryId, limit, page, search })
}

async function getCategoryPublishQuizesInternal({
    limit,
    page,
    search,
    categoryId,
}: {
    limit: number;
    page: number;
    search: string;
    categoryId: string;
}) {
    const where = {
        status: "PUBLISHED" as const,

        ...(search && {
            title: {
                contains: search,
                mode: "insensitive" as const,
            },
        }),

        ...(categoryId !== "all" && {
            categoryId,
        }),
    };

    return prisma.quiz.findMany({
        where,
        take: limit,
        skip: (page - 1) * limit,
        orderBy: {
            createdAt: "desc",
        },
        select: {
            id: true,
            title: true,
            description: true,
            duration: true,
            totalQuestions: true,

            teacher: {
                select: {
                    name: true,
                    avatarUrl: true,
                    email: true,
                },
            },

            category: {
                select: {
                    text: true,
                },
            },

            _count: {
                select: {
                    attempts: true,
                },
            },
        },
    });
}

export async function getQuizWithStats(id: string) {
    "use cache"

    const quiz = await prisma.quiz.findFirst({
        where: {
            id,

        },
        select: {
            id: true,
            title: true,
            status: true,
            duration: true,
            createdAt: true,
            updatedAt: true,
            _count: {
                select: {
                    questions: true,
                    attempts: true
                }
            },
            teacher: {
                select: {
                    id: true,
                    email: true,
                    name: true,
                    avatarUrl: true,
                }
            },
            questions: {
                select: {
                    id: true,

                    text: true,
                    explanation: true,
                    options: {
                        select: {
                            id: true,
                            text: true,
                            isCorrect: true,
                        },
                    },
                },
            },
        },
    });

    cacheTag(getIdTag(id, "quizzes"))
    return quiz;
}