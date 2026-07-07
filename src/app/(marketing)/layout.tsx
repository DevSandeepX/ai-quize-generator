import NavItems from '@/components/NavItems'
import React, { Suspense } from 'react'

export default function MarketingLayout({ children }: {
    children: React.ReactNode
}) {
    return (
        <div className='w-full'>
            <div className='bg-[#1C1A31]'>
                <Suspense>
                    <NavItems />
                </Suspense>
            </div>
            <main className="">
                <Suspense>
                    {children}
                </Suspense>
            </main>
        </div>
    )
}
