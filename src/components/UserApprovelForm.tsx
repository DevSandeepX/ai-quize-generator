"use client";

import React, { useTransition } from "react";
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
} from "@/components/ui/alert-dialog";

import { updateUserInfo } from "@/server/actions/user";
import { actionToast } from "@/lib/actionToast";
import { useRouter } from "next/navigation";

interface UserApprovalDialogProps {
    userId: string;
    isApproved: boolean;
    children: React.ReactNode;
}

export default function UserApprovalDialog({
    userId,
    isApproved,
    children,
}: UserApprovalDialogProps) {
    const [isPending, startTransition] = useTransition();
    const [open, setOpen] = React.useState(false);
    const router = useRouter()


    const handleApprovalChange = () => {
        startTransition(async () => {
            try {
                const response = await updateUserInfo(userId, {
                    isApproved: !isApproved,
                });
                if (response.success) {
                    setOpen(false);
                    router.refresh()
                }

                actionToast(response);
            } catch (error) {
                console.error(error);
            }
        });
    };

    const title = isApproved
        ? "Revoke User Approval"
        : "Approve User";

    const description = isApproved
        ? "This user will lose approval and may no longer be able to access features that require an approved account."
        : "This will approve the user and allow access to features that require an approved account.";

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger>
                {children}
            </AlertDialogTrigger>

            <AlertDialogContent className="sm:max-w-md">
                <AlertDialogHeader className="space-y-3">
                    <AlertDialogTitle>{title}</AlertDialogTitle>

                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className="flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    <AlertDialogCancel
                        disabled={isPending}
                        className="w-full sm:w-auto"
                    >
                        Cancel
                    </AlertDialogCancel>

                    <AlertDialogAction
                        onClick={handleApprovalChange}
                        disabled={isPending}
                        className="w-full sm:w-auto"
                    >
                        {isPending
                            ? "Please wait..."
                            : isApproved
                                ? "Revoke Approval"
                                : "Approve User"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}