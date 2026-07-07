import CategoryTable from '@/components/CategoryTable'
import { PageHeader } from '@/components/PageHeader'
import Paginations, { PagePagination } from '@/components/Paginations'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'
import CategoryTableSkeleton from '../_components/CategoryTableSkeleton'
import { getAllCategories, getPaginatedCategories } from '@/server/db/category'


export default async function CategoriesPage({
    searchParams,
}: {
    searchParams: Promise<{
        page?: string;
        limit?: string;
        search?: string;
    }>;
}) {
    const params = await searchParams;

    const page = Number(params.page ?? 1);
    const limit = Number(params.limit ?? 20);
    const search = params.search ?? "";

    return (
        <div className="container">
            <Suspense
                key={`${page}-${limit}-${search}`}
                fallback={<CategoryTableSkeleton />}
            >
                <CategoriesTableSection
                    page={page}
                    limit={limit}
                    search={search}
                />
            </Suspense>
        </div>
    );
}

export async function CategoriesTableSection({
    page,
    limit,
    search,
}: {
    page: number;
    limit: number;
    search: string;
}) {
    const { categories, totalPages } = await getPaginatedCategories({ limit, page, search });
    // TODO : add pagination function

    return (
        <div className="space-y-6">
            <PageHeader
                title="Manage Categories"
                className="mt-6"
            >
                <Link href="/dashboard/categories/new" className="rounded flex items-center bg-blue-700 px-3 py-2 text-sm text-white hover:bg-blue-700/80">
                    <Plus className='mr-2' />
                    Create New Category
                </Link>
            </PageHeader>
            {/* Top Pagination */}
            <div className="flex items-center justify-end">
                <Paginations />
            </div>

            {/* Responsive Table */}
            <div className="overflow-x-auto rounded-lg border bg-background shadow-sm">
                <CategoryTable categories={categories} />
            </div>

            {/* Bottom Pagination */}
            <div className="flex justify-center sm:justify-end">
                <PagePagination totalPages={totalPages} />
            </div>
        </div>
    )
}

