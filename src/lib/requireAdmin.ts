import { auth } from "@clerk/nextjs/server"
import { prisma } from "./db"
import { hasPermission } from "@/permissions/generel"

export async function requireAdmin() {
    const { userId } = await auth()

    if (!userId) {
        throw new Error("Unauthorized")
    }

    const user = await prisma.user.findUnique({
        where: {
            clerkId: userId,
        },
        select: {
            id: true,
            role: {
                select: {
                    role: true,
                },
            },
        },
    })

    if (!user) throw new Error("User not found")

    if (!hasPermission({ role: user?.role?.role })) {
        throw new Error("Forbidden")
    }

    return user
}