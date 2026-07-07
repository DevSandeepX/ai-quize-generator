import Link from "next/link";
import {
    Eye,
    Pencil,
    Trash2,
    Clock3,
    FileQuestion,
} from "lucide-react";
import ActionButton from "./ActionButton";
import { deleteQuiz } from "@/server/actions/quiz";

interface QuizTableProps {
    quizes: any[];
}

export default function QuizTable({
    quizes,
}: QuizTableProps) {
    return (
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
            {/* Desktop */}
            <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                    <thead className="border-b bg-gray-50">
                        <tr className="text-left text-sm text-gray-500">
                            <th className="px-6 py-4">
                                Quiz
                            </th>
                            <th className="px-6 py-4">
                                Category
                            </th>
                            <th className="px-6 py-4">
                                Questions
                            </th>
                            <th className="px-6 py-4">
                                Duration
                            </th>
                            <th className="px-6 py-4">
                                Attempts
                            </th>
                            <th className="px-6 py-4">
                                Status
                            </th>
                            <th className="px-6 py-4">
                                Created
                            </th>
                            <th className="px-6 py-4">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {quizes.map((quiz) => (
                            <tr
                                key={quiz.id}
                                className="border-b last:border-none"
                            >
                                <td className="px-6 py-4">
                                    <div>
                                        <p className="font-medium">
                                            {quiz.title}
                                        </p>

                                        <p className="text-sm text-gray-500">
                                            By{" "}
                                            {
                                                quiz.teacher
                                                    ?.name
                                            }
                                        </p>
                                    </div>
                                </td>

                                <td className="px-6 py-4">
                                    {quiz.category
                                        ?.text ??
                                        "Uncategorized"}
                                </td>

                                <td className="px-6 py-4">
                                    {
                                        quiz._count
                                            .questions
                                    }
                                </td>

                                <td className="px-6 py-4">
                                    {quiz.duration} min
                                </td>

                                <td className="px-6 py-4">
                                    {
                                        quiz._count
                                            .attempts
                                    }
                                </td>

                                <td className="px-6 py-4">
                                    <StatusBadge
                                        status={
                                            quiz.status
                                        }
                                    />
                                </td>

                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {new Date(
                                        quiz.createdAt
                                    ).toLocaleDateString()}
                                </td>

                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        <Link
                                            href={`/dashboard/quizes/${quiz.id}`}
                                            className="rounded-md p-2 hover:bg-gray-100"
                                        >
                                            <Eye className="size-4" />
                                        </Link>

                                        <Link
                                            href={`/dashboard/quizes/${quiz.id}/edit`}
                                            className="rounded-md p-2 hover:bg-gray-100"
                                        >
                                            <Pencil className="size-4" />
                                        </Link>

                                        <ActionButton action={deleteQuiz.bind(null, quiz.id)}>


                                            <Trash2 className="size-4" />

                                        </ActionButton>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile */}
            <div className="grid gap-4 p-4 lg:hidden">
                {quizes.map((quiz) => (
                    <div
                        key={quiz.id}
                        className="rounded-xl border p-4"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="font-semibold">
                                    {quiz.title}
                                </h3>

                                <p className="text-sm text-gray-500">
                                    {quiz.category
                                        ?.text ??
                                        "Uncategorized"}
                                </p>
                            </div>

                            <StatusBadge
                                status={quiz.status}
                            />
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2">
                                <FileQuestion className="size-4 text-gray-500" />
                                {
                                    quiz._count
                                        .questions
                                }{" "}
                                Questions
                            </div>

                            <div className="flex items-center gap-2">
                                <Clock3 className="size-4 text-gray-500" />
                                {quiz.duration} min
                            </div>

                            <div>
                                Attempts:{" "}
                                {
                                    quiz._count
                                        .attempts
                                }
                            </div>

                            <div className="text-gray-500">
                                {new Date(
                                    quiz.createdAt
                                ).toLocaleDateString()}
                            </div>
                        </div>

                        <div className="mt-4 flex gap-2">
                            <Link
                                href={`/dashboard/quizes/${quiz.id}/settings`}
                                className="rounded-md border px-3 py-2 text-sm"
                            >
                                Settings
                            </Link>



                            <ActionButton
                                action={deleteQuiz.bind(null, quiz.id)}
                            >
                                <span
                                    className="rounded-md border px-3 py-2 text-sm text-red-500 hover:bg-red-50"
                                >Delete</span>
                            </ActionButton>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function StatusBadge({
    status,
}: {
    status: string;
}) {
    const styles = {
        DRAFT:
            "bg-yellow-100 text-yellow-700",
        PUBLISHED:
            "bg-green-100 text-green-700",
        ARCHIVED:
            "bg-gray-100 text-gray-700",
    };

    return (
        <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${styles[
                status as keyof typeof styles
            ]
                }`}
        >
            {status}
        </span>
    );
}