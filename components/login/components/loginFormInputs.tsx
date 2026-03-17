import { TextField } from "@mui/material";
import { Control, Controller } from "react-hook-form";
import { LoginFormData } from "../types/loginFormData";

export default function LoginFormInputs({ control }: { control: Control<LoginFormData, any, LoginFormData> }) {
    return (
        <div className='flex flex-col w-full gap-3 sm:gap-4'>
            <Controller
                name='email'
                control={control}
                rules={{ required: 'Debe ingresar su correo electronico' }}
                render={({ field, fieldState: { error } }) => (
                    <TextField
                        {...field}
                        label='Correo Electronico'
                        variant='outlined'
                        color='warning'
                        size='small'
                        fullWidth
                        type='email'
                        error={!!error}
                        helperText={error?.message}
                    />
                )}
            />
            <Controller
                name='password'
                control={control}
                rules={{ required: 'Debe ingresar su contraseña' }}
                render={({ field, fieldState: { error } }) => (
                    <TextField
                        {...field}
                        label='Contraseña'
                        variant='outlined'
                        color='warning'
                        size='small'
                        fullWidth
                        type='password'
                        error={!!error}
                        helperText={error?.message}
                    />
                )}
            />
        </div>
    );
};