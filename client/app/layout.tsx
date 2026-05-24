import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Head from "next/head";
import "./global.css";
import Footer from "../components/footer";
import Header from "../components/header";

import ChatWidget from "../components/ChatWidget";
import NotificationOptInPrompt from "../components/NotificationOptInPrompt";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kineq",
  description:
    "Organize and track your anything you watch from Asian dramas , anime watchlist to hollywood shows  in your own creative way! Take full control over your watchlist with Kineq.",
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
      <Head>
        {/* OneSignal SDK script */}
        <script
          src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
          defer
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.OneSignalDeferred = window.OneSignalDeferred || [];
              OneSignalDeferred.push(async function(OneSignal) {
                await OneSignal.init({
                  appId: "e15ad3e1-b157-4e95-985d-4816a48d2e56",
                  safari_web_id: "web.onesignal.auto.0e007fdd-4c29-4efe-85fd-d9ae8478b7ea",
                  allowLocalhostAsSecureOrigin: true,
                  notifyButton: {
                    enable: true,
                  },
                });
              });
            `,
          }}
        />
        {/* Script for Structured Data: WebSite & Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Kineq",
              url: "https://kin-eq.snowpie.me/",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://kin-eq.snowpie.me/?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
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
        {/* Primary Meta Tags */}
        <title>Kineq</title>
        <meta name="title" content="Kineq" />
        <meta
          name="description"
          content="Organize and track anything you watch from Asian dramas, anime watchlist to Hollywood shows in your own creative way! Take full control over your watchlist with Kineq."
        />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://kin-eq.snowpie.me/" />
        <meta property="og:title" content="Kineq" />
        <meta
          property="og:description"
          content="Organize and track anything you watch from Asian dramas, anime watchlist to Hollywood shows in your own creative way! Take full control over your watchlist with Kineq."
        />
        <meta property="og:image" content="/og-image.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://kin-eq.snowpie.me/" />
        <meta property="twitter:title" content="Kineq" />
        <meta
          property="twitter:description"
          content="Organize and track anything you watch from Asian dramas, anime watchlist to Hollywood shows in your own creative way! Take full control over your watchlist with Kineq."
        />
        <meta property="twitter:image" content="/og-image.png" />
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-black `}
      >
        <Header />
        <main className="mx-auto min-h-screen">{children}</main>
        <Footer />
        <NotificationOptInPrompt />
        <ChatWidget />
      </body>
    </html>
  );
}
