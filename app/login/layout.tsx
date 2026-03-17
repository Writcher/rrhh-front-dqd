'use client';

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className='flex flex-row h-screen w-screen'>
            {children}
        </div>
    );
};