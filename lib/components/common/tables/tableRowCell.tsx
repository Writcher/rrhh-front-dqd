import { TableCell } from "@mui/material";

export function TableRowCell({
    alignment,
    variant,
    span,
    children,
    highlight,
    color,
    position
}: {
    alignment: 'center' | 'left' | 'right' | 'inherit' | 'justify',
    variant?: 'buttons' | 'text' | 'table',
    span?: number,
    children: React.ReactNode,
    highlight?: 'warning' | 'error' | 'success',
    color?: 'green' | 'gray',
    position?: 'first' | 'last'
}) {
    let divClassName = 'text-gray-700 font-medium';
    if (variant === 'buttons') divClassName = 'flex items-center justify-end text-gray-700 font-medium';
    if (variant === 'table') divClassName = ''
    let cellClassName = '';
    if (highlight === 'error') cellClassName = 'border-r-10 border-red-600';
    if (highlight === 'warning') cellClassName = 'border-r-10 border-[#F97316]';
    if (highlight === 'success') cellClassName = 'border-r-10 border-green-700';
    if (color === 'gray') cellClassName = 'from-gray-300 via-gray-300 to-transparent';
    if (color === 'green') cellClassName = 'from-green-300 via-green-300 to-transparent';
    if (position === 'first') cellClassName += ' bg-gradient-to-r';
    if (position === 'last') cellClassName += ' bg-gradient-to-l';
    return (
        <TableCell align={alignment} colSpan={span} size='small' className={cellClassName}>
            <div className={divClassName}>
                {children}
            </div>
        </TableCell>
    );
};