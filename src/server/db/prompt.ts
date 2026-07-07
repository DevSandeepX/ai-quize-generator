import { prisma } from "@/lib/db";

export async function createPromptDb(data: { userId: string, text: string }) {
    return await prisma.prompt.create({
        data: {
            ...data
        }
    })
}