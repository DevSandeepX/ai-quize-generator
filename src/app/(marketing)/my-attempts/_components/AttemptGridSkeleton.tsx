export function AttemptGridSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
                <AttemptCardSkeleton key={i} />
            ))}
        </div>
    );
}

import { Skeleton } from "@/components/ui/skeleton";

export default function AttemptCardSkeleton() {
    return (
        <div className="rounded-2xl border bg-card p-5 shadow-sm">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div className="space-y-3 flex-1">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-5 w-24 rounded-full" />
                </div>

                <div className="space-y-2 rounded-xl border p-3">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-4 w-10" />
                </div>
            </div>

            {/* Stats */}
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="rounded-lg border p-3">
                        <Skeleton className="mb-2 h-4 w-20" />
                        <Skeleton className="h-5 w-12" />
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="mt-4 flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-40" />
            </div>
        </div>
    );
}