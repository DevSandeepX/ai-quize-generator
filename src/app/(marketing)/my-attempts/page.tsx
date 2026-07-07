import { auth } from '@clerk/nextjs/server'
import { Suspense } from 'react'
import AttemptCard from './_components/AttemptCard'
import NoAttempt from './_components/NoAttempt'
import { AttemptGridSkeleton } from './_components/AttemptGridSkeleton'
import { redirect } from 'next/navigation'
import { getUser } from '@/server/db/user'
import { getMyAttempts } from '@/server/db/attempt'

export default function MyQuizesPage() {
    return (
        <div className='container space-y-8 pt-10 pb-16'>
            <div>
                <h1 className="text-2xl font-bold">My Attempts</h1>
                <p className="text-muted-foreground">
                    View your quiz history and scores.
                </p>
            </div>
            <Suspense fallback={<AttemptGridSkeleton />}>
                <SuspendedPage />
            </Suspense>
        </div>
    )
}


async function SuspendedPage() {
    const { userId, redirectToSignIn } = await auth()

    if (userId == null) {
        return redirectToSignIn()
    }

    const user = await getUser(userId)

    if (user == null) {
        return redirect('/')
    }

    const attempts = await getMyAttempts(user.id, { limit: 20, page: 1 });

    if (attempts.length === 0) {
        return <NoAttempt />
    }

    return (
        <div className="space-y-6">

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {attempts.map((attempt) => (
                    <AttemptCard key={attempt.id} attempt={attempt} />
                ))}
            </div>
        </div>
    );
}