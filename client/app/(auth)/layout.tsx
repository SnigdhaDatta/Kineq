import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kineq",
  description:
    "Organize and track your Asian dramas and anime watchlist in your own creative way! Take full control over your watchlist with Kineq.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="mx-auto min-h-screen bg-white px-4">{children}</main>;
}
