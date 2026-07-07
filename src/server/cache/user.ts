import { revalidateTag } from "next/cache";
import { getGlobalTag, getIdTag, getUserTag } from "@/lib/dbCache";

export function revalidateUser(userId?: string) {
    revalidateTag(getGlobalTag("users"), "max");

    if (!userId) return;

    revalidateTag(getIdTag(userId, "users"), "max");
    revalidateTag(getUserTag(userId, "users"), "max");
}