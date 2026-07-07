import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import React from 'react'

export default function AttemptTableSkeleton() {
    return (<>

        <div className="bg-background pt-10 pb-16 flex items-center justify-between gap-4">
            <Skeleton className='w-42 animate-pulse h-10' />
            <Skeleton className='w-42 animate-pulse h-10' />
            <Skeleton className='w-68 animate-pulse h-10' />
        </div>

        <div className="pt-10 pb-16 flex flex-col gap-4">
            {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className='grid grid-cols-6 gap-4'>
                    {Array.from({ length: 5 }).map((_, index) => (
                        <Skeleton
                            key={index}
                            className="w-[168px] h-10 rounded-md animate-pulse"
                        />
                    ))}
                </div>
            ))}
        </div>



    </>
    )
}
