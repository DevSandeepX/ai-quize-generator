"use client";

import { Search, X } from "lucide-react";
import {
    usePathname,
    useRouter,
    useSearchParams,
} from "next/navigation";
import { useEffect, useState } from "react";

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

/* =========================
   TYPES
========================= */

interface PaginationsProps {
    page?: number;
    limit?: number;
    search?: string;
}

interface UpdateQueryProps {
    values: Record<string, string | number | null>;
}

/* =========================
   MAIN COMPONENT
========================= */
export default function Paginations() {
    return (
        <div className="w-full space-y-4 my-8">
            {/* Top Controls */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <PaginationDropdown />
                <div className="w-full lg:max-w-sm">
                    <SearchForm />
                </div>
            </div>
        </div>
    );
}

/* =========================
   SEARCH FORM
========================= */

export function PagePagination({ totalPages }: { totalPages: number }) {
    const searchParams = useSearchParams();
    const updateQuery = useUpdateQuery();

    const currentPage = Number(searchParams.get("page") ?? 1);

    const pages: (number | "...")[] = [];

    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
    } else {
        pages.push(1);

        if (currentPage > 3) {
            pages.push("...");
        }

        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (currentPage < totalPages - 2) {
            pages.push("...");
        }

        pages.push(totalPages);
    }

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        className={
                            currentPage === 1
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer"
                        }
                        onClick={() =>
                            currentPage > 1 &&
                            updateQuery({
                                values: {
                                    page: currentPage - 1,
                                },
                            })
                        }
                    />
                </PaginationItem>

                {pages.map((page, index) =>
                    page === "..." ? (
                        <PaginationItem key={`ellipsis-${index}`}>
                            <PaginationEllipsis />
                        </PaginationItem>
                    ) : (
                        <PaginationItem key={page}>
                            <PaginationLink
                                className={
                                    currentPage === page
                                        ? "bg-blue-600 text-white hover:bg-blue-600 hover:text-white"
                                        : "cursor-pointer"
                                }
                                isActive={currentPage === page}
                                onClick={() =>
                                    updateQuery({
                                        values: {
                                            page,
                                        },
                                    })
                                }
                            >
                                {page}
                            </PaginationLink>
                        </PaginationItem>
                    )
                )}

                <PaginationItem>
                    <PaginationNext
                        className={
                            currentPage === totalPages
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer"
                        }
                        onClick={() =>
                            currentPage < totalPages &&
                            updateQuery({
                                values: {
                                    page: currentPage + 1,
                                },
                            })
                        }
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}

// =======================================
export function SearchForm() {
    const updateQuery = useUpdateQuery();
    const searchParams = useSearchParams();

    const urlSearch = searchParams.get("search") ?? "";
    const [search, setSearch] = useState(urlSearch);

    useEffect(() => {
        setSearch(urlSearch);
    }, [urlSearch]);

    function handleSearch() {
        updateQuery({
            values: {
                search,
                page: 1,
            },
        });
    }

    function handleClose() {
        setSearch("");

        updateQuery({
            values: {
                search: null,
                page: 1,
            },
        });
    }

    return (
        <div className="w-full h-9 border rounded px-4 flex items-center">
            <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        handleSearch();
                    }
                }}
                className="flex-1 border-none outline-none bg-transparent"
                placeholder="Search..."
            />

            {search ? (
                <button type="button" onClick={handleClose}>
                    <X className="size-5 text-gray-500" />
                </button>
            ) : (
                <button type="button" onClick={handleSearch}>
                    <Search className="size-5 text-gray-500" />
                </button>
            )}
        </div>
    );
}

/* =========================
   PAGINATION DROPDOWN
========================= */

export function PaginationDropdown() {
    const searchParams = useSearchParams();
    const updateQuery = useUpdateQuery();

    const initialLimit = Number(searchParams.get("limit") ?? 20);
    const [limit, setLimit] = useState(initialLimit);

    useEffect(() => {
        updateQuery({
            values: {
                limit,
                page: 1, // reset page when limit changes
            },
        });
    }, [limit]);

    return (
        <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="w-full sm:w-auto border rounded-md px-3 py-2"
        >
            <option value={20}>20 Per page</option>
            <option value={30}>30 Per page</option>
            <option value={40}>40 Per page</option>
            <option value={50}>50 Per page</option>
        </select>
    );
}

/* =========================
   USE UPDATE QUERY (FIXED)
========================= */

export function useUpdateQuery() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    function updateQuery({ values }: UpdateQueryProps) {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(values).forEach(([key, value]) => {
            if (value === "" || value == null) {
                params.delete(key);
            } else {
                params.set(key, String(value));
            }
        });

        router.push(`${pathname}?${params.toString()}`);
    }

    return updateQuery;
}