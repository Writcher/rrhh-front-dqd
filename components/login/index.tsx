'use client'

import { useSnackbar } from "@/lib/contexts/snackbar"
import { useLoginForm } from "./hooks/useLoginForm";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { LoginFormData } from "./types/loginFormData";
import { logIn } from "@/actions/auth/auth.actions";
import LoginFormInputs from "./components/loginFormInputs";
import LoginFormButton from "./components/loginFormButton";

export default function LoginForm() {
    //router
    const router = useRouter();
    //feedback
    const { showError } = useSnackbar();
    //form state
    const { control, handleSubmit, formState: { isValid } } = useLoginForm()
    //mutation
    const login = useMutation({
        mutationFn: (data: LoginFormData) => logIn(data),
        onSuccess: (result) => {
            if (result.success) {
                router.push('/');
                router.refresh();
            } else {
                showError(result.error);
            };
        }
    });
    const onLogin = (data: LoginFormData) => {
        login.mutate(data);
    };
    return(
        <form onSubmit={handleSubmit(onLogin)} className='flex flex-col w-full max-w-[400px] gap-3 sm:gap-4'>
            <LoginFormInputs control={control} />
            <LoginFormButton isPending={login.isPending} isValid={isValid} />
        </form>
    );
};