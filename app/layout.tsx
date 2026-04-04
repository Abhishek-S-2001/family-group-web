import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Import your new Providers wrapper and Chat Panel
import Providers from '@/components/Providers';
import GlobalChatWrapper from '@/components/chat/GlobalChatWrapper';
import TermsGuard from '@/components/TermsGuard';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'FamSilo',
  description: 'Your private family network.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Providers>
          {/* Your page content wrapped in the T&C guard */}
          <TermsGuard>
            {children} 
          </TermsGuard>
          
          {/* Your floating chat panel, now safely inside the Provider! */}
          <GlobalChatWrapper /> 
        </Providers>
      </body>
    </html>
  );
}