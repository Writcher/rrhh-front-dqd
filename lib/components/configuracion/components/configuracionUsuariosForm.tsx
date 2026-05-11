import { Button } from "@mui/material";
import SyncIcon from '@mui/icons-material/Sync';
import SaveAsRoundedIcon from '@mui/icons-material/SaveAsRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "@/lib/contexts/snackbar";
import { createUsuario } from "@/lib/actions/usuario/usuario.actions";
import { ControlledSelect } from "../../common/inputs/controlledSelect";
import { ControlledTextField } from "../../common/inputs/controlledTextField";
import { Proyecto } from "@/lib/types/proyecto/proyecto.entity";
import { TipoUsuario } from "@/lib/types/tipoUsuario/tipoUsuario.entity";
import { ConfiguracionUsuariosFormData } from "../types/configuracionUsuariosFormData";

export default function ConfiguracionUsuariosForm({
    proyectos,
    tiposUsuario,
    handleShow
}: {
    proyectos: Proyecto[],
    tiposUsuario: TipoUsuario[],
    handleShow: () => void
}) {
    //init
    const queryClient = useQueryClient();
    //hooks
    const { showError, showSuccess } = useSnackbar();
    const { control, handleSubmit, formState: { isValid } } = useForm<ConfiguracionUsuariosFormData>({
        defaultValues: {
            nombre: '',
            email: '',
            contraseña: '',
            id_proyecto: '',
            id_tipousuario: ''
        }
    });
    //mutations
    const create = useMutation({
        mutationFn: (data: ConfiguracionUsuariosFormData) => createUsuario({
            nombre: data.nombre,
            email: data.email,
            contraseña: data.contraseña,
            id_proyecto: data.id_proyecto,
            id_tipousuario: data.id_tipousuario
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['getUsuarios']
            });
            showSuccess('Usuario creado correctamente');
            handleShow();
        },
        onError: () => showError('Error al crear usuario')
    });
    return (
        <form onSubmit={handleSubmit((data) => create.mutate(data))} className='flex flex-col items-center justify-between w-full h-full gap-3 sm:gap-4'>
            <div className='flex flex-col h-full w-full mt-2 justify-center gap-2'>
                <ControlledTextField
                    control={control}
                    name='nombre'
                    label='Nombre'
                    rules={{ required: 'Debe ingresar un nombre' }}
                    disabled={create.isPending}
                />
                <ControlledTextField
                    control={control}
                    name='email'
                    label='Email'
                    type='email'
                    rules={{
                        required: 'Debe ingresar un email',
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: 'Email inválido'
                        }
                    }}
                    disabled={create.isPending}
                />
                <ControlledTextField
                    control={control}
                    name='contraseña'
                    label='Contraseña'
                    rules={{ required: 'Debe ingresar una contraseña' }}
                    disabled={create.isPending}
                />
                <div className='flex flex-row w-full gap-2 items-center'>
                    <div className='w-1/2'>
                        <ControlledSelect
                            control={control}
                            name='id_proyecto'
                            label='Proyecto'
                            rules={{ required: 'Debe seleccionar un proyecto' }}
                            disabled={proyectos.length === 0 || create.isPending}
                            items={proyectos}
                        />
                    </div>
                    <div className='w-1/2'>
                        <ControlledSelect
                            control={control}
                            name='id_tipousuario'
                            label='Tipo de Usuario'
                            rules={{ required: 'Debe seleccionar un tipo de usuario' }}
                            disabled={tiposUsuario.length === 0 || create.isPending}
                            items={tiposUsuario}
                        />
                    </div>
                </div>
            </div>
            <div className='flex justify-between w-full'>
                <Button
                    variant='contained'
                    color='error'
                    disableElevation
                    onClick={handleShow}
                    startIcon={
                        create.isPending ? (
                            <SyncIcon className='animate-spin' style={{ animationDirection: 'reverse' }} />
                        ) : <CloseRoundedIcon />
                    }
                    disabled={create.isPending}
                >
                    Cancelar
                </Button>
                <Button
                    type='submit'
                    variant='contained'
                    color='success'
                    disableElevation
                    endIcon={
                        create.isPending ? (
                            <SyncIcon className='animate-spin' style={{ animationDirection: 'reverse' }} />
                        ) : <SaveAsRoundedIcon />
                    }
                    disabled={!isValid || create.isPending}
                >
                    {!create.isPending ? 'Guardar' : 'Guardando'}
                </Button>
            </div>
        </form>
    );
};
