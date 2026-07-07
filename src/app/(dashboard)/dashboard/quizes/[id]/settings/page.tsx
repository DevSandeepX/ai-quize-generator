import DangerZonSetting from '@/components/DangerZonSetting'
import QuizeStatusSettingForm from '@/components/QuizeStatusSettingForm'
import { getQuiz, getQuizWithStats } from '@/server/db/quiz'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

export default async function QuiSetting({ params }: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    return (
        <div className='container'>
            <Suspense fallback={null}>
                <SuspendedPage
                    id={id}
                />
            </Suspense>
        </div>
    )
}


async function SuspendedPage({ id }: {
    id: string
}) {
    const quiz = await getQuizWithStats(id)
    if (quiz == null) return notFound();
    return (
        <div className='p-4 rounded shadow'>
            <QuizeStatusSettingForm quiz={quiz} />
            <DangerZonSetting quiz={quiz} />
        </div>
    )


}

