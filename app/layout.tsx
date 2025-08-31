import type React from "react";
import { GeistSans } from "geist/font/sans";
import { Manrope } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Suspense } from "react";

// ✅ Theme Provider (you already have this)
import { ThemeProvider } from "@/components/theme-provider";

// ✅ Sidebar + Navbar
import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${manrope.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="font-sans bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex h-screen w-screen overflow-hidden">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex flex-col flex-1">
              {/* Top Navbar */}
              <Navbar />

              {/* Page Content */}
              <main className="flex-1 overflow-y-auto p-6">
                <Suspense fallback={null}>
                  {children}
                  <Analytics />
                </Suspense>
              </main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
