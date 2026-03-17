'use client'

export default function PageWrapper({ title, titlePos = 'top', children }: { title: string, titlePos?: 'top' | 'mid', children?: React.ReactNode }) {
    if (titlePos === 'mid') {
        return (
            <div className='flex flex-col gap-10 sm:gap-12 items-center justify-center w-full h-full text-center'>
                <p className='text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800'>
                    {title}
                </p>

                {children && (
                    <div className='w-full flex justify-center'>
                        {children}
                    </div>
                )}
            </div>
        );
    };
    return (
        <div className='flex flex-col gap-2 sm:gap-3 w-full h-full overflow-hidden'>
            <div className='flex items-center justify-center min-h-[60px] shrink-0 text-gray-800 font-bold'>
                <p className='text-xl sm:text-2xl lg:text-3xl'>
                    {title}
                </p>
            </div>
            <div className='flex items-center justify-center flex-1 min-h-0 overflow-hidden'>
                {children}
            </div>
        </div>
    );
};