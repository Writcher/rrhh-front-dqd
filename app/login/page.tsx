'use client'

import PageWrapper from "@/components/common/wrappers/pageWrapper"
import LoginForm from "@/components/login";

export default function LoginPage() {
    return (
        <PageWrapper title='Iniciar Sesión' titlePos='mid'>
            <LoginForm />
        </PageWrapper>
    );
};