"use client";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
export type DateRange = (typeof dateRanges)[number]["value"];
export
    const dateRanges = [
        { label: "Last 7 Days", value: "7d" },
        { label: "Last 30 Days", value: "30d" },
        { label: "Last 3 Months", value: "3m" },
        { label: "Last 6 Months", value: "6m" },
        { label: "Last 1 Year", value: "1y" },
        { label: "Last 3 Years", value: "3y" },
        { label: "All Time", value: "all" },
    ];

export default function DurationDropdown() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const duration = searchParams.get("duration") || "all";

    const [selectedRange, setSelectedRange] =
        useState<DateRange>("1y");

    return (
        <Select
            value={duration}
            onValueChange={(value) => {
                setSelectedRange(value as DateRange)
                const params = new URLSearchParams(searchParams);
                if (value === "all") {
                    params.delete("duration");
                } else {
                    params.set("duration", value as string);
                }

                router.push(`${pathname}?${params.toString()}`);
            }}
        >
            <SelectTrigger className="w-full max-w-52">
                <SelectValue placeholder="Select Duration">
                    {
                        dateRanges.find(
                            (item) => item.value === selectedRange
                        )?.label
                    }
                </SelectValue>
            </SelectTrigger>

            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Duration</SelectLabel>

                    {dateRanges.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                            {item.label}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}