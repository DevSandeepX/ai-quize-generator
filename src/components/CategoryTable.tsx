import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Pencil, PencilIcon, SquarePen, Trash2Icon } from "lucide-react";
import ActionButton from "./ActionButton";
import Link from "next/link";
import { deleteCategory } from "@/server/actions/category";

interface CategoryTableProps {
    categories: {
        id: string;
        text: string;
        createdAt: Date;
        updatedAt: Date;
    }[];
}

export default function CategoryTable({
    categories,
}: CategoryTableProps) {
    return (
        <div className="overflow-x-auto rounded-lg border bg-background shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-20">#</TableHead>
                        <TableHead>Category Name</TableHead>
                        <TableHead>Created On</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {categories.length > 0 ? (
                        categories.map((category, index) => (
                            <TableRow key={category.id}>
                                <TableCell className="font-medium">
                                    {index + 1}
                                </TableCell>

                                <TableCell>{category.text}</TableCell>

                                <TableCell>
                                    {format(category.createdAt, "dd MMM yyyy")}
                                </TableCell>

                                <TableCell className="flex items-start justify-end gap-4">
                                    <ActionButton
                                        action={deleteCategory.bind(null, category.id)}
                                    >

                                        {/* Add Edit/Delete buttons here */}
                                        <span className="cursor-pointer flex items-center gap-2 rounded-md border px-3 py-2 hover:bg-gray-100">
                                            <Trash2Icon className="text-red-500 size-6" /> Remove
                                        </span>
                                    </ActionButton>

                                    {/* TODO:edit action */}
                                    <Link href={`/dashboard/categories/${category.id}/edit`} className="ml-4 text-blue-500 hover:underline">
                                        <button className="flex items-center gap-2 rounded-md border px-3 py-2 hover:bg-gray-100">
                                            <SquarePen className="h-4 w-4" />
                                            Edit
                                        </button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={4}
                                className="py-8 text-center text-muted-foreground"
                            >
                                No categories found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}