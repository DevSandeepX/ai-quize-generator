import {
    getGlobalTag,
    getIdTag,
    getQuizAttemptTag,
    getUserTag,
} from "@/lib/dbCache";
import { revalidateTag } from "next/cache";

export function revalidateAttemptCache(
    attemptId?: string,
    quizId?: string,
    userId?: string
) {
    revalidateTag(getGlobalTag("attempts"), "max");

    if (attemptId) {
        revalidateTag(getIdTag(attemptId, "attempts"), "max");
    }

    if (quizId) {
        revalidateTag(getQuizAttemptTag(quizId), "max");
    }

    if (userId) {
        revalidateTag(getUserTag(userId, "attempts"), "max");
    }
}