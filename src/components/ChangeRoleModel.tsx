"use client";

import React, { useEffect, useState, useTransition } from "react";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { updateUserInfo } from "@/server/actions/user";
import { actionToast } from "@/lib/actionToast";
import { useRouter } from "next/navigation";

interface Role {
    id: string;
    role: string;
}

interface ChangeRoleModalProps {
    userId: string;
    role: Role | null;
    roles: Role[];
    children: React.ReactNode;
}

export default function ChangeRoleModal({
    userId,
    role,
    roles,
    children,
}: ChangeRoleModalProps) {
    const [selectedRole, setSelectedRole] = useState(role?.id ?? "");
    const [isPending, startTransition] = useTransition();
    const [open, setOpen] = React.useState(false);
    const router = useRouter()

    useEffect(() => {
        setSelectedRole(role?.id ?? "");
    }, [role]);

    const handleRoleChange = () => {
        if (!selectedRole || selectedRole === role?.id) return;
        startTransition(async () => {
            try {
                const response = await updateUserInfo(userId, {
                    roleId: selectedRole
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

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger>{children}</AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Change User Role</AlertDialogTitle>

                    <div className="mt-4">
                        <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            disabled={isPending}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                        >
                            {roles.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.role}
                                </option>
                            ))}
                        </select>
                    </div>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>
                        Cancel
                    </AlertDialogCancel>

                    <AlertDialogAction
                        disabled={
                            isPending ||
                            !selectedRole ||
                            selectedRole === role?.id
                        }
                        onClick={handleRoleChange}
                    >
                        {isPending ? "Updating..." : "Assign Role"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}