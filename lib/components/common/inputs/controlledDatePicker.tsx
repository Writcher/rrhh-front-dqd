import { Skeleton } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Control, Controller, FieldValues, Path, RegisterOptions } from "react-hook-form";
import dayjs from 'dayjs';

export function ControlledDatePicker<T extends FieldValues>({
    control,
    name,
    label,
    rules,
    isLoading = false,
    disabled
}: {
    control: Control<T>,
    name: Path<T>,
    label?: string,
    rules?: Omit<RegisterOptions<T, Path<T>>, 'disabled' | 'valueAsNumber' | 'valueAsDate' | 'setValueAs'>,
    isLoading?: boolean,
    disabled?: boolean,
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
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='es'>
            <Controller
                name={name}
                control={control}
                rules={rules}
                render={({ field: { onChange, value, ...restField }, fieldState: { error } }) => (
                    <DatePicker
                        {...restField}
                        label={label}
                        className='!w-[100%]'
                        value={value ? dayjs(value, 'DD-MM-YYYY') : null}
                        onChange={(newValue) => {
                            onChange(newValue && newValue.isValid() ? newValue.format('DD-MM-YYYY') : '');
                        }}
                        format='DD-MM-YYYY'
                        slotProps={{
                            textField: {
                                variant: 'outlined',
                                color: 'warning',
                                size: 'small',
                                disabled: disabled,
                                error: !!error,
                                helperText: error?.message,
                            }
                        }}
                    />
                )}
            />
        </LocalizationProvider>
    );
};
