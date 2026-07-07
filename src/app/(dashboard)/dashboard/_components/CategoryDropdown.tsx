"use client"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react'

export default function CategoryDropdown({ categories }: {
    categories: {
        id: string;
        text: string;
        createdAt: Date;
        updatedAt: Date;
    }[]
}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const categoryId = searchParams.get("categoryId") || categories?.[0]?.id || "";


    return (
        <Select
            value={categoryId}
            onValueChange={(value) => {

                const params = new URLSearchParams(searchParams);
                if (value === "all") {
                    params.delete("categoryId");
                } else {
                    params.set("categoryId", value as string);
                }

                router.push(`${pathname}?${params.toString()}`);
            }}
        >
            <SelectTrigger className="w-full max-w-52">
                <SelectValue placeholder="Select Category">
                    {
                        categories.find(
                            (item) => item.id === categoryId
                        )?.text
                    }
                </SelectValue>
            </SelectTrigger>

            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Duration</SelectLabel>

                    {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                            {cat.text}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
