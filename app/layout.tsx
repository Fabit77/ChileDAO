import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chile DAO",
  description: "La red de confianza y reputación del ecosistema Web3 chileno.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
