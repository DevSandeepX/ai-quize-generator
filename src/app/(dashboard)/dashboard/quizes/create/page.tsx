import { Suspense } from 'react'
import { PageHeader } from '@/components/PageHeader';
import ManualQuizForm from '../../_components/ManualQuizForm';
import { getAllCategories } from '@/server/db/category';

export default function CreateQuize() {
    return (
        <div className='container'>
            <PageHeader
                title='Generate Quiz'
            />

            <div className='mt-6 mb-10'>
                <Suspense>
                    <SuspendedQuizForm />
                </Suspense>
            </div>
        </div>
    )
}

async function SuspendedQuizForm() {
    const categories = await getAllCategories();

    return (
        <div>
            <ManualQuizForm
                categories={categories}
            />
        </div>
    )
}

