// app/layout.tsx
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { SWRConfig } from "swr";
import { getUser, getTeamForUser } from "@/lib/db/queries";
import { SalesAgentWidget } from "@/ia/Agentes/sales-agent-widget"; // <- Agente IA flotante

export const metadata: Metadata = {
  metadataBase: new URL("https://www.neuromind33.online"),
  title: "NeuroMind33 → Software a medida, IA y Automatización en Argentina",
  description:
    "Software a medida, tiendas online y automatización con IA para empresas y PYMES en Argentina. Herramientas, integraciones y plataformas que generan crecimiento real con modelos de revenue share o equity.",
  keywords: [
    "software a medida argentina",
    "desarrollo de software buenos aires",
    "desarrollo web argentina",
    "inteligencia artificial para empresas",
    "ia para negocios",
    "automatización de procesos",
    "automatización con ia",
    "automatización empresarial",
    "software para empresas argentina",
    "herramientas de automatización empresas",
    "herramientas de productividad empresas",
    "crm para pymes argentina",
    "erp para pymes argentina",
    "integración de sistemas empresariales",
    "integraciones api empresas",
    "sistemas de gestión empresarial",
    "tiendas online argentina",
    "desarrollo ecommerce a medida",
    "sistemas de venta online",
    "consultoría tecnológica argentina",
    "consultoría inteligencia artificial",
    "revenue share software",
  ],
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "NeuroMind33 — Software claro. Crecimiento real.",
    description:
      "Software a medida, e-commerce y automatización con IA para empresas y PYMES en Argentina. Modelos de revenue share o equity.",
    url: "https://www.neuromind33.online",
    siteName: "NeuroMind33",
    images: [
      {
        url: "https://www.neuromind33.online/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "NeuroMind33 - Software IA y Automatización para empresas",
      },
    ],
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NeuroMind33 — IA + Software que hace crecer tu negocio",
    description:
      "Software a medida, automatización con IA y tiendas online para empresas con tracción en Argentina.",
    images: ["https://www.neuromind33.online/og-image.jpg"],
  },
  alternates: {
    canonical: "https://www.neuromind33.online",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0f172a",
};

const font = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-jakarta",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "NeuroMind33",
    url: "https://www.neuromind33.online",
    logo: "https://www.neuromind33.online/logo.png",
    description:
      "Software a medida, IA y automatización para empresas con tracción. Revenue share o equity.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Buenos Aires",
      addressCountry: "AR",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      url: "https://www.neuromind33.online/#contacto",
    },
  };

  return (
    <html lang="es" className={`${font.className} scroll-smooth`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Satoshi:wght@400;500;700;900&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>

      <body className="min-h-[100dvh] bg-gray-50 text-black dark:bg-slate-950 dark:text-white antialiased">
        <SWRConfig
          value={{
            fallback: {
              "/api/user": getUser(),
              "/api/team": getTeamForUser(),
            },
          }}
        >
          {children}
          <SalesAgentWidget />
        </SWRConfig>
		<script>
(function(){
  var pid = "demo-project";
  function send(){
    try{
      fetch("https://www.neuromind33.online/api/super-agent/sync/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: pid,
          type: "page_view",
          url: location.href,
          ref: document.referrer || null,
          ua: navigator.userAgent
        })
      });
    }catch(e){}
  }
  if (document.readyState === "complete") send();
  else window.addEventListener("load", send);
})();
</script>
      </body>
	  
    </html>
  );
}
