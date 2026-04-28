import { MenuItem, Skeleton, TextField } from "@mui/material";
import { HTMLInputTypeAttribute } from "react";
import { Control, Controller, FieldValues, Path, RegisterOptions } from "react-hook-form";

const selectSlotProps = {
    select: {
        MenuProps: {
            slotProps: { paper: { style: { marginTop: '4px', maxHeight: '200px' } } }
        }
    }
};

interface IdConNombre {
    id: number,
    nombre: string
}

export function ControlledTextField<T extends FieldValues>({
    control,
    name,
    label,
    rules,
    disabled,
    type,
    multiline,
    rows
}: {
    control: Control<T>,
    name: Path<T>,
    label?: string,
    rules?: Omit<RegisterOptions<T, Path<T>>, 'disabled' | 'valueAsNumber' | 'valueAsDate' | 'setValueAs'>,
    isLoading?: boolean,
    disabled?: boolean,
    type?: HTMLInputTypeAttribute,
    multiline?: boolean,
    rows?: number
}) {
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
                    type={type}
                    disabled={disabled}
                    multiline={multiline}
                    rows={rows}
                    error={!!error}
                    helperText={error?.message}
                />
            )}
        />
    );
};