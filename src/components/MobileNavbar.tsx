"use client";

import { UserButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import Link from "next/link";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import Sidebar from "./Sidebar";

export default function MobileNavbar() {
    return (
        <header className="flex h-16 w-full items-center border-b border-slate-200 bg-white">
            <nav className="container flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 font-bold text-white">
                        AI
                    </div>

                    <h2 className="text-2xl font-bold text-blue-700">
                        Sandeep<span className="text-indigo-400">.dev</span>
                    </h2>
                </Link>

                <div className="flex items-center gap-3">
                    <UserButton />

                    <Sheet>
                        <SheetTrigger render={<button className="rounded-md p-2 hover:bg-white/10 lg:hidden">
                            <Menu className="size-6 text-white" />
                        </button>} />

                        <SheetContent
                            side="left"
                            className="w-[270px] p-0"
                        >
                            <Sidebar />
                        </SheetContent>
                    </Sheet>
                </div>
            </nav>
        </header>
    );
}