import { prisma } from "@/lib/db";
import { getGlobalTag, getIdTag } from "@/lib/dbCache";
import { cacheTag } from "next/cache";
export async function getCategory(id: string) {
    "use cache"
    cacheTag(getIdTag(id, "categories"))
    return getCategoryInternal(id)

}

async function getCategoryInternal(id: string) {
    return prisma.category.findUnique({
        where: { id },
        select: {
            id: true,
            text: true
        }
    })
}

export async function getAllCategories() {
    "use cache"

    cacheTag(getGlobalTag("categories"))

    return getAllCategoriesInternal()
}

async function getAllCategoriesInternal() {
    return prisma.category.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
}

export async function getPaginatedCategories({
    page,
    limit,
    search,
}: {
    page: number;
    limit: number;
    search: string;
}) {
    "use cache";

    cacheTag(getGlobalTag("categories"));

    return getPaginatedCategoriesInternal({
        page,
        limit,
        search,
    });
}

async function getPaginatedCategoriesInternal({
    page,
    limit,
    search,
}: {
    page: number;
    limit: number;
    search: string;
}) {
    const where = search
        ? {
            text: {
                contains: search,
                mode: "insensitive" as const,
            },
        }
        : {};

    const [categories, totalCategories] = await Promise.all([
        prisma.category.findMany({
            where,
            select: {
                id: true,
                text: true,
                createdAt: true,
                updatedAt: true
            },
            skip: (page - 1) * limit,
            take: limit,
            orderBy: {
                createdAt: "desc",
            },
        }),

        prisma.category.count({
            where,
        }),
    ]);

    return {
        categories,
        totalCategories,
        totalPages: Math.ceil(totalCategories / limit),
        currentPage: page,
        limit,
    };
}