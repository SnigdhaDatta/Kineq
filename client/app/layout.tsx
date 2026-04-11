import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./global.css";
import Footer from "../components/footer";
import Header from "../components/header";

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
    "Organize and track your Asian dramas and anime watchlist in your own creative way! Take full control over your watchlist with Kineq.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
 
  return (
    <html lang="en" className="scroll-smooth hydrated">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-black `}
      >
        <Header />
        <main className="mx-auto min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
