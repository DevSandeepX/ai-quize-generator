"use server"

import { prisma } from "@/lib/db"
import { getGlobalTag, getIdTag, getUserTag } from "@/lib/dbCache";
import { hasPermission } from "@/permissions/generel";
import { auth } from "@clerk/nextjs/server";
import { revalidateTag } from "next/cache";
import { revalidateUser } from "../cache/user";
import { requireAdmin } from "@/lib/requireAdmin";

// Clerk Webhhok listners
export async function upsertUser(user: User) {
    const data = await prisma.user.upsert({
        where: {
            clerkId: user.clerkId,
        },
        update: {
            name: user.name,
            email: user.email,
            avatarUrl: user.avatarUrl,
        },
        create: {
            clerkId: user.clerkId,
            name: user.name,
            email: user.email,
            avatarUrl: user.avatarUrl,
        }
    });

    if (data) {
        revalidateTag(getGlobalTag("users"), "max")
        revalidateTag(getIdTag(data.id, "users"), "max")
        revalidateTag(getUserTag(data.id, "users"), "max")
    }

    return data
}

export async function deleteUser(id: string) {
    const data = await prisma.user.delete({
        where: { clerkId: id },
        select: {
            id: true,
            email: true,
            name: true,
            role: {
                select: {
                    id: true,
                    role: true
                }
            }
        }
    })

    revalidateUser(data.id)
    return data

}

// Admin
export async function deleteUserById(id: string) {
    try {
        await requireAdmin();

        const deletedUser = await prisma.user.delete({
            where: { id },
        });

        revalidateUser(deletedUser.id);

        return {
            success: true,
            message: "User deleted successfully.",
        };
    } catch (error) {
        console.error("Delete user error:", error);

        return {
            success: false,
            message: "Failed to delete user.",
        };
    }
}

export async function updateUserInfo(
    adminId: string,
    data: Partial<{
        roleId: string;
        isApproved: boolean;
    }>
) {
    try {
        await requireAdmin();

        const updatedUser = await prisma.user.update({
            where: {
                id: adminId,
            },
            data,
        });

        revalidateUser(updatedUser.id);

        return {
            success: true,
            message: "User updated successfully.",
        };
    } catch (error) {
        console.error("Update user error:", error);

        return {
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Failed to update user profile.",
        };
    }
}