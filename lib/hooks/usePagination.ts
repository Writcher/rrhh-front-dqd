import React, { useEffect, useState } from "react";

export const usePagination = (params: { limit: number, resetKey?: unknown }) => {
    const [ page, setPage ] = useState<number>(0);
    const [ limit, setLimit ] = useState<number>(params.limit);

    useEffect(() => {
        setPage(0);
    }, [params.resetKey]);

    const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleLimitChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setLimit(parseInt(event.target.value, 10));
        setPage(0);
    };

    return {
        page,
        limit,
        handlePageChange,
        handleLimitChange
    };
};