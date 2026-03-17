import { useForm } from "react-hook-form"
import { LoginFormData } from "../types/loginFormData"

export const useLoginForm = () => {
    return useForm<LoginFormData>({
        defaultValues: {
            email: '',
            password: '',
        }
    });
};