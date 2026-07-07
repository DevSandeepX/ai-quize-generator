import React, { Suspense } from 'react'
import DurationDropdown, { DateRange } from '../_components/DurationDropdown'
import { getAllCategories } from '@/server/db/category'
import CategoryDropdown from '../_components/CategoryDropdown'
import { getAnalyticsData, getCategoryQuizesAnalytics, getQuizAttemptsAnalytics } from '@/server/db/analytic'
import AnalyticsChart from '../_components/AnalyticsChart'
import QuizDropdown from '../_components/QuizDropdown'
import { ChartSkeleton } from '../_components/ChartSkeleton'

export default async function AnalyticsPage({
    params,
    searchParams,
}: {
    params: Promise<any>;
    searchParams: Promise<{
        duration: DateRange;
        categoryId: string;
        quizId: string;
    }>;
}) {
    const searchQuery = await searchParams;
    const duration = searchQuery.duration ?? "all";
    const categoryId = searchQuery.categoryId ?? "";
    const quizId = searchQuery.quizId ?? "";

    return (
        <div className="w-full p-4 sm:p-6 pb-10 space-y-10">
            <h2 className="text-2xl sm:text-3xl font-bold">
                Analytics Dashboard
            </h2>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>

                {/* Category Analytics */}
                <section className="space-y-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="grid w-full gap-3 sm:grid-cols-2 lg:w-auto lg:flex lg:flex-row">
                            <DurationDropdown />
                            <Suspense>
                                <SuspendedCategoryDropdown />
                            </Suspense>
                        </div>
                    </div>

                    <Suspense fallback={<ChartSkeleton />}>
                        <SuspendedAnalyticsChart
                            duration={duration}
                            categoryId={categoryId}
                        />
                    </Suspense>
                </section>

                {/* Quiz Analytics */}
                <section className="space-y-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="grid w-full gap-3 sm:grid-cols-2 lg:w-auto lg:flex lg:flex-row">
                            <DurationDropdown />

                            <Suspense>
                                <SuspendedCategoryDropdown />
                            </Suspense>

                            <Suspense>
                                <SuspendedQuizDropdown categoryId={categoryId} />
                            </Suspense>
                        </div>
                    </div>

                    <Suspense fallback={<ChartSkeleton />}>
                        <SuspendedAttemptAnalyticsChart
                            duration={duration}
                            quizId={quizId}
                        />
                    </Suspense>
                </section>
            </div>

        </div>
    );
}

async function SuspendedQuizDropdown({ categoryId }: {
    categoryId: string,

}) {
    const quizData: { id: string; title: string; }[] = await getCategoryQuizesAnalytics({ categoryId })
    if (quizData.length === 0) return null;
    return (
        <QuizDropdown quizes={quizData} />
    )
}

async function SuspendedAnalyticsChart({ categoryId, duration }: { duration: DateRange, categoryId: string }) {
    const analyticsData = await getAnalyticsData({ categoryId, duration })
    return (
        <div className='w-full'>
            <AnalyticsChart
                name='Categories'
                title='Category Analytics'
                data={analyticsData}
            />
        </div>
    )
}

async function SuspendedAttemptAnalyticsChart({ quizId, duration }: { duration: DateRange, quizId: string }) {
    const analyticsData = await getQuizAttemptsAnalytics({ quizId, duration })

    return (
        <div className='w-full'>
            <AnalyticsChart
                name="Quizzes"
                title='Quiz Analytics'
                data={analyticsData}
            />
        </div>
    )
}

async function SuspendedCategoryDropdown() {
    const categories = await getAllCategories()
    return (<CategoryDropdown categories={categories} />)
}