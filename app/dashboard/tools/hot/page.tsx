import { Metadata } from "next";
import HotGenerationClient from "./HotGenerationClient";

export const metadata: Metadata = {
  title: "Gerador Hot (+18) | VORIXA",
  description: "Criação de imagens e vídeos sensuais e adultos sem censura através de modelos de IA de alta fidelidade.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function HotToolPage() {
  return <HotGenerationClient />;
}
