import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LucideSettings, Trash2Icon } from "lucide-react";
import { deleteUserById } from "@/server/actions/user";
import ActionButton from "./ActionButton";
import Link from "next/link";

interface UserTableProps {
    users: {
        id: string;
        clerkId: string;
        name: string;
        email: string;
        avatarUrl: string | null;
        isApproved: boolean;
        role: {
            id: string;
            role: string;
        } | null;
        createdAt: Date;
        updatedAt: Date;
    }[];
}

export default function UserTable({ users }: UserTableProps) {
    return (
        <div className="w-full overflow-x-auto mb-6">
            <div className="min-w-[900px]">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Created</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {users.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10">
                                    No rows available
                                </TableCell>
                            </TableRow>
                        )}
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                {/* User */}
                                <TableCell className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={user.avatarUrl || ""} />
                                        <AvatarFallback>
                                            {user.name?.slice(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="flex flex-col">
                                        <span className="font-medium">{user.name}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {user.clerkId}
                                        </span>
                                    </div>
                                </TableCell>

                                {/* Email */}
                                <TableCell className="text-muted-foreground">
                                    {user.email}
                                </TableCell>

                                {/* Status */}
                                <TableCell>
                                    <Badge
                                        className={`rounded px-4 py-1.5 text-white ${user.isApproved
                                            ? "bg-green-200 text-green-700 hover:bg-green-600"
                                            : "bg-red-200 text-red-700 hover:bg-red-600"
                                            }`}
                                    >
                                        {user.isApproved ? "Approved" : "Pending"}
                                    </Badge>
                                </TableCell>

                                {/* Role */}
                                <TableCell>
                                    {user.role?.id ? (
                                        <Badge variant="outline">{user.role.role}</Badge>
                                    ) : (
                                        <span className="text-muted-foreground text-sm">
                                            No role
                                        </span>
                                    )}
                                </TableCell>

                                {/* Created */}
                                <TableCell className="text-muted-foreground">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="flex gap-4  items-start">
                                    <ActionButton
                                        action={deleteUserById.bind(null, user.id)}>

                                        <Trash2Icon className="size-6 text-red-500" />
                                    </ActionButton>

                                    <Link href={`/dashboard/users/${user.id}/settings`}>
                                        <LucideSettings className="size-6 text-green-500" />
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}