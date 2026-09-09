import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Chile DAO — Confianza que se construye", template: "%s · Chile DAO" },
  description: "La red de confianza y reputación del ecosistema Web3 chileno.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body><SiteHeader />{children}<SiteFooter /></body>
    </html>
  );
}
