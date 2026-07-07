import { prisma } from "@/lib/db";
import { DateRange } from "@/app/(dashboard)/dashboard/_components/DurationDropdown";
import { unstable_cache } from "next/cache";
import { getCategoryQuizTag, getGlobalTag, getQuizAttemptTag } from "@/lib/dbCache";

import { cacheLife, cacheTag } from "next/cache";

export async function getAnalyticsData({
    categoryId,
    duration,
}: {
    categoryId: string;
    duration: DateRange;
}) {
    "use cache";

    cacheTag(getGlobalTag("quizzes"));

    if (categoryId !== "all") {
        cacheTag(getCategoryQuizTag(categoryId));
    }

    cacheLife("minutes");

    return getAnalyticsDataInternal({
        categoryId,
        duration,
    });
}

async function getAnalyticsDataInternal({
    categoryId,
    duration,
}: {
    categoryId: string;
    duration: DateRange;
}) {
    const fromDate = new Date();

    switch (duration) {
        case "3m":
            fromDate.setMonth(fromDate.getMonth() - 3);
            break;
        case "6m":
            fromDate.setMonth(fromDate.getMonth() - 6);
            break;
        case "1y":
            fromDate.setFullYear(fromDate.getFullYear() - 1);
            break;
        case "3y":
            fromDate.setFullYear(fromDate.getFullYear() - 3);
            break;
        default:
            fromDate.setFullYear(2000);
    }

    const where = {
        createdAt: {
            gte: fromDate,
        },
        ...(categoryId !== "all" && {
            categoryId,
        }),
    };

    const quizzes = await prisma.quiz.findMany({
        where,
        select: {
            createdAt: true,
        },
        orderBy: {
            createdAt: "asc",
        },
    });

    const grouped = quizzes.reduce<Record<string, number>>((acc, quiz) => {
        const date = new Date(quiz.createdAt);

        const key =
            duration === "1y" || duration === "3y"
                ? date.getFullYear().toString()
                : date.toLocaleString("en-US", {
                    month: "short",
                    year: "numeric",
                });

        acc[key] = (acc[key] || 0) + 1;

        return acc;
    }, {});

    return Object.entries(grouped).map(([label, count]) => ({
        label,
        count,
    }));
}

export async function getCategoryQuizesAnalytics({
    categoryId,
}: {
    categoryId: string;
}) {
    "use cache";

    cacheTag(getGlobalTag("quizzes"));

    if (categoryId !== "all") {
        cacheTag(getCategoryQuizTag(categoryId));
    }

    cacheLife("minutes");

    return prisma.quiz.findMany({
        where: {
            ...(categoryId !== "all" && {
                categoryId,
            }),
        },
        select: {
            id: true,
            title: true,
        },
        orderBy: {
            title: "asc",
        },
    });
}

export async function getQuizAttemptsAnalytics({
    duration,
    quizId,
}: {
    quizId: string;
    duration: string;
}) {
    "use cache";

    cacheTag(getGlobalTag("attempts"));
    cacheTag(getQuizAttemptTag(quizId));

    cacheLife("minutes");

    return getQuizAttemptsAnalyticsInternal({
        duration,
        quizId,
    });
}

async function getQuizAttemptsAnalyticsInternal({
    duration,
    quizId,
}: {
    quizId: string;
    duration: string;
}) {
    const fromDate = new Date();

    switch (duration) {
        case "3m":
            fromDate.setMonth(fromDate.getMonth() - 3);
            break;
        case "6m":
            fromDate.setMonth(fromDate.getMonth() - 6);
            break;
        case "1y":
            fromDate.setFullYear(fromDate.getFullYear() - 1);
            break;
        case "3y":
            fromDate.setFullYear(fromDate.getFullYear() - 3);
            break;
        default:
            fromDate.setFullYear(2000);
    }

    const attempts = await prisma.attempt.findMany({
        where: {
            quizId,
            createdAt: {
                gte: fromDate,
            },
        },
        select: {
            createdAt: true,
        },
        orderBy: {
            createdAt: "asc",
        },
    });

    const grouped = attempts.reduce<Record<string, number>>((acc, attempt) => {
        const date = new Date(attempt.createdAt);

        const key =
            duration === "1y" || duration === "3y"
                ? date.getFullYear().toString()
                : date.toLocaleString("en-US", {
                    month: "short",
                    year: "numeric",
                });

        acc[key] = (acc[key] || 0) + 1;

        return acc;
    }, {});

    return Object.entries(grouped).map(([label, count]) => ({
        label,
        count,
    }));
}

export async function getDashboardStats() {
    "use cache";

    cacheTag(getGlobalTag("users"));
    cacheTag(getGlobalTag("attempts"));
    cacheTag(getGlobalTag("categories"));
    cacheTag(getGlobalTag("questions"));
    cacheTag(getGlobalTag("quizzes"));

    cacheLife("minutes");

    return getDashboardStatsInternal();
}

async function getDashboardStatsInternal() {
    const [users, categories, quizzes, questions, attempts] = await Promise.all([
        prisma.user.count({
            where: {
                isApproved: true,
            },
        }),
        prisma.category.count(),
        prisma.quiz.count(),
        prisma.question.count(),
        prisma.attempt.count(),
    ]);

    return {
        users,
        categories,
        quizzes,
        questions,
        attempts,
    };
}

export async function getPublicStats() {
    "use cache";

    cacheTag(getGlobalTag("users"));
    cacheTag(getGlobalTag("attempts"));
    cacheTag(getGlobalTag("quizzes"));

    cacheLife("minutes");

    return getPublicStatsInternal();
}

async function getPublicStatsInternal() {
    const [users, attempts, quizzes] = await Promise.all([
        prisma.user.count({
            where: {
                isApproved: true,
            },
        }),
        prisma.attempt.count(),
        prisma.quiz.count({
            where: {
                status: "PUBLISHED",
            },
        }),
    ]);

    return {
        users,
        attempts,
        quizzes,
    };
}

