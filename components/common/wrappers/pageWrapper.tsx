export default function PageWrapper({ title, titlePos = 'top', children }: { title: string, titlePos?: 'top' | 'mid', children?: React.ReactNode }) {
    const titleEl = (
        <p className='text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800'>
            {title}
        </p>
    );

    if (titlePos === 'mid') {
        return (
            <div className='flex flex-col gap-10 sm:gap-12 items-center justify-center w-full h-full'>
                {titleEl}
                {children}
            </div>
        );
    };
    
    return (
        <div className='flex flex-col gap-2 sm:gap-3 w-full h-full overflow-hidden'>
            <div className='flex items-center justify-center min-h-[60px] shrink-0'>
                {titleEl}
            </div>
            <div className='flex items-center justify-center flex-1 min-h-0 overflow-hidden'>
                {children}
            </div>
        </div>
    );
};