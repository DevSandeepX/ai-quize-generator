"use server"

import { requireAdmin } from "@/lib/requireAdmin";
import { createPromptDb } from "../db/prompt";

export async function createPrompt(data: { text: string }) {
    try {
        const loggedInUser = await requireAdmin()
        const res = await createPromptDb({ ...data, userId: loggedInUser.id })
        return {
            data: res,
            success: true,
            message: "Successfully prompt created"
        }
    } catch (err) {
        console.log(err);
        return {
            success: false,
            message: err instanceof Error ? err.message : "Error creating prompt"
        }
    }
}