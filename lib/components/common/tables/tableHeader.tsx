import { TableCell, TableHead, TableRow } from "@mui/material";

export function TableHeader({
    titles,
    sortColumn,
    sortDirection,
    border = true
}: {
    titles: { title: string, width?: string, span?: number, alignment: 'center' | 'left' | 'right' | 'inherit' | 'justify', onClick?: () => void, column?: string, visible?: boolean }[],
    sortColumn?: string,
    sortDirection?: string
    border?: boolean
}) {
    return (
        <TableHead
            sx={{
                '& .MuiTableCell-root': {
                    borderBottom: border ? '2px solid #ED6C02 !important' : null,
                    backgroundColor: '#fff !important',
                    zIndex: 1100,
                }
            }}
        >
            <TableRow>
                {titles.map((title, index) => {
                    let titleClassName = 'text-gray-700 font-bold text-sm'
                    if (title.column) titleClassName = `text-gray-700 font-bold text-sm ${sortColumn === title.column ? (sortDirection === 'ASC' ? 'text-orange-500' : 'text-red-500') : ''}`
                    if (title.visible ?? true) return (
                        <TableCell align={title.alignment} onClick={title.onClick} width={title.width} colSpan={title.span} key={index}>
                            <div className={titleClassName}>
                                {title.title}
                            </div>
                        </TableCell>
                    );
                })}
            </TableRow>
        </TableHead>
    );
};