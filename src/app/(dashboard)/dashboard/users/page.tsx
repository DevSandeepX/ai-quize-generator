import { PageHeader } from '@/components/PageHeader'
import Paginations, { PagePagination } from '@/components/Paginations'
import UserTable from '@/components/UserTable'
import { Suspense } from 'react'
import UserTableSkeleton from '../_components/UserTableSkeleton'
import { getPaginatedUserData } from '@/server/db/user'

interface UsersPageProps {
    searchParams: Promise<{ page?: string, limit?: string, search?: string }>
}
export default async function UsersPage({
    searchParams
}: UsersPageProps) {
    const params = await searchParams
    const page = Number(params.page || 1)
    const limit = Number(params.limit || 20)
    const search = String(params.search || "")

    return (
        <main className='container'>
            <PageHeader
                className="mt-4 mb-6"
                title="Manage Users"
            />
            <section className="w-full">
                <Suspense fallback={<UserTableSkeleton />}>
                    <UserTableSuspense
                        limit={limit}
                        page={page}
                        search={search}
                    />
                </Suspense>
            </section>

        </main>
    )
}


async function UserTableSuspense({
    limit,
    page,
    search
}: PaginationProps) {
    const { users, totalPages, totalUsers } = await getPaginatedUserData({
        limit,
        page,
        search
    })
    return (
        <div className='w-full'>
            <Paginations />
            <UserTable users={users} />
            {/* Pagination */}
            {users.length > 0 && (
                <div className="flex justify-center overflow-x-auto">
                    <PagePagination totalPages={totalPages} />
                </div>
            )}
        </div>
    )
}

export interface PaginationProps {
    limit?: number,
    page?: number,
    search?: string
}



