'use client'

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPreRegistros, cargarFotoPreRegistro } from "@/lib/actions/accesoControl/accesoControl.actions";
import { PreRegistroDto } from "@/lib/types/accesoControl/pre-registro";
import { Accordion, AccordionDetails, AccordionSummary, Chip, TableBody, TableRow } from "@mui/material";
import { TableBase } from "@/lib/components/common/tables/tableBase";
import { TableHeader } from "@/lib/components/common/tables/tableHeader";
import { TableRowCell } from "@/lib/components/common/tables/tableRowCell";
import { TableSkeleton } from "@/lib/components/common/tables/tableSkeleton";
import { TableActionButton } from "@/lib/components/common/components/tableActionButton";
import AddAPhotoRoundedIcon from '@mui/icons-material/AddAPhotoRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import CargarFotoDrawer from "./cargarFotoDrawer";

const accesoColor = (estado: string): 'success' | 'warning' | 'default' =>
    estado === 'Sincronizado' ? 'success' : estado === 'Pendiente' ? 'warning' : 'default';

export default function ProximosIngresos() {
    const preRegistros = useQuery({
        queryKey: ['getPreRegistros'],
        queryFn: () => getPreRegistros(),
        refetchOnWindowFocus: false
    });
    const [seleccionado, setSeleccionado] = useState<PreRegistroDto | null>(null);
    const [expanded, setExpanded] = useState(false);

    const items = preRegistros.data ?? [];
    const hayItems = items.length > 0;

    //arranca colapsado y se despliega solo cuando la búsqueda encuentra ingresos
    useEffect(() => {
        if (items.length > 0) setExpanded(true);
    }, [items.length]);

    return (
        <>
            <Accordion
                expanded={expanded && hayItems}
                onChange={(_, isExpanded) => setExpanded(isExpanded && hayItems)}
                disableGutters
                elevation={0}
                className='!border-2 !border-[#ED6C02] !rounded shrink-0'
            >
                <AccordionSummary
                    expandIcon={hayItems ? <ExpandMoreRoundedIcon /> : undefined}
                    className={hayItems ? undefined : '!cursor-default'}
                    disableRipple={!hayItems}
                >
                    <div className='flex items-center gap-2'>
                        <span className='font-medium text-gray-800'>Próximos ingresos</span>
                        <Chip label={preRegistros.isLoading ? '…' : items.length} size='small' color='warning' className='!rounded' />
                        <span className='text-xs text-gray-500'>Personal con ingreso próximo, ya cargado en el control de acceso. Subiles la foto antes de su primer día.</span>
                    </div>
                </AccordionSummary>
                <AccordionDetails className='!p-0'>
                    <TableBase
                        items={items}
                        isLoading={preRegistros.isLoading}
                        header={
                            <TableHeader
                                border={false}
                                titles={[
                                    { title: 'Nombre y Apellido', width: '40%', alignment: 'left' },
                                    { title: 'DNI', width: '25%', alignment: 'center' },
                                    { title: 'Acceso', width: '20%', alignment: 'center' },
                                    { title: 'Foto', width: '15%', alignment: 'right' }
                                ]}
                            />
                        }
                        skeleton={
                            <TableSkeleton
                                rows={3}
                                columns={[
                                    { variant: 'text', alignment: 'left', colWidth: '40%', width: 160 },
                                    { variant: 'text', alignment: 'center', colWidth: '25%', width: 90 },
                                    { variant: 'rectangular', alignment: 'center', colWidth: '20%', width: 90 },
                                    { variant: 'rectangular', alignment: 'right', colWidth: '15%', width: 40 }
                                ]}
                            />
                        }
                        body={
                            <TableBody>
                                {items.map((pr) => (
                                    <TableRow key={pr.personCode}>
                                        <TableRowCell alignment='left'>{pr.nombre ?? '—'}</TableRowCell>
                                        <TableRowCell alignment='center'>{pr.personCode}</TableRowCell>
                                        <TableRowCell alignment='center'>
                                            <Chip label={pr.estado} className='!rounded' color={accesoColor(pr.estado)} />
                                        </TableRowCell>
                                        <TableRowCell alignment='right' variant='buttons'>
                                            <TableActionButton
                                                tooltip={pr.estado === 'Sincronizado' ? 'Actualizar foto' : 'Cargar foto'}
                                                icon={<AddAPhotoRoundedIcon />}
                                                color='info'
                                                onClick={() => setSeleccionado(pr)}
                                                position='only'
                                            />
                                        </TableRowCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        }
                        noItemMessage='No hay próximos ingresos'
                        containerClassName='overflow-auto'
                    />
                </AccordionDetails>
            </Accordion>
            {seleccionado &&
                <CargarFotoDrawer
                    nombre={seleccionado.nombre ?? seleccionado.personCode}
                    open={!!seleccionado}
                    onClose={() => setSeleccionado(null)}
                    guardar={(file) => cargarFotoPreRegistro({ personCode: seleccionado.personCode, file })}
                    successMessage='Foto cargada correctamente'
                    queryKey='getPreRegistros'
                />
            }
        </>
    );
};
