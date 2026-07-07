import CategoryForm from '@/components/CategoryForm'
import { PageHeader } from '@/components/PageHeader'
import React from 'react'

export default function NewCategory() {
    return (
        <div className='container'>
            <PageHeader
                title="Create New Category"
                className="mt-4 mb-6"
            />

            <CategoryForm />
        </div>
    )
}
