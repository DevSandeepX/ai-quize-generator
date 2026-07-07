import { revalidateTag } from "next/cache";

export const CACHE_TAGS = [
    "categories",
    "quizzes",
    "attempts",
    "users",
    "questions",
    "roles",
] as const;

export type ValidTags = typeof CACHE_TAGS[number];

export function getGlobalTag(tag: ValidTags) {
    return `global-${tag}` as const
}

export function getIdTag(id: string, tag: ValidTags) {
    return `id-${id}:${tag}` as const
}

export function getUserTag(userId: string, tag: ValidTags) {
    return `user-${userId}:${tag}` as const
}

export function getCategoryQuizTag(categoryId: string) {
    return `category-${categoryId}:quizzes` as const;
}

export function getQuizQuestionTag(quizId: string) {
    return `quiz-${quizId}:questions` as const;
}
export function getQuizAttemptTag(quizId: string) {
    return `quiz-${quizId}:attempts` as const;
}


export function revalidateFullCache() {
    revalidateTag("*", "max")
}