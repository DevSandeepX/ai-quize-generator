import CategoryForm from '@/components/CategoryForm'
import { PageHeader } from '@/components/PageHeader'
import { getCategory } from '@/server/db/category'
import { Suspense } from 'react'

export default async function NewCategory({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    return (
        <div className='container'>
            <Suspense>
                <SuspendedCategoryForm id={id} />
            </Suspense>
        </div>
    )
}


async function SuspendedCategoryForm({ id }: { id: string }) {
    const category = await getCategory(id)
    if (category == null) {
        return (
            <div className='container'>
                <PageHeader
                    title="Category Not Found"
                    className="mt-4 mb-6"
                />
                <p className='text-sm text-gray-500'>The category you are trying to edit does not exist.</p>
            </div>
        )
    }

    return (
        <div className='container'>
            <PageHeader
                title="Edit Category"
                className="mt-4 mb-6"
            />
            <CategoryForm category={category} />
        </div>
    )
}


