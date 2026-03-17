import { Button } from "@mui/material";
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import SyncIcon from '@mui/icons-material/Sync';

export default function LoginFormButton({ isPending, isValid }: { isPending: boolean, isValid: boolean }) {
    return (
        <Button
            type='submit'
            variant='contained'
            color='success'
            fullWidth
            disableElevation
            endIcon={
                isPending ? (
                    <SyncIcon className='animate-spin' style={{ animationDirection: 'reverse' }} />
                ) : <LoginRoundedIcon />
            }
            disabled={isPending || !isValid}
        >
            {!isPending ? 'Iniciar Sesión' : 'Iniciando Sesión'}
        </Button>
    );
};