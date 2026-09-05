import type { Metadata } from "next";
import Script from "next/script";
import { Outfit, Inter, Instrument_Serif } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { CookieConsentBanner } from "@/components/layout/CookieConsentBanner";
import prisma from "@/lib/prisma";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXTAUTH_URL ||
    "https://vortixia.com.br";

  let siteTitle = "VORTIXIA - Crie Conteúdo com IA";
  let siteDescription =
    "Crie vídeos, imagens e conteúdo viral com as melhores IAs do mundo. Workflows visuais, influenciadores de IA e mais.";
  let siteKeywords =
    "inteligência artificial, gerador de vídeo, FLUX, Kling AI, motion control, lipsync, IA criativa, workflows visuais";
  let faviconUrl = "/favicon.png";
  let ogImageUrl = `${baseUrl}/og-image.jpg`;

  try {
    const settings = await prisma.systemSetting.findMany({
      where: {
        key: {
          in: [
            "siteTitle",
            "siteDescription",
            "siteKeywords",
            "faviconUrl",
            "ogImageUrl",
          ],
        },
      },
    });

    for (const setting of settings) {
      if (setting.key === "siteTitle" && setting.value) siteTitle = setting.value;
      if (setting.key === "siteDescription" && setting.value) siteDescription = setting.value;
      if (setting.key === "siteKeywords" && setting.value) siteKeywords = setting.value;
      if (setting.key === "faviconUrl" && setting.value) faviconUrl = setting.value;
      if (setting.key === "ogImageUrl" && setting.value) ogImageUrl = setting.value;
    }
  } catch {
    // Fallback gracioso caso banco esteja inicializando
  }

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: siteTitle,
      template: `%s | ${siteTitle}`,
    },
    description: siteDescription,
    keywords: siteKeywords.split(",").map((k) => k.trim()),
    authors: [{ name: "VORTIXIA AI Creative OS" }],
    creator: "VORTIXIA",
    publisher: "VORTIXIA",
    icons: {
      icon: faviconUrl,
      shortcut: faviconUrl,
      apple: faviconUrl,
    },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url: baseUrl,
      title: siteTitle,
      description: siteDescription,
      siteName: siteTitle,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: siteTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: siteTitle,
      description: siteDescription,
      images: [ogImageUrl],
      creator: "@vortixia_ai",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${outfit.variable} ${inter.variable} ${instrumentSerif.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300 selection:bg-violet-500/30 selection:text-white">
        <ThemeProvider>
          <Toaster richColors position="top-right" />
          {children}
          <CookieConsentBanner />
        </ThemeProvider>
      </body>
    </html>
  );
}
