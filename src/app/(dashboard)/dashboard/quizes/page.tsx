import Paginations, { PagePagination } from '@/components/Paginations'
import QuizTable from '@/components/QuizTable'
import { getPaginationParams } from '@/lib/getPaginationParams'
import { getAllQuizes } from '@/server/db/quiz'
import Link from 'next/link'
import { Suspense } from 'react'

export interface QueryParams {
    page: number,
    limit: number,
    search: string
}
export interface SearchParams {
    searchParams: Promise<{
        page?: string,
        limit?: string,
        search?: string
    }>

}


export default async function QuizesPage({
    searchParams,
}: SearchParams) {


    const { limit, page, search } = getPaginationParams(await searchParams)

    return (
        <div className="container py-6 space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold">
                        Quizzes
                    </h1>

                    <p className="text-sm text-muted-foreground">
                        Manage and organize your quizzes.
                    </p>
                </div>

                <Link
                    href="/dashboard/quizes/create"
                    className="inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700"
                >
                    + Create Quiz
                </Link>
            </div>

            <Suspense fallback={<QuizzesPageSkeleton />}>
                <SuspendedQuizTable
                    limit={limit}
                    page={page}
                    search={search}
                />
            </Suspense>
        </div>
    );
}


async function SuspendedQuizTable({
    limit,
    page,
    search,
}: QueryParams) {
    const {
        quizes,
        totalPages,
        totalQuizes,
    } = await getAllQuizes({
        limit,
        page,
        search,
    });

    if (!quizes.length)
        return <Empty />;

    const totalAttempts =
        quizes.reduce(
            (acc, q) =>
                acc + q._count.attempts,
            0
        );

    const totalDraft =
        quizes.filter(
            (q) =>
                q.status === "DRAFT"
        ).length;

    const totalPublished =
        quizes.filter(
            (q) =>
                q.status === "PUBLISHED"
        ).length;

    return (
        <div className="space-y-6">
            <QuizStats
                totalQuizes={totalQuizes}
                totalDraft={totalDraft}
                totalPublished={
                    totalPublished
                }
                totalAttempts={
                    totalAttempts
                }
            />

            <Paginations />

            <QuizTable
                quizes={quizes}
            />

            <PagePagination
                totalPages={totalPages}
            />
        </div>
    );
}

function QuizStats({
    totalQuizes,
    totalDraft,
    totalPublished,
    totalAttempts,
}: {
    totalQuizes: number;
    totalDraft: number;
    totalPublished: number;
    totalAttempts: number;
}) {
    const cards = [
        {
            label: "Total Quizzes",
            value: totalQuizes,
        },
        {
            label: "Published",
            value: totalPublished,
        },
        {
            label: "Draft",
            value: totalDraft,
        },
        {
            label: "Attempts",
            value: totalAttempts,
        },
    ];

    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => (
                <div
                    key={card.label}
                    className="rounded-xl border bg-white p-5 shadow-sm"
                >
                    <p className="text-sm text-muted-foreground">
                        {card.label}
                    </p>

                    <h3 className="mt-2 text-3xl font-bold">
                        {card.value}
                    </h3>
                </div>
            ))}
        </div>
    );
}



function Empty() {
    return (
        <div className="flex items-center justify-center min-h-[250px] w-full px-4 mt-6">
            <div className="text-center space-y-4 max-w-md w-full p-6 border border-dashed border-gray-300 rounded-xl bg-gray-50">

                <div className="text-4xl">📭</div>

                <h2 className="text-xl font-semibold text-gray-800">
                    No Quizzes Available
                </h2>

                <p className="text-sm text-gray-500">
                    You don’t have any quizzes yet. Create your first one to get started.
                </p>

                <Link
                    href="/dashboard/quizes/create"
                    className="mt-2 w-full sm:w-auto px-5 py-2 rounded bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"

                >
                    Generate your first quiz
                </Link>

            </div>
        </div>
    );
}

// ============================Db Queries=========================================


// =========================Skeletons========================================
export function QuizTableSkeleton() {
    return (
        <div className="overflow-hidden rounded-xl border bg-white">
            <div className="hidden lg:block">
                {/* Header */}
                <div className="grid grid-cols-8 gap-4 border-b bg-gray-50 p-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-4 animate-pulse rounded bg-gray-200"
                        />
                    ))}
                </div>

                {/* Rows */}
                {Array.from({ length: 10 }).map((_, i) => (
                    <div
                        key={i}
                        className="grid grid-cols-8 gap-4 border-b p-4"
                    >
                        {Array.from({ length: 8 }).map((_, j) => (
                            <div
                                key={j}
                                className="h-5 animate-pulse rounded bg-gray-100"
                            />
                        ))}
                    </div>
                ))}
            </div>

            {/* Mobile Cards */}
            <div className="space-y-4 p-4 lg:hidden">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div
                        key={i}
                        className="space-y-4 rounded-xl border p-4"
                    >
                        <div className="h-5 w-1/2 animate-pulse rounded bg-gray-100" />

                        <div className="h-4 w-1/3 animate-pulse rounded bg-gray-100" />

                        <div className="grid grid-cols-2 gap-3">
                            <div className="h-4 animate-pulse rounded bg-gray-100" />
                            <div className="h-4 animate-pulse rounded bg-gray-100" />
                            <div className="h-4 animate-pulse rounded bg-gray-100" />
                            <div className="h-4 animate-pulse rounded bg-gray-100" />
                        </div>

                        <div className="flex gap-2">
                            <div className="h-9 w-20 animate-pulse rounded-lg bg-gray-100" />
                            <div className="h-9 w-20 animate-pulse rounded-lg bg-gray-100" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
export function QuizFiltersSkeleton() {
    return (
        <div className="flex flex-col gap-4 rounded-xl border bg-white p-4 md:flex-row md:items-center">
            <div className="h-10 w-full animate-pulse rounded-lg bg-gray-100 md:flex-1" />

            <div className="h-10 w-full animate-pulse rounded-lg bg-gray-100 md:w-40" />

            <div className="h-10 w-full animate-pulse rounded-lg bg-gray-100 md:w-40" />

            <div className="h-10 w-full animate-pulse rounded-lg bg-gray-100 md:w-28" />
        </div>
    );
}

export function QuizStatsSkeleton() {
    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
                <div
                    key={i}
                    className="h-28 animate-pulse rounded-xl border bg-gray-100"
                />
            ))}
        </div>
    );
}

export function PaginationSkeleton() {
    return (
        <div className="flex items-center justify-between rounded-xl border bg-white p-4">
            <div className="h-4 w-32 animate-pulse rounded bg-gray-100" />

            <div className="flex gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div
                        key={i}
                        className="h-10 w-10 animate-pulse rounded-lg bg-gray-100"
                    />
                ))}
            </div>
        </div>
    );
}

export function QuizzesPageSkeleton() {
    return (
        <div className="space-y-6">
            <QuizStatsSkeleton />

            <QuizFiltersSkeleton />

            <QuizTableSkeleton />

            <PaginationSkeleton />
        </div>
    );
}