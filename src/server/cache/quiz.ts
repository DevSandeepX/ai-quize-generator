import { getCategoryQuizTag, getGlobalTag, getIdTag, getQuizAttemptTag, getQuizQuestionTag } from "@/lib/dbCache";
import { revalidateTag } from "next/cache";

export function revalidateQuizCache(
    quizId?: string,
    categoryId?: string
) {
    revalidateTag(getGlobalTag("quizzes"), "max");

    if (quizId) {
        revalidateTag(getIdTag(quizId, "quizzes"), "max");
        revalidateTag(getQuizQuestionTag(quizId), "max");
        revalidateTag(getQuizAttemptTag(quizId), "max");
    }

    if (categoryId) {
        revalidateTag(getCategoryQuizTag(categoryId), "max");
    }
}