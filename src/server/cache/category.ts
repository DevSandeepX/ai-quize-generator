import { getCategoryQuizTag, getGlobalTag, getIdTag } from "@/lib/dbCache";
import { revalidateTag } from "next/cache";

export function revalidateCategoryCache(categoryId?: string) {
    revalidateTag(getGlobalTag("categories"), "max");

    if (categoryId) {
        revalidateTag(getIdTag(categoryId, "categories"), "max");
        revalidateTag(getCategoryQuizTag(categoryId), "max");
    }
}
