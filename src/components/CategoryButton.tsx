"use client";

import clsx from "clsx";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface CategoryButtonProps {
    category: {
        id: string;
        text: string;
    };
}

export default function CategoryButton({
    category: { id, text },
}: CategoryButtonProps) {
    const searchParams = useSearchParams();

    const activeCategory =
        searchParams.get("category") ?? "all";

    const isActive = activeCategory === id;

    return (
        <Link
            href={
                id == "all"
                    ? "/quizes"
                    : `/quizes?category=${id}`
            }
            className={clsx(
                "flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 border whitespace-nowrap",
                isActive
                    ? "bg-black text-white border-black dark:bg-white dark:text-black"
                    : "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700 dark:hover:bg-zinc-700"
            )}
        >
            {text}
        </Link>
    );
}