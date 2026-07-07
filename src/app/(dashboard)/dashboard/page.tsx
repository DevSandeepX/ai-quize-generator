import StatsCard from '@/components/StatsCard'
import Link from 'next/link'
import { Suspense } from 'react'

import {
    Users,
    FolderTree,
    ClipboardList,
    History,
} from "lucide-react";
import { getDashboardStats } from '@/server/db/analytic';



const actions = [
    {
        title: "Manage Users",
        href: "/dashboard/users",
        icon: Users,
    },
    {
        title: "Manage Categories",
        href: "/dashboard/categories",
        icon: FolderTree,
    },
    {
        title: "Manage Quizzes",
        href: "/dashboard/quizes",
        icon: ClipboardList,
    },
    {
        title: "View Attempts",
        href: "/dashboard/attempts",
        icon: History,
    },
];

export default function Dashboard() {
    return (
        <div className='w-full h-screen'>
            <Suspense fallback={<StatsCardSkeletonGrid />}>
                <StatsGrid />
            </Suspense>
            <QuickActions />
        </div>
    )
}



export function QuickActions() {
    return (
        <div className='container mt-20'>
            <div className='w-full mb-6'>
                <h2 className='text-2xl font-semibold'>Quick Actions</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {actions.map((action) => {
                    const Icon = action.icon;
                    return (
                        <Link
                            key={action.href}
                            href={action.href}
                            className="flex flex-col items-center justify-center gap-3 rounded-xl border bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                        >
                            <div className="rounded-full bg-blue-100 p-3">
                                <Icon className="h-6 w-6 text-blue-700" />
                            </div>

                            <span className="text-center font-medium text-gray-700">
                                {action.title}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

async function StatsGrid() {
    const data = await getDashboardStats()

    return (
        <section className='container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8'>
            <StatsCard
                title="Total Users"
                value={data.users}
            />
            <StatsCard
                title="Total Categories"
                value={data.categories}
            />
            <StatsCard
                title="Total Quizzes"
                value={data.quizzes}
            />
            <StatsCard
                title="Total Questions"
                value={data.questions}
            />
            <StatsCard
                title="Total Attempts"
                value={data.attempts}
            />
        </section>
    )
}



export function StatsCardSkeleton() {
    return (
        <div className="w-full rounded-xl border bg-white p-6 shadow-sm animate-pulse">
            <div className="h-4 w-24 rounded bg-gray-200" />

            <div className="mt-4 h-8 w-16 rounded bg-gray-200" />
        </div>
    );
}

function StatsCardSkeletonGrid() {
    return (<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 5 }).map((_, i) => (
            <StatsCardSkeleton key={i} />
        ))}
    </div>
    )
}