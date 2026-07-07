"use client";

import { QuizStatus } from "@/generated/prisma/enums";
import { useState } from "react";
import { PageHeader } from "./PageHeader";
import { Button } from "./ui/button";
import { actionToast } from "@/lib/actionToast";
import { useRouter } from "next/navigation";
import { updateQuiz } from "@/server/actions/quiz";


interface QuizeStatusSettingFormProps {
    quiz: {
        id: string;
        title: string;
        status: QuizStatus;
    };
}

export default function QuizeStatusSettingForm({
    quiz: { id, status, title },
}: QuizeStatusSettingFormProps) {
    const [selectedStatus, setSelectedStatus] =
        useState<QuizStatus>(status);
    const [isLoading, setLoading] = useState(false)

    const router = useRouter()

    const handleStatusChange = async (newStatus: QuizStatus) => {
        try {
            setLoading(true)

            const res = await updateQuiz({ id, status: selectedStatus })

            if (res?.success) {
                actionToast({ ...res })
                router.refresh()
            }
        } catch (error) {
            actionToast({
                success: false,
                message: "Failed to update quiz status.",
            })

            console.error("Error updating quiz status:", error);
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="mt-8 rounded-xl border p-6">
            <PageHeader title="Publish Settings">
                <Button
                    disabled={selectedStatus === status || isLoading}
                    onClick={() => handleStatusChange(selectedStatus)}
                >
                    {isLoading ? "Saving..." : "Save Status"}
                </Button>
            </PageHeader>

            <p className="mt-2 text-sm text-gray-600">
                Settings <span className="font-medium">"{title}"</span>.
            </p>

            <div className="mt-6 mb-8">
                <label className="mb-2 block text-sm font-medium">
                    Quiz Status
                </label>

                <select
                    value={selectedStatus}
                    onChange={(e) =>
                        setSelectedStatus(e.target.value as QuizStatus)
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {Object.values(QuizStatus).map((status) => (
                        <option key={status} value={status}>
                            {status}
                        </option>
                    ))}
                </select>
            </div>

            <p className="text-sm text-gray-500">
                Selected Status:{" "}
                <span className="font-medium">{selectedStatus}</span>
            </p>
        </div>
    );
}