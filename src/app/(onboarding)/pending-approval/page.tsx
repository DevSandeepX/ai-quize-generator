"use client"
import { Clock3, Mail, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PendingApprovalPage() {
    const router = useRouter()
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-6">
            <div className="w-full max-w-7xl rounded-3xl border bg-white shadow-xl p-10 text-center">
                {/* Icon */}
                <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-amber-100">
                    <Clock3 className="h-12 w-12 text-amber-600" />
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold text-slate-900">
                    Account Pending Approval
                </h1>

                {/* Description */}
                <p className="mt-4 text-slate-600 leading-relaxed">
                    Your account has been created successfully and is currently waiting
                    for administrator approval.
                </p>

                <div className="mt-8 rounded-2xl border bg-slate-50 p-5 text-left">
                    <div className="flex gap-3">
                        <ShieldCheck className="mt-1 h-5 w-5 text-blue-600" />
                        <div>
                            <h3 className="font-semibold text-slate-800">
                                What happens next?
                            </h3>
                            <p className="mt-1 text-sm text-slate-600">
                                Once an administrator approves your account, you'll receive
                                access to all features of the platform.
                            </p>
                        </div>
                    </div>

                    <div className="mt-5 flex gap-3">
                        <Mail className="mt-1 h-5 w-5 text-green-600" />
                        <div>
                            <h3 className="font-semibold text-slate-800">
                                Need assistance?
                            </h3>
                            <p className="mt-1 text-sm text-slate-600">
                                If approval takes longer than expected, please contact the
                                administrator.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Status Badge */}
                <div className="mt-8 inline-flex items-center rounded-full bg-amber-100 px-5 py-2 text-sm font-medium text-amber-700">
                    ⏳ Waiting for Approval
                </div>

                {/* Optional Button */}
                <div className="flex flex-col md:flex-row gap-6">
                    <button className="mt-8 w-full rounded-xl bg-slate-900 px-4 py-3 font-medium text-white transition hover:bg-slate-800"
                        onClick={() => {
                            router.push("/")
                        }}
                    >
                        Back To Home
                    </button>
                    <button className="mt-8 w-full rounded-xl bg-blue-900 px-4 py-3 font-medium text-white transition hover:bg-blue-800"
                        onClick={() => {
                            router.push("/onboarding")
                        }}
                    >
                        Refresh Status
                    </button>
                </div>
            </div>
        </div>
    );
}