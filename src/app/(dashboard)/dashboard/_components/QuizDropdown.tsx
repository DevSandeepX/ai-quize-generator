"use client";

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function QuizDropdown({
    quizes,
}: {
    quizes: { id: string; title: string }[];
}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const quizId =
        searchParams.get("quizId") ??
        quizes?.[0]?.id ??
        "";

    return (
        <Select
            value={quizId}
            onValueChange={(value) => {
                const params = new URLSearchParams(searchParams);

                if (!value) {
                    params.delete("quizId");
                } else {
                    params.set("quizId", value);
                }

                router.push(`${pathname}?${params.toString()}`);
            }}
        >
            <SelectTrigger>
                <SelectValue placeholder="Select Quiz">
                    {quizes.find(q => q.id == quizId)?.title}
                </SelectValue>
            </SelectTrigger>

            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Quiz</SelectLabel>

                    {quizes.map((q) => (
                        <SelectItem
                            key={q.id}
                            value={q.id}
                        >
                            {q.title}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}