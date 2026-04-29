import { Inter } from "next/font/google";
import "./globals.css";
import { SnackbarProvider } from "@/lib/contexts/snackbar";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "../lib/providers/queryProvider";
import { AuthSessionProvider } from "@/lib/providers/sessionProvider";
import { DrawerProvider } from "@/lib/contexts/drawer";
import { auth } from "@/auth";

const inter = Inter({ subsets: ['latin'] });

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="es">
      <body className={`${inter.className} antialiased`}>
        <AuthSessionProvider session={session}>
          <QueryClientProvider client={queryClient}>
            <DrawerProvider>
              <SnackbarProvider>
                <div className='flex h-screen w-screen overflow-hidden'>
                  {children}
                  <div className='fixed bottom-2 right-2 z-50 bg-black text-white text-xs px-2 py-1 rounded'>
                    <span className='sm:hidden'>xs</span>
                    <span className='hidden sm:block md:hidden'>sm</span>
                    <span className='hidden md:block lg:hidden'>md</span>
                    <span className='hidden lg:block xl:hidden'>lg</span>
                    <span className='hidden xl:block 2xl:hidden'>xl</span>
                    <span className='hidden 2xl:block'>2xl</span>
                  </div>
                </div>
              </SnackbarProvider>
            </DrawerProvider>
          </QueryClientProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
};
