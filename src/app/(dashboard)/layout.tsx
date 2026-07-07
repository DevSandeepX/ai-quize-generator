import MobileNavbar from "@/components/MobileNavbar";
import Sidebar from "@/components/Sidebar";
import { Suspense } from "react";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({
    children,
}: DashboardLayoutProps) {
    return (
        <div className="flex h-screen bg-slate-50">
            <aside className="hidden w-[270px] border-r bg-[#1C1A31] lg:flex">
                <Suspense>

                    <Sidebar />
                </Suspense>
            </aside>

            <div className="flex flex-1 flex-col overflow-hidden">
                <MobileNavbar />

                <main className="flex-1 overflow-y-auto bg-slate-50">
                    <div className="min-h-full p-4 md:p-6 lg:p-8">
                        <Suspense>
                            {children}
                        </Suspense>
                    </div>
                </main>
            </div>
        </div>
    );
}