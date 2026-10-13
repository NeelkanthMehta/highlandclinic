import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import Footer from "@/components/organisms/footer";
import Header from "@/components/organisms/header";
import { getSessionUser } from "@/lib/auth";
import SessionTimeoutProvider from "@/components/auth/session-timeout-provider";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Highland Medical Center",
  description: "Excellence in Healthcare, Committed to Your Well-being",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <SessionTimeoutProvider user={user}>
          <Header user={user} />
          {children}
          <Footer />
        </SessionTimeoutProvider>
      </body>
    </html>
  );
}
