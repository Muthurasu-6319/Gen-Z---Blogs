import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const font = Plus_Jakarta_Sans({ subsets: ["latin"], display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://genzblog.example.com'),
  title: {
    default: "GenZ Articles - Modern Insights for the New Generation",
    template: "%s | GenZ Articles"
  },
  description: "A professional blog website targeting worldwide audience with modern insights.",
  openGraph: {
    title: "GenZ Articles - Modern Insights",
    description: "A professional blog website targeting worldwide audience with modern insights.",
    url: "/",
    siteName: "GenZ Articles",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GenZ Articles",
    description: "Modern Insights for the New Generation",
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${font.className} min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 antialiased flex flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Header />
          <main className="flex-grow pt-16">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
