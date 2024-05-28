import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Toaster from '@/components/Toaster';
import { AuthProvider } from '@/context/AuthContext';
import Nav from '@/components/Nav';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Learn Plus LMS',
  description: 'Find the best learning experience',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${inter.className}`}>
        <AuthProvider>
          <Toaster />
          <Nav />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
