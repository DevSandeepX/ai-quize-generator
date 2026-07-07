import React from "react";

interface StatsCardProps {
    title: string;
    value: number;
}

export default function StatsCard({
    title,
    value,
}: StatsCardProps) {
    return (
        <div className="w-full rounded-xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <h2 className="text-sm font-medium text-gray-500">
                {title}
            </h2>

            <p className="mt-2 text-3xl font-bold text-gray-900">
                {value}
            </p>
        </div>
    );
}