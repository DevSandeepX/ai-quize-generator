import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Loader2Icon } from "lucide-react"
import { getUser } from "@/server/db/user";

export default function Onboarding() {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <Suspense
                fallback={
                    <div className="flex h-full w-full items-center justify-center">
                        <Loader2Icon className="size-24 animate-spin" />
                    </div>
                }
            >
                <Verify />
            </Suspense>
        </div>
    );
}


async function Verify() {

    await new Promise((resolve) => setTimeout(resolve, 500));
    const { userId } = await auth()
    if (!userId) redirect("/sign-in")
    const user = await getUser(userId)

    if (!user) return redirect("/");
    if (!user.isApproved) return redirect("/pending-approval");
    if (user.isApproved && (user.role?.role === "ADMIN" || user.role?.role === "TEACHER")) return redirect("/dashboard")
    if (user.isApproved && user.role?.role === "STUDENT") return redirect("/my-attempts");
    if (user.isApproved && user.role?.role === "STUDENT") return redirect("role-pending");

    return (
        <div className="w-full h-full flex items-center justify-center">
            <Loader2Icon className="size-24 animate-spin" />
        </div>
    )
}