import { Skeleton } from "@/components/ui/skeleton";

export function ChartSkeleton() {
    return (
        <div className="w-full rounded-xl border p-4 space-y-4">
            {/* Title */}
            <Skeleton className="h-6 w-48" />

            {/* Chart area */}
            <Skeleton className="h-[350px] w-full rounded-lg" />

            {/* X-axis labels */}
            <div className="flex justify-between gap-2">
                {Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton
                        key={i}
                        className="h-4 flex-1 rounded"
                    />
                ))}
            </div>
        </div>
    );
}