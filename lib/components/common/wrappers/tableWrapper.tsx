import { TablePagination } from "@mui/material";

export default function TableWrapper({
    paginated = true,
    bordered = true,
    isLoading,
    page,
    limit,
    handlePageChange,
    handleLimitChange,
    total,
    children
}: {
    paginated?: boolean,
    bordered?: boolean,
    isLoading?: boolean,
    page?: number,
    limit?: number,
    handlePageChange?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number) => void,
    handleLimitChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => void,
    total?: number,
    children?: React.ReactNode
}) {
    return (
        <div className={`flex flex-col flex-1 w-full min-h-0 rounded overflow-hidden${bordered ? ' border-2 border-orange-500' : ''}`}>
            {children}
            {paginated && (isLoading || (total ?? 0) > 0) &&
                <div className='flex shrink-0 justify-end items-center border-t-2 border-orange-500'>
                    <TablePagination
                        rowsPerPageOptions={[25, 50, 75, 100]}
                        component='div'
                        count={total ?? 0}
                        rowsPerPage={limit ?? 25}
                        page={page ?? 0}
                        onPageChange={handlePageChange!}
                        onRowsPerPageChange={handleLimitChange}
                        labelRowsPerPage='Filas por Página: '
                        labelDisplayedRows={({ from, to, count }) =>
                            `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
                        }
                        slotProps={{
                            select: {
                                MenuProps: {
                                    anchorOrigin: { vertical: 'top', horizontal: 'right' },
                                    transformOrigin: { vertical: 'top', horizontal: 'left' }
                                },
                            }
                        }}
                    />
                </div>
            }
        </div>
    );
};