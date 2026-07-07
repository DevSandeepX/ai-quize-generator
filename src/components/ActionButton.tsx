"use client"

import React, { useTransition } from "react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { actionToast } from "@/lib/actionToast"
import { Loader2Icon, Trash2Icon } from "lucide-react"
import { useRouter } from "next/navigation"

interface ActionButtonProps {
    action: () => Promise<{ success: boolean; message: string }>
    children: React.ReactNode,
    redirectUrl?: string
}

export default function ActionButton({
    action,
    children,
    redirectUrl
}: ActionButtonProps) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    function performAction() {
        startTransition(async () => {
            const res = await action()
            redirectUrl && router.replace(redirectUrl)
            if (res.success) {
                router.refresh()
            }
            actionToast(res)
        })
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger>
                {children}
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>

                    <AlertDialogAction
                        onClick={performAction}
                        disabled={isPending}
                        className="bg-red-100 p-2 rounded hover:bg-red-200"
                    >
                        {isPending ? <Loader2Icon className="size-6 animate-spin" /> : <Trash2Icon className="size-6 text-red-700" />}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}