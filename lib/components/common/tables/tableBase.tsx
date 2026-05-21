import { Table, TableContainer } from "@mui/material";

export function TableBase({
    items,
    isLoading,
    header,
    skeleton,
    body,
    noItemMessage,
    containerClassName,
    responsive = true
}: {
    items: unknown[] | null | undefined,
    isLoading: boolean,
    header: React.ReactNode,
    skeleton: React.ReactNode,
    body: React.ReactNode,
    noItemMessage: string,
    containerClassName: string,
    responsive?: boolean
}) {
    return (
        <>
            {isLoading || (items && items.length > 0) ? (
                <TableContainer className={`${responsive ? 'responsive-table ' : ''}${containerClassName}`}>
                    <Table stickyHeader>
                        {header}
                        {isLoading ? skeleton : body}
                    </Table>
                </TableContainer>
            ) : null}
            {!isLoading && (!items || items.length === 0) && (
                <div className='flex items-center justify-center py-8 h-full w-full text-gray-700 font-medium text-sm'>
                    {noItemMessage}
                </div>
            )}
        </>
    );
};
