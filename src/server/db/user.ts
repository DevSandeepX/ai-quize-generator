import { PaginationProps } from "@/app/(dashboard)/dashboard/users/page";
import { prisma } from "@/lib/db";
import { getGlobalTag, getIdTag, getUserTag } from "@/lib/dbCache";
import { cacheLife, } from "next/cache";

import { cacheTag } from "next/cache";


export async function getUser(clerkId: string) {
    "use cache";

    const user = await getUserInternal(clerkId);

    if (user) {
        cacheTag(getUserTag(user.id, "users")); // Database ID
        cacheTag(getIdTag(user.id, "users"));   // Database ID
    }

    return user;
}

async function getUserInternal(clerkId: string) {
    return prisma.user.findUnique({
        where: {
            clerkId,
        },
        select: {
            id: true,
            name: true,
            email: true,
            isApproved: true,
            avatarUrl: true,
            role: {
                select: {
                    id: true,
                    role: true
                }
            }
        }
    });
}


export async function getPaginatedUserData({
    limit = 20,
    page = 1,
    search,
}: PaginationProps) {
    "use cache"

    cacheTag(getGlobalTag("users"))
    cacheLife("minutes");
    return getPaginatedUserDataInternal({ limit, page, search })

}

async function getPaginatedUserDataInternal({
    limit = 20,
    page = 1,
    search,
}: PaginationProps) {
    const where = search
        ? {
            OR: [
                {
                    name: {
                        contains: search,
                        mode: "insensitive" as const,
                    },
                },
                {
                    email: {
                        contains: search,
                        mode: "insensitive" as const,
                    },
                },
            ],
        }
        : {};

    const [users, totalUsers] = await Promise.all([
        prisma.user.findMany({
            where,
            take: limit,
            skip: (page - 1) * limit,
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                avatarUrl: true,
                isApproved: true,
                updatedAt: true,
                clerkId: true,
                role: {
                    select: {
                        id: true,
                        role: true
                    }
                }
            }
        }),
        prisma.user.count({ where }),
    ]);

    return {
        users,
        totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
    };
}

export async function getRoles() {
    "use cache"

    cacheTag(getGlobalTag("roles"))
    return getRolesInternal()
}


async function getRolesInternal() {
    return prisma.role.findMany({
        select: {
            id: true,
            role: true
        }
    })
}

export async function getUserByDbId(id: string) {
    "use cache";

    const user = await getUserByDbIdInternal(id);

    if (user) {
        cacheTag(getUserTag(user.id, "users")); // Database ID
        cacheTag(getIdTag(user.id, "users"));   // Database ID
    }

    return user;
}

async function getUserByDbIdInternal(id: string) {
    return prisma.user.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            name: true,
            email: true,
            isApproved: true,
            avatarUrl: true,
            role: {
                select: {
                    id: true,
                    role: true
                }
            }
        }
    });
}
