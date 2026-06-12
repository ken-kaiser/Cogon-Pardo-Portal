import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
import { QueryProvider } from "@/context/query-provider";
import { AmbientBackground } from "@/components/ui/ambient-background";
import { ThemeProvider } from "@/components/theme-provider";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Cogon-Pardo Portal",
  description:
    "Barangay Cogon-Pardo Digital Services Portal — Request certificates, track status, and manage barangay services online.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakarta.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans relative">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <QueryProvider>
            <AuthProvider>
              <AmbientBackground />
              {children}
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
