// app/layout.tsx
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { SWRConfig } from "swr";
import { getUser, getTeamForUser } from "@/lib/db/queries";

export const metadata: Metadata = {
  title: "NeuroMind33 — Software, Automatización e IA",
  description:
    "Software premium que amplifica el negocio: Automatización de procesos, IA aplicada y e-commerce serio.",
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: "NeuroMind33 — Software claro. Crecimiento real.",
    description:
      "Tiendas, Automatización e IA para empresas y PYMES.",
    images: ["/og-image.jpg"]
  },
  themeColor: "#f7f6f4"
};

export const viewport: Viewport = {
  maximumScale: 1,
};

const font = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={font.className}>
      <body className="min-h-[100dvh] bg-gray-50 text-black dark:text-white">
        <SWRConfig
          value={{
            // Importante: NO await aquí; sólo las vistas que lo lean suspenderán
            fallback: {
              "/api/user": getUser(),
              "/api/team": getTeamForUser(),
            },
          }}
        >
          {children}
        </SWRConfig>
      </body>
    </html>
  );
}
