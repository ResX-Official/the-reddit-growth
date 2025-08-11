import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner';
import AuthSessionProvider from '@/components/providers/session-provider';


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Reddit Growth || Reddit Account Management",
  description: "Reddit Growth - Reddit Account Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <body className={inter.className}>
    <AuthSessionProvider>
      <Toaster />
      {children}
    </AuthSessionProvider>
    </body>
    </html>
  );
}
