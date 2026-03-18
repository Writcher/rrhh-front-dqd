import { Inter } from "next/font/google";
import "./globals.css";
import { SnackbarProvider } from "@/lib/contexts/snackbar";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "../lib/providers/queryProvider";
import { AuthSessionProvider } from "@/lib/providers/sessionProvider";
import { DrawerProvider } from "@/lib/contexts/drawer";

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} antialiased`}>
        <AuthSessionProvider>
          <QueryClientProvider client={queryClient}>
            <DrawerProvider>
              <SnackbarProvider>
                <div className='flex h-screen w-screen overflow-hidden'>
                  {children}
                </div>
              </SnackbarProvider>
            </DrawerProvider>
          </QueryClientProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
};
