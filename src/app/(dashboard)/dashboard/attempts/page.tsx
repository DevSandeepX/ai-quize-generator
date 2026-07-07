import { Suspense } from "react";
import { getAllAttempts } from "@/server/db/attempt";
import { getAllCategories } from "@/server/db/category";
import AttemptTable from "../_components/AttemptTable";
import AttemptTableSkeleton from "../_components/AttemptTableSkeleton";

interface Props {
    searchParams: Promise<{
        page?: string;
        limit?: string;
        search?: string;
        categoryId?: string;
    }>;
}

export default async function AttemptsPage({
    searchParams,
}: Props) {
    const queryParams = await searchParams;

    const page = Number(queryParams.page ?? 1);
    const limit = Number(queryParams.limit ?? 20);
    const categoryId = queryParams.categoryId ?? "";
    const search = queryParams.search ?? "";

    return (
        <div className="w-full">
            <Suspense fallback={<AttemptTableSkeleton />}>
                <SuspendedAttemptTable
                    page={page}
                    limit={limit}
                    search={search}
                    categoryId={categoryId}
                />
            </Suspense>
        </div>
    );
}

async function SuspendedAttemptTable({
    page,
    limit,
    search,
    categoryId,
}: {
    page: number;
    limit: number;
    search: string;
    categoryId: string;
}) {
    const [attemptsData, categoryData] = await Promise.all([
        getAllAttempts({
            page,
            limit,
            search,
            categoryId,
        }),
        getAllCategories(),
    ]);

    return (
        <AttemptTable
            attempts={attemptsData.attempts}
            categories={categoryData}
            totalPages={attemptsData.totalPages}
        />
    );
}