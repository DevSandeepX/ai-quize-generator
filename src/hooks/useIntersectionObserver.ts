import {
    RefObject,
    useEffect,
} from "react";

interface Props {
    target: RefObject<Element | null>;
    onIntersect: () => void;
    enabled?: boolean;
    root?: Element | null;
    rootMargin?: string;
    threshold?: number;
}

export function useIntersectionObserver({
    target,
    onIntersect,
    enabled = true,
    root = null,
    rootMargin = "0px",
    threshold = 0.5,
}: Props) {
    useEffect(() => {
        if (!enabled || !target.current) {
            return;
        }

        const observer =
            new IntersectionObserver(
                ([entry]) => {
                    if (
                        entry.isIntersecting
                    ) {
                        onIntersect();
                    }
                },
                {
                    root,
                    rootMargin,
                    threshold,
                }
            );

        observer.observe(
            target.current
        );

        return () => {
            observer.disconnect();
        };
    }, [
        target,
        enabled,
        onIntersect,
        root,
        rootMargin,
        threshold,
    ]);
}