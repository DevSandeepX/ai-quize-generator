import { navLinks } from "@/constants";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { Suspense } from "react";
import MobileNav from "@/app/(marketing)/_components/MobileNav";

export default async function NavItems() {
    const { sessionClaims } = await auth();

    const role = (sessionClaims?.metadata as { role?: string })?.role;

    return (
        <nav className="container mx-auto flex h-20 items-center justify-between px-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 font-bold text-white">
                    AI
                </div>

                <h2 className="text-xl md:text-2xl font-bold text-white">
                    Sandeep<span className="text-indigo-400">.dev</span>
                </h2>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden items-center gap-8 lg:flex">
                {navLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className="text-sm font-medium text-slate-300 transition hover:text-white"
                    >
                        {link.label}
                    </Link>
                ))}

                <Suspense>
                    <Show when="signed-in">
                        {role === "admin" ? (
                            <Link href="/onboarding">
                                <button className="rounded bg-indigo-600 px-5 py-2 font-medium text-white hover:bg-indigo-700">
                                    Dashboard
                                </button>
                            </Link>
                        ) : (
                            <Link href="/my-attempts" className="text-sm text-white">
                                My Dashboard
                            </Link>
                        )}

                        <UserButton />
                    </Show>

                    <Show when="signed-out">
                        <SignInButton mode="modal">
                            <button className="rounded border border-slate-700 px-5 py-2 text-slate-300 hover:border-slate-500 hover:text-white">
                                Sign In
                            </button>
                        </SignInButton>

                        <Link href="/sign-up">
                            <button className="rounded bg-indigo-600 px-5 py-2 font-medium text-white hover:bg-indigo-700">
                                Get Started
                            </button>
                        </Link>
                    </Show>
                </Suspense>
            </div>

            {/* Mobile Menu */}
            <div className="lg:hidden">
                <MobileNav role={role} />
            </div>
        </nav>
    );
}