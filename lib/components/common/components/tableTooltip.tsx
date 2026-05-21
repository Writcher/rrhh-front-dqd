import { InfoOutlined } from '@mui/icons-material';
import { Box, Button, IconButton, SxProps, Theme, Typography } from '@mui/material';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { ReactNode } from 'react';
import LightTooltip from './tooltip';

export type TableTooltipColumn<T> = {
    header?: string;
    render: (item: T) => ReactNode;
};

type Position = 'first' | 'middle' | 'last' | 'only';

const radiusByPosition: Record<Position, SxProps<Theme>> = {
    first: { borderRadius: '4px 0 0 4px' },
    middle: { borderRadius: 0 },
    last: { borderRadius: '0 4px 4px 0' },
    only: { borderRadius: '4px' }
};

export const TableTooltip = <T extends { id: number }>({
    title,
    items,
    columns,
    icon = <InfoOutlined />,
    onDelete,
    position = 'middle',
    color = 'primary'
}: {
    title: string;
    items: T[];
    columns: TableTooltipColumn<T>[];
    icon?: ReactNode;
    onDelete?: (id: number) => void;
    position?: Position;
    color?: 'primary' | 'error' | 'success' | 'warning' | 'info' | 'secondary'
}) => {
    const hasHeaders = columns.some(col => col.header !== undefined);

    return (
        <Box className='flex w-full items-center justify-center'>
            {items && items.length > 0 && (
                <LightTooltip
                    title={
                        <Box className='flex flex-col p-1 gap-2'>
                            <Typography variant='subtitle2' sx={{ mb: 1, fontWeight: 'bold' }}>
                                {title}
                            </Typography>
                            <Box className='flex flex-col gap-2'>
                                {hasHeaders && (
                                    <Box className='flex flex-row items-center gap-4'>
                                        {columns.map((col, i) => (
                                            <Typography key={i} variant='caption' sx={{ flex: 1, fontWeight: 'bold' }}>
                                                {col.header}
                                            </Typography>
                                        ))}
                                        {onDelete && <Box sx={{ width: 32 }} />}
                                    </Box>
                                )}
                                {items.map((item) => (
                                    <Box className='flex flex-row items-center gap-4' key={item.id}>
                                        {columns.map((col, i) => (
                                            <Typography key={i} variant='body2' sx={{ flex: 1 }}>
                                                {col.render(item)}
                                            </Typography>
                                        ))}
                                        {onDelete && (
                                            <IconButton
                                                size='small'
                                                disableRipple
                                                className='!items-center !justify-center !text-red-500 !font-medium hover:!bg-red-100 hover:!text-red-600'
                                                onClick={() => onDelete(item.id)}
                                            >
                                                <DeleteRoundedIcon />
                                            </IconButton>
                                        )}
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    }
                    arrow
                    placement='left'
                >
                    <Button
                        size='small'
                        disableRipple
                        disableElevation
                        color={color}
                        variant='contained'
                        sx={radiusByPosition[position]}
                    >
                        {icon}
                    </Button>
                </LightTooltip>
            )}
        </Box>
    );
};
