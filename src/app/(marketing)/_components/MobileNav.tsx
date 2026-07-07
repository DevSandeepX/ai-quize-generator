"use client";

import { navLinks } from "@/constants";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";

export default function MobileNav({
    role,
}: {
    role?: string;
}) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button onClick={() => setOpen(!open)}>
                {open ? (
                    <X className="text-white" />
                ) : (
                    <Menu className="text-white" />
                )}
            </button>

            {open && (
                <div className="absolute left-0 top-20 z-50 w-full bg-slate-950 border-t border-slate-800">
                    <div className="flex flex-col gap-5 p-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setOpen(false)}
                                className="text-slate-300"
                            >
                                {link.label}
                            </Link>
                        ))}

                        <Show when="signed-in">
                            {role === "admin" ? (
                                <Link href="/onboarding">
                                    <button className="w-full rounded bg-indigo-600 py-2 text-white">
                                        Dashboard
                                    </button>
                                </Link>
                            ) : (
                                <Link href="/my-attempts" className="text-white">
                                    My Dashboard
                                </Link>
                            )}

                            <UserButton />
                        </Show>

                        <Show when="signed-out">
                            <SignInButton mode="modal">
                                <button className="rounded border border-slate-700 py-2 text-slate-300">
                                    Sign In
                                </button>
                            </SignInButton>

                            <Link href="/sign-up">
                                <button className="w-full rounded bg-indigo-600 py-2 text-white">
                                    Get Started
                                </button>
                            </Link>
                        </Show>
                    </div>
                </div>
            )}
        </>
    );
}