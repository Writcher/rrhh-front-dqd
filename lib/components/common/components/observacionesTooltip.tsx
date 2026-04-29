import { InfoOutlined } from '@mui/icons-material';
import { Box, Button, IconButton, SxProps, Theme, Typography } from '@mui/material';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import LightTooltip from './tooltip';
import { Observacion } from '@/lib/types/observacion/observacion.entity';

export const ObservacionesTooltip = ({
    observaciones,
    onDelete,
    sx
}: {
    observaciones: Observacion[],
    onDelete: (id: number) => void,
    sx?: SxProps<Theme>
}) => (
    <Box className='flex w-full items-center justify-center'>
        {observaciones && observaciones.length > 0 && (
            <LightTooltip
                title={
                    <Box sx={{ maxWidth: 400 }}>
                        <Typography variant='subtitle2' sx={{ mb: 1, fontWeight: 'bold' }}>
                            Observaciones:
                        </Typography>
                        <div className='flex flex-col gap-2 '>
                            {observaciones.map((observacion: {id: number, texto: string}, index: any) => (
                                <div className='flex flex-row justify-between items-center gap-8' key={index}>
                                    <Typography
                                        variant='body2'
                                        sx={{ mb: 0.5, '&:last-child': { mb: 0 } }}
                                    >
                                        • {observacion.texto}
                                    </Typography>
                                    <IconButton
                                        size='small'
                                        disableRipple
                                        className='!items-center !justify-center !text-red-500 !font-medium hover:!bg-red-100 hover:!text-red-600'
                                        onClick={() => onDelete(observacion.id)}
                                    >
                                        <DeleteRoundedIcon/>
                                    </IconButton>
                                </div>
                            ))}
                        </div>
                    </Box>
                }
                arrow
                placement='left'
            >
                <Button
                    size='small'
                    disableRipple
                    disableElevation
                    color='primary'
                    variant='contained'
                    disabled={observaciones.length === 0}
                    sx={sx}
                >
                    <InfoOutlined />
                </Button>
            </LightTooltip>
        )}
    </Box>
);