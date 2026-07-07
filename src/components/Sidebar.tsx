"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    FileQuestion,
    Tags,
    ClipboardCheck,
    Sparkles,
    BarChart3,
    Settings,
} from "lucide-react";
import clsx from "clsx";

const links = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Manage Users",
        href: "/dashboard/users",
        icon: Users,
    },
    {
        title: "Quizzes",
        href: "/dashboard/quizes",
        icon: FileQuestion,
    },
    {
        title: "Categories",
        href: "/dashboard/categories",
        icon: Tags,
    },
    {
        title: "Attempts",
        href: "/dashboard/attempts",
        icon: ClipboardCheck,
    },
    {
        title: "Generate with AI",
        href: "/dashboard/ai-generate",
        icon: Sparkles,
    },
    {
        title: "Analytics",
        href: "/dashboard/analytics",
        icon: BarChart3,
    },
    {
        title: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
    },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="flex h-full w-full flex-col overflow-y-auto no-scrollbar border-r border-slate-200 bg-white">
            {/* Logo */}
            <div className="border-b border-slate-200 p-6">
                <h2 className="text-2xl font-bold text-slate-900">
                    AI<span className="text-indigo-600">Sandeep.dev</span>
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                    Admin Dashboard
                </p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2 p-4">
                {links.map((link) => {
                    const Icon = link.icon;
                    const active = pathname === link.href;

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={clsx(
                                "flex items-center gap-3 rounded-xl px-4 py-3 transition-all",
                                active
                                    ? "bg-indigo-50 text-indigo-700"
                                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                            )}
                        >
                            <Icon
                                className={clsx(
                                    "size-5",
                                    active
                                        ? "text-indigo-600"
                                        : "text-slate-500"
                                )}
                            />

                            <span className="font-medium">
                                {link.title}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            {/* AI Card */}
            <div className="m-4 rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100">
                    <Sparkles className="size-6 text-indigo-600" />
                </div>

                <h3 className="font-semibold text-slate-900">
                    Generate Quiz with AI
                </h3>

                <p className="mt-1 text-sm text-slate-600">
                    Create quizzes in seconds using AI.
                </p>

                <Link
                    href="/dashboard/ai-generate"
                    className="mt-4 inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 w-full"
                >
                    Try Now
                </Link>
            </div>

        </aside>
    );
}