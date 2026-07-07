
"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useState } from "react";
import { PagePagination, PaginationDropdown, SearchForm } from "@/components/Paginations";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface Attempt {
    id: string;
    score: number;
    startedAt: Date;
    submittedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    quizId: string;
    user: {
        id: string;
        name: string;
        email: string;
        avatarUrl: string | null;
    };
    quiz: {
        id: string;
        title: string;
        totalQuestions: number;
        duration: number;
        categoryId: string | null;
    };
}

interface AttemptTableProps {
    attempts: Attempt[];
    totalPages: number,
    categories: {
        text: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }[]
}

export default function AttemptTable({
    attempts,
    categories,
    totalPages
}: AttemptTableProps) {

    const searchParams = useSearchParams()

    const params = new URLSearchParams(searchParams);
    const category = params.get("categoryId") || ""
    const [categoryId, setCategoryId] = useState(category);
    const router = useRouter()
    const pathname = usePathname()
    return (
        <>
            <div className="bg-background pt-10 pb-16 flex items-center justify-between gap-4">
                <PaginationDropdown />
                <Select
                    value={categoryId}
                    onValueChange={(val) => {
                        const value = val ?? "";

                        setCategoryId(value);

                        const newParams = new URLSearchParams(searchParams);

                        if (value) {
                            newParams.set("categoryId", value);
                        } else {
                            newParams.delete("categoryId");
                        }

                        router.push(`${pathname}?${newParams.toString()}`);
                    }}
                >
                    <SelectTrigger className="w-full max-w-48 h-10 py-4">
                        <SelectValue placeholder="Select a Category">
                            {categories.find((c) => c.id === categoryId)?.text}
                        </SelectValue>
                    </SelectTrigger>

                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Category</SelectLabel>

                            {categories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id}>
                                    {cat.text}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <SearchForm />
            </div>
            <div className="overflow-hidden rounded-xl border bg-background">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Student</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Quiz</TableHead>

                            <TableHead>Score</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Submitted</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {attempts.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={9}
                                    className="h-32 text-center text-muted-foreground"
                                >
                                    No attempts found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            attempts.map((attempt) => (
                                <TableRow key={attempt.id}>
                                    <TableCell className="font-medium">
                                        {attempt.user.name}
                                    </TableCell>

                                    <TableCell className="text-muted-foreground">
                                        {attempt.user.email}
                                    </TableCell>

                                    <TableCell>
                                        {attempt.quiz.title}
                                    </TableCell>





                                    <TableCell>
                                        <Badge variant="secondary">
                                            {attempt.score}
                                        </Badge>
                                    </TableCell>

                                    <TableCell>
                                        {attempt.submittedAt ? (
                                            <Badge className="p-1 rounded">Submitted</Badge>
                                        ) : (
                                            <Badge variant="destructive" className="p-1 rounded">
                                                In Progress
                                            </Badge>
                                        )}
                                    </TableCell>



                                    <TableCell className="text-sm text-muted-foreground">
                                        {attempt.submittedAt
                                            ? format(
                                                new Date(attempt.submittedAt),
                                                "dd MMM yyyy, hh:mm a"
                                            )
                                            : "-"}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="pt-10 pb-16">
                <PagePagination
                    totalPages={totalPages}
                />
            </div>
        </>
    );
}

