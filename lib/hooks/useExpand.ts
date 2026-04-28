import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react"

export const useExpand = ({
    syncUrl = false
}: {
    syncUrl?: boolean
}) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [expanded, setExpanded] = useState<number | null>(null);

    useEffect(() => {
        if (!syncUrl) return;
        const value = searchParams.get('expanded');
        if (value) {
            setExpanded(Number(value));
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const updateUrl = (value: number | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set('expanded', String(value));
        } else {
            params.delete('expanded');
        };
        const queryString = params.toString();
        router.replace(`${pathname}${queryString ? `?${queryString}` : ''}`, { scroll: false });
    };

    const handleExpand = (id: number) => {
        const next = expanded === id ? null : id;
        setExpanded(next);
        if (syncUrl) updateUrl(next);
    };

    return {
        expanded,
        handleExpand
    };
};