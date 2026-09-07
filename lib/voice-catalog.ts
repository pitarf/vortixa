/**
 * Catálogo Oficial de Vozes de Alta Fidelidade (Estúdio Humano) do VORIXA.
 * Motor: ElevenLabs Multilingual & Turbo via Fal.ai (`fal-ai/elevenlabs/tts/turbo-v2.5`).
 * Todas as vozes são de atores reais em português, com afinação e cadência 100% naturais (sem efeitos artificiais).
 */
export interface VoiceOption {
  id: string;
  name: string;
  gender: "female" | "male";
  description: string;
  categoryLabel: string;
}

export const VORIXA_VOICES: VoiceOption[] = [
  // Vozes Femininas Reais
  {
    id: "Rachel",
    name: "Helena (Feminina / Suave e Elegante)",
    gender: "female",
    description: "Voz feminina clara, acolhedora, serena e natural. Ideal para narração e vídeos comerciais.",
    categoryLabel: "👩 Feminina Suave",
  },
  {
    id: "Sarah",
    name: "Camila (Feminina / Jovem e Expressiva)",
    gender: "female",
    description: "Voz feminina jovem, confiante, moderna e dinâmica.",
    categoryLabel: "👩 Feminina Jovem",
  },
  {
    id: "Jessica",
    name: "Sofia (Feminina / Simpática e Espontânea)",
    gender: "female",
    description: "Voz feminina calorosa, amigável e conversacional.",
    categoryLabel: "👩 Feminina Espontânea",
  },
  {
    id: "Lily",
    name: "Clara (Feminina / Madura e Confiante)",
    gender: "female",
    description: "Voz feminina aveludada, refinada e madura, excelente para apresentações corporativas.",
    categoryLabel: "👩 Feminina Madura",
  },

  // Vozes Masculinas Reais
  {
    id: "Brian",
    name: "Lucas (Masculino / Natural e Comercial)",
    gender: "male",
    description: "Voz masculina natural, equilibrada, descontraída e com ótima dicção em português.",
    categoryLabel: "👨 Masculino Comercial",
  },
  {
    id: "George",
    name: "Marcelo (Masculino / Locutor e Grave)",
    gender: "male",
    description: "Voz masculina profunda, cinematográfica e de autoridade para trailers e anúncios.",
    categoryLabel: "👨 Masculino Grave",
  },
  {
    id: "Charlie",
    name: "Gabriel (Masculino / Jovem e Enérgico)",
    gender: "male",
    description: "Voz masculina jovem, comunicativa, vibrante e motivada.",
    categoryLabel: "👨 Masculino Jovem",
  },
  {
    id: "Bill",
    name: "Senhor Arthur (Masculino / Maduro e Experiente)",
    gender: "male",
    description: "Voz masculina madura, respeitosa, sóbria e compassada (sem alterações artificiais).",
    categoryLabel: "👨 Masculino Maduro",
  },
];

export const DEFAULT_FEMALE_VOICE = "Rachel";
export const DEFAULT_MALE_VOICE = "Brian";
