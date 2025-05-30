import React from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { ReduxProvider } from "@/redux/provider";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ToastProvider>
            <ReduxProvider>
              {children}
              <React.Suspense fallback={null}>
                <Toaster />
              </React.Suspense>
            </ReduxProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

export const metadata = {
  generator: "Smart Cart",
};
