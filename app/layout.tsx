import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GoogleAnalytics } from "@next/third-parties/google";

const font = Plus_Jakarta_Sans({ subsets: ["latin"], display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://genzblogs.genzneuralx.com'),
  title: {
    default: "GenZ Articles - Modern Insights for the New Generation",
    template: "%s | GenZ Articles"
  },
  description: "A professional blog website targeting worldwide audience with modern insights on tech, design, and future trends.",
  keywords: ["Gen Z", "Technology", "Design", "Future Trends", "Career", "Modern Insights", "Blog"],
  authors: [{ name: "GenZ Neural X Team" }],
  creator: "GenZ Neural X",
  publisher: "GenZ Articles",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "GenZ Articles - Modern Insights",
    description: "A professional blog website targeting worldwide audience with modern insights on tech, design, and future trends.",
    url: "/",
    siteName: "GenZ Articles",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: '/default-blog.jpg',
        width: 1200,
        height: 630,
        alt: 'GenZ Articles Banner',
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GenZ Articles",
    description: "Modern Insights for the New Generation",
    creator: "@GenZNeuralX",
    images: ['/default-blog.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
  }
};

import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID || '';
  try {
    const docRef = doc(db, 'settings', 'general');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && docSnap.data().adsenseId) {
      adsenseId = docSnap.data().adsenseId;
    }
  } catch (error) {
    console.error("Error fetching AdSense ID:", error);
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://genzblogs.genzneuralx.com'}/#website`,
                  "url": process.env.NEXT_PUBLIC_SITE_URL || 'https://genzblogs.genzneuralx.com',
                  "name": "GenZ Articles",
                  "description": "A professional blog website targeting worldwide audience with modern insights.",
                  "publisher": {
                    "@id": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://genzblogs.genzneuralx.com'}/#organization`
                  },
                  "potentialAction": [{
                    "@type": "SearchAction",
                    "target": {
                      "@type": "EntryPoint",
                      "urlTemplate": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://genzblogs.genzneuralx.com'}/search?q={search_term_string}`
                    },
                    "query-input": "required name=search_term_string"
                  }],
                  "inLanguage": "en-US"
                },
                {
                  "@type": "Organization",
                  "@id": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://genzblogs.genzneuralx.com'}/#organization`,
                  "name": "GenZ Articles",
                  "url": process.env.NEXT_PUBLIC_SITE_URL || 'https://genzblogs.genzneuralx.com',
                  "logo": {
                    "@type": "ImageObject",
                    "inLanguage": "en-US",
                    "@id": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://genzblogs.genzneuralx.com'}/#/schema/logo/image/`,
                    "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://genzblogs.genzneuralx.com'}/favicon.ico`,
                    "contentUrl": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://genzblogs.genzneuralx.com'}/favicon.ico`,
                    "width": 256,
                    "height": 256,
                    "caption": "GenZ Articles"
                  }
                }
              ]
            })
          }}
        />
      </head>
      <body suppressHydrationWarning className={`${font.className} min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 antialiased flex flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Header />
          <main className="flex-grow pt-16">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
        {adsenseId && (
          <Script
            async
            strategy="afterInteractive"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
            crossOrigin="anonymous"
          />
        )}
      </body>
    </html>
  );
}
