/**
 * Motor Universal de Hiper-Realismo Contextual e Direção de Cena (PromptEngine v7)
 * "VORIXA Contextual Story Director Engine" com Suporte ao `fal-ai/any-llm`
 * 
 * Filosofia Híbrida:
 * 1. Se `FAL_KEY` estiver presente e válida no ambiente, envia para a IA Neural da fal.ai (`fal-ai/any-llm`)
 *    com o System Prompt de Diretor de Cinema e Fotografia.
 * 2. Se a chamada à fal.ai falhar, tiver timeout ou estiver em modo local/mock, aciona instantaneamente
 *    o Motor Contextual Local (0ms de latência e 100% de confiabilidade).
 * 3. Preservação Universal de Fala: Qualquer roteiro ou diálogo entre aspas ("...") é mantido intocado.
 */

export interface OptimizePromptOptions {
  enhanceQuality?: boolean;
  toolType?: "image" | "video" | "lipsync" | "motion" | "upscale";
}

export type ContextIntent = "FOOD" | "PRODUCT" | "UGC" | "PORTRAIT" | "VEHICLE" | "ACTION" | "CINEMA" | "ARTISTIC" | "GENERAL";

export interface PromptAnalysisResult {
  isBasic: boolean;
  wordCount: number;
  reason: string | null;
  suggestedPrompt?: string;
}

export class PromptEngine {
  /**
   * Glossário completo e dinâmico de cores, cabelos, roupas, ações, comidas, objetos e ambientes
   */
  private static dynamicVocabulary: Record<string, string> = {
    // Cores e Cabelos
    "cabelo castanho longo cacheado": "long voluminous curly brunette brown hair",
    "cabelo castanho cacheado": "voluminous curly brunette brown hair",
    "cabelo loiro cacheado": "voluminous curly blonde hair",
    "cabelo preto cacheado": "voluminous curly black hair",
    "cabelo ruivo cacheado": "voluminous curly natural ginger red hair",
    "cabelo longo cacheado": "long voluminous curly hair",
    "cabelo curto cacheado": "short curly hair",
    "cabelo cacheado": "voluminous curly hair with natural ringlets",
    "cacheados": "curly",
    "cacheado": "curly with natural hair texture",
    "cabelo ondulado": "wavy hair with natural texture",
    "ondulados": "wavy",
    "ondulado": "wavy",
    "cabelo vermelho": "vibrant red hair",
    "cabelo ruivo": "natural ginger red hair with subtle highlights",
    "cabelo loiro": "natural blonde hair",
    "cabelo castanho": "rich brunette brown hair",
    "cabelo preto": "sleek black hair",
    "cabelo azul": "electric blue dyed hair",
    "cabelo rosa": "pastel pink dyed hair",
    "cabelo liso": "straight sleek hair",
    "cabelo curto": "stylish short hair",
    "cabelo longo": "long flowing hair",
    "careca": "bald head with natural skin sheen",
    "barba": "well-groomed natural beard",
    "bigode": "stylish mustache",

    // Cores Individuais e Plurais
    "vermelhos": "red",
    "vermelhas": "red",
    "vermelho": "red",
    "vermelha": "red",
    "azuis": "blue",
    "azul": "blue",
    "verdes": "green",
    "verde": "green",
    "amarelos": "yellow",
    "amarelas": "yellow",
    "amarelo": "yellow",
    "amarela": "yellow",
    "pretos": "black",
    "pretas": "black",
    "preto": "black",
    "preta": "black",
    "brancos": "white",
    "brancas": "white",
    "branco": "white",
    "branca": "white",
    "rosas": "pink",
    "rosa": "pink",
    "roxos": "purple",
    "roxas": "purple",
    "roxo": "purple",
    "roxa": "purple",
    "dourados": "golden",
    "douradas": "golden",
    "dourado": "golden",
    "dourada": "golden",
    "prateados": "silver",
    "prateadas": "silver",
    "prateado": "silver",
    "prateada": "silver",

    // Roupas e Acessórios
    "jaqueta de couro": "textured leather jacket",
    "jaqueta": "jacket",
    "vestido": "elegant dress",
    "camisa": "button-down shirt",
    "camiseta": "casual t-shirt",
    "calca jeans": "denim jeans",
    "calça jeans": "denim jeans",
    "oculos de sol": "stylish sunglasses",
    "óculos de sol": "stylish sunglasses",
    "oculos": "glasses",
    "óculos": "glasses",
    "chapeu": "hat",
    "chapéu": "hat",
    "bone": "cap",
    "boné": "cap",
    "tatuagem": "intricate skin tattoo",
    "tatuagens": "intricate skin tattoos",
    "piercing": "facial piercing",

    // Enquadramento e Poses
    "de corpo todo": "full-body shot showing head to toe, complete subject in frame, no cropped limbs",
    "de corpo inteiro": "full-body shot showing head to toe, complete subject in frame, no cropped limbs",
    "corpo todo": "full-body shot showing head to toe, complete subject in frame, no cropped limbs",
    "corpo inteiro": "full-body shot showing head to toe, complete subject in frame, no cropped limbs",
    "plano aberto": "wide angle shot, complete subject in frame",
    "plano medio": "medium full shot, full upper body and arms visible in frame",
    "plano médio": "medium full shot, full upper body and arms visible in frame",

    // Pessoas e Relações
    "mulher brasileira": "attractive Brazilian woman",
    "mulher": "woman",
    "homem": "man",
    "casal de jovens": "young couple in their early 20s",
    "casal": "couple",
    "jovem": "young adult",
    "jovens": "young adults",
    "modelo": "fashion model",
    "influenciadora": "social media influencer",
    "influenciador": "social media influencer",
    "menina": "girl",
    "menino": "boy",
    "crianca": "child",
    "criança": "child",
    "idoso": "elderly man",
    "idosa": "elderly woman",
    "rosto": "detailed facial features",
    "olhos": "expressive detailed eyes",
    "sorrindo": "smiling naturally",
    "rindo": "laughing candidly",
    "falando": "speaking naturally to camera",
    "andando": "walking confidently",
    "correndo": "running dynamically",
    "olhando para a camera": "looking directly into camera lens",
    "olhando para a câmera": "looking directly into camera lens",
    "ensaio de fotos": "professional outdoor photoshoot",
    "ensaio fotografico": "professional photoshoot",
    "ensaio fotográfico": "professional photoshoot",

    // Comidas e Frutas
    "maca": "crisp fresh apple with natural skin texture",
    "maçã": "crisp fresh apple with natural skin texture",
    "fruta": "fresh delicious fruit",
    "comida": "gourmet culinary dish",
    "cafe": "hot steaming aromatic coffee with crema",
    "café": "hot steaming aromatic coffee with crema",
    "copo de cafe": "takeaway coffee cup",
    "copo de café": "takeaway coffee cup",
    "cafeteria moderna": "contemporary modern specialty coffee shop",
    "cafeteria": "cozy cafe",
    "hamburguer": "gourmet burger with melting cheese",
    "hambúrguer": "gourmet burger with melting cheese",
    "pizza": "artisanal pizza with bubbling melted mozzarella",

    // Cenários e Ambientes
    "praia": "sunny tropical beach with turquoise ocean waves",
    "rua": "authentic city street with pedestrian life",
    "cidade": "urban modern cityscape",
    "parque": "lush green public park",
    "floresta": "lush deep forest",
    "quarto": "cozy bedroom with soft ambient lighting",
    "escritorio": "contemporary office",
    "escritório": "contemporary office",
    "espelho": "reflective mirror",
    "em frente a": "in front of",
    "em frente ao": "in front of",
    "segurando": "holding",
    "usando": "wearing",
    "vestindo": "wearing",

    // Iluminação e Efeitos
    "luz natural": "golden hour soft natural lighting",
    "luz de cinema": "volumetric cinematic lighting",
    "luz neon": "neon glow reflections",
    "fotorrealista": "photorealistic, 8k resolution",
    "alta resolucao": "ultra detailed, 8k resolution, raw photo",
    "alta resolução": "ultra detailed, 8k resolution, raw photo",
    "ugc": "authentic TikTok UGC creator style, high engagement",
  };

  /**
   * Analisa a densidade do prompt para identificar se está muito vago
   */
  static analyzePromptDensity(prompt: string): PromptAnalysisResult {
    if (!prompt || typeof prompt !== "string") {
      return { isBasic: true, wordCount: 0, reason: "O prompt está vazio." };
    }

    const trimmed = prompt.trim();
    const words = trimmed.split(/\s+/).filter(Boolean);

    if (words.length <= 4) {
      return {
        isBasic: true,
        wordCount: words.length,
        reason: "Prompts muito genéricos tendem a não ter o resultado esperado. Procure melhorar o seu prompt com mais detalhes de cena, iluminação ou estilo.",
      };
    }

    return {
      isBasic: false,
      wordCount: words.length,
      reason: null,
    };
  }

  /**
   * Classifica a intenção contextual do prompt
   */
  private static detectContextIntent(text: string): ContextIntent {
    const lower = text.toLowerCase();

    // 1. Estilo Artístico Explícito
    const artKeywords = [
      "anime", "manga", "mangá", "cartoon", "desenho", "animacao", "animação",
      "ilustracao", "ilustração", "3d render", "cgi", "pixel art", "pintura",
      "aquarela", "oil painting", "digital art", "chibi", "comic book", "quadrinho"
    ];
    if (artKeywords.some((kw) => lower.includes(kw))) {
      return "ARTISTIC";
    }

    // 2. UGC & Redes Sociais
    const ugcKeywords = ["ugc", "tiktok", "reels", "influenciador", "influencer", "selfie", "vlog", "espelho"];
    if (ugcKeywords.some((kw) => lower.includes(kw))) {
      return "UGC";
    }

    // 3. Retratos & Pessoas
    const humanKeywords = ["mulher", "woman", "homem", "man", "casal", "couple", "jovem", "young", "pessoa", "person", "rosto", "face", "portrait", "retrato", "modelo", "menina", "menino", "idoso", "idosa"];
    if (humanKeywords.some((kw) => lower.includes(kw))) {
      return "PORTRAIT";
    }

    // 4. Veículos
    const vehicleKeywords = ["carro", "car", "moto", "motorcycle", "hypercar", "veículo", "supercar"];
    if (vehicleKeywords.some((kw) => lower.includes(kw))) {
      return "VEHICLE";
    }

    // 5. Gastronomia
    const foodKeywords = ["maca", "maçã", "apple", "fruta", "fruit", "comida", "food", "cafe", "café", "coffee", "hamburguer", "hambúrguer", "burger", "pizza"];
    if (foodKeywords.some((kw) => lower.includes(kw))) {
      return "FOOD";
    }

    // 6. E-commerce & Produtos
    const productKeywords = ["produto", "product", "relogio", "relógio", "watch", "perfume", "tenis", "tênis", "sneakers", "garrafa", "bottle", "anúncio", "anuncio"];
    if (productKeywords.some((kw) => lower.includes(kw))) {
      return "PRODUCT";
    }

    return "GENERAL";
  }

  /**
   * Chamada assíncrona ao LLM da fal.ai (com fallback seguro para o motor local)
   */
  static async optimizeAsync(prompt: string, options: OptimizePromptOptions = {}): Promise<{
    originalPrompt: string;
    optimizedPrompt: string;
    preservedSpeech: string | null;
    inferredContext: ContextIntent;
    isBasic: boolean;
    provider: "fal-ai-llm" | "local-engine";
  }> {
    const localResult = this.optimize(prompt, options);
    const falKey = process.env.FAL_KEY;

    // Se não tiver chave real configurada ou for mock, retorna o motor local instantâneo
    if (!falKey || falKey === "sua-chave-api-da-fal-ai" || falKey.startsWith("mock-")) {
      return { ...localResult, provider: "local-engine" };
    }

    try {
      const { fal } = await import("@fal-ai/client");
      fal.config({ credentials: falKey });

      const isVideo = options.toolType === "video";
      
      /* REGRAS COMPLEXAS COMENTADAS A PEDIDO DO USUÁRIO PARA TESTE PURO:
      const systemPrompt = `You are an expert photographic and cinematic prompt translator for Recraft V3 and FLUX.
      Translate the user's Portuguese request into natural, highly descriptive English for text-to-image generation.
      Strict Composition, Typography & Anatomy Instructions:
      1. Preserve 100% of user choices (hair colors, curls/texture, age, clothes, props, settings, and any written words like signs or slogans).
      2. Full-Body Framing: If full body ("corpo todo" or "corpo inteiro") is requested: "A full-body photograph with camera pulled far back, wide establishing view showing the subject completely from head to toe, legs and training shoes planted on the floor, entire silhouette in frame".
      3. Hand Anatomy & Fingers: When holding bottles, cups or accessories, explicitly instruct: "holding the object with five clearly separated, anatomically perfect fingers wrapped around it, distinct knuckles, detailed natural fingernails, flawless natural hand grip, no fused or missing fingers".
      4. Background Signage & Machines: If the user mentions words or signs on the wall (e.g. TREINE, PENSE), format them clearly as bold typography: 'typography signs with words "TREINE" and "PENSE" on the wall'. Always populate the gym background with real gym workout machines, weight racks, and gym equipment.
      5. Lighting & Sharp Visibility: ALWAYS enforce bright front-lit natural indoor lighting, crystal clear facial features and skin texture, NO dark silhouettes, NO harsh backlighting, NO dark shadows on face or body.
      6. Return ONLY the translated and enriched prompt text directly without extra conversational noise.`;
      */

      // Tradução inteligente de alto padrão cinematográfico e cenografia atrativa:
      const systemPrompt = `You are a world-class prompt director and translator for advanced image generation models (Google Imagen 3, FLUX Pro, Recraft).
Translate the user's Portuguese prompt faithfully into fluent English while automatically elevating the visual aesthetic.

CORE PRINCIPLE - ATTRACTIVE & PREMIUM BY DEFAULT:
Unless the user explicitly asks for something "feio", "velho", "abandonado", "pobre" or "simples", ALWAYS present a modern, visually attractive, well-kept, well-lit and vibrant setting. Never render drab, dirty, empty or mediocre spaces.

MANDATORY DIRECTIVES:
1. Full Body Shot: If "corpo todo", "corpo inteiro", "de corpo todo" or "de corpo inteiro" is requested, you MUST ALWAYS instruct: "wide establishing full-body environmental shot, camera placed far back showing the entire body from head down to legs and shoes with visible floor space around feet, full figure completely in frame from head to toe, never cropped at waist, knees or thighs".
2. Attractive & Populated Environment: Make backgrounds lively, upscale and well-arranged (e.g. stylish modern gym with sleek contemporary machines, clean glass mirrors, polished floor; or lively coffee shop, stylish office). Include subtle, natural background people doing everyday activities with pleasant depth-of-field, creating an authentic, lived-in atmosphere without clutter or overcrowding.
3. Lighting & Atmosphere: Enforce clear, luminous, natural ambient lighting (soft sunbeams, luminous interior windows, warm architectural accents). Avoid gloomy dark underexposed shadows.
4. Human Realism: Natural authentic skin texture, realistic micro-details, healthy natural skin tone, avoiding plastic artificial airbrushing.
5. Preserved Text: Keep specific written words (e.g. "TREINE", "PENSE") in the original Portuguese language, formatted as clean readable typography on the background wall/sign.
6. Output Format: Output ONLY the translated, enriched prompt text directly without any conversational preamble or quotes.`;

      const result: any = await fal.subscribe("fal-ai/any-llm", {
        input: {
          prompt: prompt,
          system_prompt: systemPrompt,
        },
      });

      const llmOutput = result?.data?.output || result?.output || "";
      if (llmOutput && typeof llmOutput === "string" && llmOutput.trim().length > 10) {
        console.log(`\n🧠 [IA REAL FAL.AI LLM ENRIQUECIMENTO]:\n${llmOutput.trim()}\n`);
        return {
          originalPrompt: prompt,
          optimizedPrompt: llmOutput.trim(),
          preservedSpeech: localResult.preservedSpeech,
          inferredContext: localResult.inferredContext,
          isBasic: localResult.isBasic,
          provider: "fal-ai-llm",
        };
      }
    } catch (err: any) {
      console.warn("Falha no LLM da fal.ai, usando fallback local:", err?.message || err);
    }

    return { ...localResult, provider: "local-engine" };
  }

  /**
   * Otimização síncrona local (alta velocidade e fallback)
   */
  static optimize(prompt: string, options: OptimizePromptOptions = {}): {
    originalPrompt: string;
    optimizedPrompt: string;
    preservedSpeech: string | null;
    inferredContext: ContextIntent;
    isBasic: boolean;
  } {
    if (!prompt || typeof prompt !== "string") {
      return {
        originalPrompt: prompt || "",
        optimizedPrompt: prompt || "",
        preservedSpeech: null,
        inferredContext: "GENERAL",
        isBasic: true,
      };
    }

    const trimmed = prompt.trim();
    if (!trimmed) {
      return {
        originalPrompt: "",
        optimizedPrompt: "",
        preservedSpeech: null,
        inferredContext: "GENERAL",
        isBasic: true,
      };
    }

    const density = this.analyzePromptDensity(trimmed);

    // 1. Extrair falas entre aspas
    let speechContent: string | null = null;
    const speechRegex = /["“'`]([^"”'`]+)["”'`]/;
    const match = trimmed.match(speechRegex);
    if (match) {
      speechContent = match[1] || null;
    }

    // 2. Isolar visual
    let visualDescription = trimmed;
    if (speechContent) {
      visualDescription = visualDescription.replace(speechRegex, "").trim();
    }

    const intent = this.detectContextIntent(visualDescription);

    // Tradução dinâmica elemento por elemento
    let translated = visualDescription;
    const sortedEntries = Object.entries(this.dynamicVocabulary).sort((a, b) => b[0].length - a[0].length);
    for (const [pt, en] of sortedEntries) {
      const escapedPt = pt.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const reg = new RegExp(`(^|\\s|[.,!?;])${escapedPt}(?=$|\\s|[.,!?;])`, "gi");
      translated = translated.replace(reg, `$1${en}`);
    }

    // Conectivos estruturais
    translated = translated
      .replace(/\buma foto de\b/gi, "a photo of")
      .replace(/\bum video de\b/gi, "a cinematic video of")
      .replace(/\bum vídeo de\b/gi, "a cinematic video of")
      .replace(/\bum retrato de\b/gi, "a portrait of")
      .replace(/\bfoto de\b/gi, "photo of")
      .replace(/\bum\b/gi, "a")
      .replace(/\buma\b/gi, "a")
      .replace(/\bcom\b/gi, "with")
      .replace(/\bem\b/gi, "in")
      .replace(/\bde\b/gi, "of")
      .replace(/\be\b/gi, "and")
      .replace(/\bno\b/gi, "in the")
      .replace(/\bna\b/gi, "in the")
      .replace(/\bsob\b/gi, "under")
      .replace(/\bfundo\b/gi, "background")
      .replace(/\bcamera lenta\b/gi, "slow motion")
      .replace(/\bcâmera lenta\b/gi, "slow motion");

    // 3. Enriquecimento de Óptica Fotográfica e Textura
    const isVideo = options.toolType === "video";

    if (options.enhanceQuality !== false) {
      switch (intent) {
        case "ARTISTIC":
          translated += ", highest quality, masterpiece, award winning artistic detail, vibrant clean lines";
          break;

        case "FOOD":
          if (isVideo) {
            translated += ", extreme macro detail, rising steam, glossy organic textures, slow push-in camera motion, warm directional studio lighting, cinematic 4k video, 60 fps";
          } else {
            translated += ", extreme macro detail, authentic organic surface textures, studio lighting, depth of field, shot on 100mm macro f/2.8 lens, 8k commercial food photography, raw unedited quality, ray-traced reflections";
          }
          break;

        case "PRODUCT":
          if (isVideo) {
            translated += ", luxury commercial advertisement, 360 smooth orbital camera turn, soft studio softbox lighting, pristine reflections, 4k 60fps cinematic video";
          } else {
            translated += ", luxury commercial product photography, softbox studio lighting, crystal clear reflections, elegant bokeh depth of field, shot on 90mm f/2.8 lens, 8k commercial masterpiece";
          }
          break;

        case "UGC":
          if (isVideo) {
            translated += ", authentic smartphone front-camera vlog style, natural indoor ambient light, genuine spontaneous facial micro-expressions, subtle handheld camera movement, 4k 60fps";
          } else {
            translated += ", authentic smartphone selfie portrait, natural soft ambient light, authentic skin texture with natural micropores, candid unposed expression, high resolution 8k raw photo";
          }
          break;

        case "PORTRAIT":
          const isFullBody = translated.toLowerCase().includes("full-body") || translated.toLowerCase().includes("wide");
          if (isVideo) {
            translated += `, candid documentary style, authentic natural skin texture, visible micropores, fine hair strands, subtle facial asymmetry, subsurface scattering, smooth 60fps cinematic camera tracking, natural blinks and gentle breathing motion, 4k raw video, zero plastic CGI effect`;
          } else {
            const lens = isFullBody ? "35mm f/1.8 wide lens, full body in frame, no cropped limbs" : "Sony A7 IV 85mm f/1.4 GM lens";
            translated += `, candid unposed photograph, shot on ${lens}, natural soft daylight, authentic skin texture with visible micropores and natural fine details, subtle skin sheen, unretouched raw photo, natural facial asymmetry, photorealistic depth of field, zero plastic skin, no CGI, no airbrushing`;
          }
          break;

        case "VEHICLE":
          if (isVideo) {
            translated += ", high speed tracking camera shot, dynamic low-angle dolly pan, realistic motion blur, realistic road reflections, 4k 60fps cinematic car commercial";
          } else {
            translated += ", automotive commercial photography, high-gloss automotive paint reflections, dynamic low angle shot, 8k resolution, raw photography, dramatic sunset rim lighting";
          }
          break;

        case "GENERAL":
        default:
          if (isVideo) {
            translated += ", cinematic 4k video, smooth fluid motion, volumetric atmospheric lighting, professional color grading, realistic physics";
          } else {
            translated += ", photorealistic 8k resolution, authentic natural textures, volumetric lighting, shot on 35mm f/1.8 lens, masterpiece photography, uncompressed raw detail";
          }
          break;
      }
    }

    // 4. Reanexar fala original
    if (speechContent) {
      translated = `${translated.trim()} [Dialogue/Speech Script: "${speechContent}"]`;
    }

    return {
      originalPrompt: trimmed,
      optimizedPrompt: translated.trim(),
      preservedSpeech: speechContent,
      inferredContext: intent,
      isBasic: density.isBasic,
    };
  }
}
