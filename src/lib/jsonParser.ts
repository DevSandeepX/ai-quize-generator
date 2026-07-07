import { ZodType } from "zod";

export function jsonParser<T>(
    data: string,
    { schema }: { schema: ZodType<T> }
): T[] {
    try {
        const parsed = JSON.parse(data);

        const result = schema
            .array()
            .safeParse(parsed);

        if (!result.success) {
            console.error(
                result.error.flatten()
            );
            return [];
        }

        return result.data;
    } catch (error) {
        console.error(
            "Invalid JSON:",
            error
        );
        return [];
    }
}