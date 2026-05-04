import { Skeleton } from "@mui/material";

export function StatsCard({
    category,
    total,
    isLoading
}: {
    category?: string,
    total?: number,
    isLoading: boolean
}) {
    if (isLoading) return (
        <Skeleton variant='rectangular' className='!rounded !h-14 !w-full' />
    );

    return (
        <div className='flex h-14 justify-start items-center border-2 border-orange-500 px-6 p-4 rounded text-gray-700'>
            {category}: {total ?? '-'}
        </div>
    );
};
