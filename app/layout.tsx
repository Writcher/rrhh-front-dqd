import { Inter } from "next/font/google";
import "./globals.css";
import { SnackbarProvider } from "@/lib/contexts/snackbar";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "../lib/providers/queryProvider";
import { AuthSessionProvider } from "@/lib/providers/sessionProvider";
import { DrawerProvider } from "@/lib/contexts/drawer";
import { auth } from "@/auth";
import { Metadata } from "next";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Registro Horario",
  description: "Design, Quality and Development.",
};

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
                </div>
              </SnackbarProvider>
            </DrawerProvider>
          </QueryClientProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
};
