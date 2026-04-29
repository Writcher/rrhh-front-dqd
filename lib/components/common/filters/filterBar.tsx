import FilterAltOffRoundedIcon from '@mui/icons-material/FilterAltOffRounded';
import FilterAltRoundedIcon from '@mui/icons-material/FilterAltRounded';
import { Button, ButtonGroup, FormControlLabel, Menu, MenuItem, Skeleton, Switch, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { ReactNode } from "react";

type FilterBarItem = {
    key: string
    menuLabel?: string
    inputLabel: string
    inputType: 'text' | 'number' | 'select' | 'datepicker' | 'toggle'
    options?: { id: number, nombre: string }[]
    value: string | number | boolean
    loading?: boolean
}

type FiltersHook = {
    anchor: (EventTarget & HTMLButtonElement) | null
    openFilters: boolean
    visibility: Record<string, boolean>
    setVisibility: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
    handleOpenFilters: (event: React.MouseEvent<HTMLButtonElement>) => void
    handleCloseFilters: () => void
    handleChange: (key: string, value: any) => void
    handleSelectFilter: (key: string) => void
    handleCleanFilters: () => void
}

const selectSlotProps = {
    select: {
        MenuProps: {
            slotProps: { paper: { style: { marginTop: '4px', maxHeight: '200px' } } }
        }
    }
};

function FilterInput({ item, onChange }: { item: FilterBarItem, onChange: (key: string, value: any) => void }) {
    const isSelect = item.inputType === 'select';

    if (item.loading) {
        return <Skeleton variant='rectangular' height={40} className='flex-1' sx={{ borderRadius: '5px' }} />;
    }

    if (item.inputType === 'datepicker') {
        return (
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='es'>
                <DatePicker
                    label={item.inputLabel}
                    value={item.value ? dayjs(item.value as string, 'DD-MM-YYYY') : null}
                    onChange={(newValue) => onChange(item.key, newValue ? newValue.format('DD-MM-YYYY') : '')}
                    format='DD-MM-YYYY'
                    slotProps={{
                        textField: {
                            variant: 'outlined',
                            color: 'warning',
                            size: 'small',
                            fullWidth: true,
                        }
                    }}
                />
            </LocalizationProvider>
        );
    }

    if (item.inputType === 'toggle') {
        return (
            <FormControlLabel
                control={
                    <Switch
                        checked={item.value as boolean}
                        onChange={(e) => onChange(item.key, e.target.checked)}
                        color='warning'
                    />
                }
                label={item.inputLabel}
                className='!text-gray-700 !ml-2'
            />
        );
    }

    return (
        <TextField
            key={item.key}
            label={item.inputLabel}
            type={isSelect ? undefined : item.inputType}
            variant='outlined'
            color='warning'
            size='small'
            fullWidth
            select={isSelect}
            value={item.value}
            onChange={(e) => onChange(item.key, e.target.value)}
            slotProps={isSelect ? selectSlotProps : undefined}
        >
            {isSelect && item.options?.map(opt => (
                <MenuItem key={opt.id} value={opt.id}>{opt.nombre}</MenuItem>
            ))}
        </TextField>
    );
}

export function FilterBar({
    filtersHook,
    items,
    actions,
    showClean = false,
    showMenu = true
}: {
    filtersHook: FiltersHook
    items: FilterBarItem[]
    actions?: ReactNode
    showClean?: boolean
    showMenu?: boolean
}) {
    const {
        anchor, openFilters, visibility,
        handleOpenFilters, handleCloseFilters, handleChange, handleSelectFilter, handleCleanFilters
    } = filtersHook;

    const visibleItems = showMenu
        ? items.filter(item => visibility[item.key] && item.inputType !== 'toggle')
        : items.filter(item => item.inputType !== 'toggle');

    const toggleItems = items.filter(item => item.inputType === 'toggle');

    return (
        <div className='flex flex-row gap-2 w-full shrink-0 flex-wrap items-start mt-2'>
            {showMenu && (
                <div className='shrink-0'>
                    <ButtonGroup variant='outlined' color='inherit' className='!h-10'>
                        <Button
                            variant='contained'
                            className='!bg-gray-800 hover:!bg-gray-700 !text-white'
                            disableElevation
                            endIcon={<FilterAltRoundedIcon />}
                            onClick={handleOpenFilters}
                        >
                            Filtros
                        </Button>
                        <Button variant='contained' color='error' disableElevation onClick={handleCleanFilters}>
                            <FilterAltOffRoundedIcon />
                        </Button>
                    </ButtonGroup>
                    <Menu anchorEl={anchor} open={openFilters} onClose={handleCloseFilters}>
                        {items.map(item => (
                            item.menuLabel &&
                            <MenuItem key={item.key} onClick={() => handleSelectFilter(item.key)}>
                                {item.menuLabel}
                            </MenuItem>
                        ))}
                    </Menu>
                </div>
            )}
            {showClean && (
                <Button
                    variant='contained'
                    color='error'
                    disableElevation
                    className='!h-10'
                    onClick={handleCleanFilters}
                >
                    <FilterAltOffRoundedIcon />
                </Button>
            )}
            <div className='flex-1 min-w-[280px] max-w-2xl'>
                <div className='flex items-center justify-start w-full gap-2 sm:gap-3'>
                    {visibleItems.map(item => (
                        <FilterInput key={item.key} item={item} onChange={handleChange} />
                    ))}
                </div>
            </div>
            {toggleItems.map(item => (
                <FilterInput key={item.key} item={item} onChange={handleChange} />
            ))}
            <div className='flex grow shrink-0' />
            {actions}
        </div>
    );
}
