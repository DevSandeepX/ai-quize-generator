"use server"

import { prisma } from "@/lib/db"
import { hasPermission } from "@/permissions/generel"
import { auth } from "@clerk/nextjs/server"
import { revalidateCategoryCache } from "../cache/category"
import { requireAdmin } from "@/lib/requireAdmin"

export async function deleteCategory(id: string) {
    try {
        await requireAdmin();

        const category = await prisma.category.delete({
            where: { id },
        });

        revalidateCategoryCache(category.id);

        return {
            success: true,
            message: "Category deleted successfully.",
        };
    } catch (error) {
        console.error("Delete category error:", error);

        return {
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Failed to delete category.",
        };
    }
}

export async function updateCategory(
    id: string,
    data: { text: string }
) {
    try {
        await requireAdmin();

        const category = await prisma.category.update({
            where: { id },
            data,
        });

        revalidateCategoryCache(category.id);

        return {
            success: true,
            message: "Category updated successfully.",
        };
    } catch (error) {
        console.error("Update category error:", error);

        return {
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Failed to update category.",
        };
    }
}

export async function createCategory(data: { text: string }) {
    try {
        await requireAdmin();

        const category = await prisma.category.create({
            data,
        });

        revalidateCategoryCache(category.id);

        return {
            success: true,
            message: "Category created successfully.",
        };
    } catch (error) {
        console.error("Create category error:", error);

        return {
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Failed to create category.",
        };
    }
}
