import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/providers";
export const metadata: Metadata = { title: "HYPERZ", description: "Gestão de energia solar e automação" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="pt-BR"><body><Providers>{children}</Providers></body></html>; }
