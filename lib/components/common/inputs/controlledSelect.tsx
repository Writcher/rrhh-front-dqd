import { MenuItem, Skeleton, TextField } from "@mui/material";
import { Control, Controller, FieldValues, Path, RegisterOptions } from "react-hook-form";

interface IdConNombre {
    id: number,
    nombre: string
}

export function ControlledSelect<T extends FieldValues, K extends IdConNombre>({
    control,
    name,
    label,
    rules,
    isLoading = false,
    disabled,
    multiple = false,
    items
}: {
    control: Control<T>,
    name: Path<T>,
    label?: string,
    rules?: Omit<RegisterOptions<T, Path<T>>, 'disabled' | 'valueAsNumber' | 'valueAsDate' | 'setValueAs'>,
    isLoading?: boolean,
    disabled?: boolean,
    multiple?: boolean,
    items: K[]
}) {
    if (isLoading) {
        return (
            <Skeleton
                variant='rectangular'
                width='100%'
                height='40px'
                sx={{ borderRadius: '5px' }}
            />
        );
    }
    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field, fieldState: { error } }) => (
                <TextField
                    {...field}
                    label={label}
                    variant='outlined'
                    color='warning'
                    size='small'
                    fullWidth
                    select
                    error={!!error}
                    helperText={error?.message}
                    disabled={disabled ?? false}
                    slotProps={{
                        select: {
                            multiple,
                            ...(multiple && {
                                renderValue: (selected) => (selected as number[])
                                    .map(id => items.find(item => item.id === id)?.nombre)
                                    .filter(Boolean)
                                    .join(', ')
                            }),
                            MenuProps: {
                                slotProps: { paper: { style: { marginTop: '4px', maxHeight: '200px' } } }
                            }
                        }
                    }}
                >
                    {items.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                            {item.nombre}
                        </MenuItem>
                    ))}
                </TextField>
            )}
        />
    );
};
