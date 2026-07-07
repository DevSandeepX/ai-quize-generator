import ActionButton from "./ActionButton";
import { Trash2Icon } from "lucide-react";
import { buttonVariants } from "./ui/button";
import { PageHeader } from "./PageHeader";
import { deleteQuiz } from "@/server/actions/quiz";

interface DangerZoneSettingProps {
    quiz: {
        id: string;
        title: string;
    };
}

export default function DangerZoneSetting({
    quiz: { id, title },
}: DangerZoneSettingProps) {
    return (
        <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-6">
            <PageHeader
                title="Danger Zone"
                className="text-red-600"
            />

            <p className="mt-2 text-sm text-gray-600">
                Deleting <span className="font-medium">"{title}"</span> is permanent and
                cannot be undone.
            </p>

            <div className="mt-6">
                <ActionButton
                    redirectUrl="/dashboard/quizes"
                    action={deleteQuiz.bind(null, id)}


                >
                    <div className={`flex gap-4 items-center hover:cursor-pointer border text-red-500 border-red-500 px-4 py-1.5 rounded`}>
                        <Trash2Icon className="size-4" />
                        <span>Delete Quiz</span>
                    </div>
                </ActionButton>
            </div>
        </div>
    );
}