import { Button, SxProps, Theme } from '@mui/material';
import { ReactNode } from 'react';
import SyncIcon from '@mui/icons-material/Sync';
import LightTooltip from './tooltip';
import { useConfirm } from '@/lib/hooks/useConfirm';

type Position = 'first' | 'middle' | 'last' | 'only';
type Color = 'success' | 'error' | 'info' | 'warning' | 'primary';

const radiusByPosition: Record<Position, SxProps<Theme>> = {
    first: { borderRadius: '4px 0 0 4px' },
    middle: { borderRadius: 0 },
    last: { borderRadius: '0 4px 4px 0' },
    only: { borderRadius: '4px' }
};

export const TableActionButton = ({
    tooltip,
    confirmTooltip,
    icon,
    color,
    onClick,
    loading,
    disabled,
    position = 'middle'
}: {
    tooltip: string,
    confirmTooltip?: string,
    icon: ReactNode,
    color: Color,
    onClick: () => void,
    loading?: boolean,
    disabled?: boolean,
    position?: Position
}) => {
    const { confirm, handleConfirm } = useConfirm();
    const requiresConfirm = Boolean(confirmTooltip);

    return (
        <LightTooltip
            title={requiresConfirm && confirm ? confirmTooltip! : tooltip}
            placement='left'
            arrow
        >
            <Button
                variant={requiresConfirm && !confirm ? 'outlined' : 'contained'}
                color={color}
                disableElevation
                size='small'
                disabled={disabled || loading}
                onBlur={requiresConfirm ? () => handleConfirm(false) : undefined}
                onClick={requiresConfirm
                    ? (confirm ? onClick : () => handleConfirm())
                    : onClick
                }
                sx={radiusByPosition[position]}
            >
                {loading
                    ? <SyncIcon className='animate-spin' style={{ animationDirection: 'reverse' }} />
                    : icon
                }
            </Button>
        </LightTooltip>
    );
};
