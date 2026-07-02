import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./global.css";

import Header from "../components/header";
import Footer from "../components/footer";
import ChatWidget from "../components/ChatWidget";
import NotificationReminder from "../components/NotificationReminder";

import {
  getOneSignalBootstrapScript,
  getOneSignalHelperScript,
} from "../lib/onesignal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kin-eq.snowpie.me"),

  title: "Kineq",

  description:
    "Organize and track everything you watch—from Asian dramas and anime to Hollywood shows—in your own creative way. Take full control of your watchlists with Kineq.",

  openGraph: {
    title: "Kineq",
    description:
      "Organize and track everything you watch—from Asian dramas and anime to Hollywood shows—in your own creative way. Take full control of your watchlists with Kineq.",
    url: "/",
    siteName: "Kineq",
    type: "website",
    images: [
      {
        url: "/images/mockup.png",
        width: 1200,
        height: 630,
        alt: "Kineq Website Dashboard Mockup",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Kineq",
    description:
      "Organize and track everything you watch—from Asian dramas and anime to Hollywood shows—in your own creative way. Take full control of your watchlists with Kineq.",
    images: ["/images/mockup.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className="scroll-smooth hydrated"
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-black`}
      >
        {/* Structured Data */}
        <Script
          id="structured-data"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Kineq",
              url: "https://kin-eq.snowpie.me/",
              publisher: {
                "@type": "Organization",
                name: "Kineq",
                url: "https://kin-eq.snowpie.me/",
                logo: {
                  "@type": "ImageObject",
                  url: "https://img.icons8.com/doodle/48/film-reel--v1.png",
                },
              },
            }),
          }}
        />

        {/* OneSignal SDK */}
        <Script
          src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
          strategy="afterInteractive"
        />

        <Script id="onesignal-bootstrap" strategy="afterInteractive">
          {getOneSignalBootstrapScript()}
        </Script>

        <Script id="onesignal-helpers" strategy="afterInteractive">
          {getOneSignalHelperScript(
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
          )}
        </Script>

        <Header />

        <main className="mx-auto min-h-screen">{children}</main>

        <Footer />

        <NotificationReminder />

        <ChatWidget />
      </body>
    </html>
  );
}
