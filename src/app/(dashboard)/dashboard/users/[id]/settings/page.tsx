import React, { Suspense } from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { User2Icon } from 'lucide-react'
import ChangeRoleModel from '@/components/ChangeRoleModel'
import { buttonVariants } from '@/components/ui/button'
import UserApprovalDialog from '@/components/UserApprovelForm'
import { PageHeader } from '@/components/PageHeader'
import { getRoles, getUser, getUserByDbId } from '@/server/db/user'
interface StudentSettingsProps {
    params: Promise<{ id: string }>
}
export default async function StudentSettingsPage({
    params
}: StudentSettingsProps) {
    const { id } = await params
    return (
        <div className='container'>
            <Suspense fallback={null}>
                <UserInformation userId={id} />
            </Suspense>
        </div>
    )
}



async function UserInformation({ userId }: {
    userId: string
}) {

    const user = await getUserByDbId(userId)
    if (user == null) return notFound()
    const roles = await getRoles()


    return (
        <div className="w-full space-y-8">
            {/* USER HEADER */}
            <div className="flex justify-between items-start">
                <div className="space-y-3">
                    <PageHeader
                        title={user.name}
                        className='mt-4 mb-8'
                    />

                    <div className="flex items-center gap-3">
                        {user.avatarUrl ? (
                            <Image
                                alt={user.name}
                                src={user.avatarUrl}
                                width={48}
                                height={48}
                                className="rounded-full object-cover"
                            />
                        ) : (
                            <User2Icon className="size-12 text-muted-foreground" />
                        )}

                        <div className="space-y-0.5">
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ROLE SETTINGS */}
            <div className="space-y-3">
                <PageHeader title="Role Settings" />

                {/* Role settings content goes here */}
                <div className="p-4 border rounded-lg flex gap-6 items-start">
                    <h2 className='text-xl font-semibold text-nowrap'>{user.role?.role}</h2>

                    <ChangeRoleModel
                        userId={user.id}
                        role={user.role}
                        roles={roles}
                    >
                        <span className={buttonVariants({ variant: "destructive" })}>
                            Change Role
                        </span>
                    </ChangeRoleModel>
                </div>
            </div>

            {/* APPROVAL SETTINGS */}
            <div className="space-y-4">
                <PageHeader title="Approval Settings" />

                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h3 className="text-lg font-semibold">User Approval</h3>

                            <p className="mt-1 text-sm text-muted-foreground">
                                {user.isApproved
                                    ? "This user has been approved and can access protected features."
                                    : "This user is currently pending approval and has limited access."}
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <span
                                className={`rounded-full px-3 py-1 text-xs font-medium ${user.isApproved
                                    ? "bg-green-100 text-green-700"
                                    : "bg-yellow-100 text-yellow-700"
                                    }`}
                            >
                                {user.isApproved ? "Approved" : "Pending Approval"}
                            </span>

                            <UserApprovalDialog
                                userId={user.id}
                                isApproved={user.isApproved}
                            >
                                <span
                                    className={buttonVariants({
                                        variant: user.isApproved ? "destructive" : "default",
                                    })}
                                >
                                    {user.isApproved ? "Revoke Approval" : "Approve User"}
                                </span>
                            </UserApprovalDialog>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

