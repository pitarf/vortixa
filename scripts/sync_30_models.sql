BEGIN;

INSERT INTO "MarketplaceModel" (
  id, name, slug, type, category, bio, "avatarUrl", "coverUrl",
  gallery, tags, "promptTrigger", "referenceFaceUrl", "loraModelId",
  "instagramHandle", location, "bookingPriceCents", "creditsPricePerGen",
  status, "isFeatured", "isHot18", "updatedAt"
) VALUES (
  'model_isabella_fiore', 'Isabella Fiore', 'isabella-fiore', 'AI'::"ModelType", 'FASHION'::"ModelCategory", 'Musa da alta costura milanesa com traços esculturais, olhar penetrante e presença imponente em passarelas e capas de revista de luxo.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
  '{"https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"}', '{"Fashion","Haute Couture","Milão","Vogue","Editorial"}', 'ultra photorealistic 8k full body and portrait of Isabella Fiore, Italian fashion model, high fashion editorial runway, striking hazel eyes, flowing dark brunette waves, wearing structured silk blazer and trousers, soft studio key lighting, Hasselblad H6D-100c, 85mm lens f/1.4, cinematic color grading', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80', 'lora_isabella_fiore_v1',
  '@isabellafiore.ai', 'Milão, Itália', NULL, 5,
  TRUE, TRUE, FALSE, NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  category = EXCLUDED.category,
  bio = EXCLUDED.bio,
  "avatarUrl" = EXCLUDED."avatarUrl",
  "coverUrl" = EXCLUDED."coverUrl",
  gallery = EXCLUDED.gallery,
  tags = EXCLUDED.tags,
  "promptTrigger" = EXCLUDED."promptTrigger",
  "referenceFaceUrl" = EXCLUDED."referenceFaceUrl",
  "loraModelId" = EXCLUDED."loraModelId",
  "instagramHandle" = EXCLUDED."instagramHandle",
  location = EXCLUDED.location,
  "bookingPriceCents" = EXCLUDED."bookingPriceCents",
  "creditsPricePerGen" = EXCLUDED."creditsPricePerGen",
  status = EXCLUDED.status,
  "isFeatured" = EXCLUDED."isFeatured",
  "isHot18" = EXCLUDED."isHot18",
  "updatedAt" = NOW();

INSERT INTO "MarketplaceModel" (
  id, name, slug, type, category, bio, "avatarUrl", "coverUrl",
  gallery, tags, "promptTrigger", "referenceFaceUrl", "loraModelId",
  "instagramHandle", location, "bookingPriceCents", "creditsPricePerGen",
  status, "isFeatured", "isHot18", "updatedAt"
) VALUES (
  'model_camila_duarte', 'Camila Duarte', 'camila-duarte', 'AI'::"ModelType", 'COMMERCIAL'::"ModelCategory", 'Modelo brasileira com beleza natural, carisma envolvente e tom de pele caloroso, perfeita para campanhas de lifestyle, beleza limpa e varejo moderno.', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80',
  '{"https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80"}', '{"Comercial","Beleza Natural","Brasil","Publicidade","Skincare"}', 'commercial 8k portrait and full body of Camila Duarte, Brazilian lifestyle model, radiant warm smile, natural skin texture with subtle freckles, wearing breezy linen shirt and denim, golden hour sunflare, Sony A7R V, 50mm lens f/1.8, authentic candid commercial lighting', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80', 'lora_camila_duarte_v1',
  '@camiladuarte.br', 'Rio de Janeiro, Brasil', NULL, 5,
  TRUE, TRUE, FALSE, NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  category = EXCLUDED.category,
  bio = EXCLUDED.bio,
  "avatarUrl" = EXCLUDED."avatarUrl",
  "coverUrl" = EXCLUDED."coverUrl",
  gallery = EXCLUDED.gallery,
  tags = EXCLUDED.tags,
  "promptTrigger" = EXCLUDED."promptTrigger",
  "referenceFaceUrl" = EXCLUDED."referenceFaceUrl",
  "loraModelId" = EXCLUDED."loraModelId",
  "instagramHandle" = EXCLUDED."instagramHandle",
  location = EXCLUDED.location,
  "bookingPriceCents" = EXCLUDED."bookingPriceCents",
  "creditsPricePerGen" = EXCLUDED."creditsPricePerGen",
  status = EXCLUDED.status,
  "isFeatured" = EXCLUDED."isFeatured",
  "isHot18" = EXCLUDED."isHot18",
  "updatedAt" = NOW();

INSERT INTO "MarketplaceModel" (
  id, name, slug, type, category, bio, "avatarUrl", "coverUrl",
  gallery, tags, "promptTrigger", "referenceFaceUrl", "loraModelId",
  "instagramHandle", location, "bookingPriceCents", "creditsPricePerGen",
  status, "isFeatured", "isHot18", "updatedAt"
) VALUES (
  'model_yuki_tanaka', 'Yuki Tanaka', 'yuki-tanaka', 'AI'::"ModelType", 'FASHION'::"ModelCategory", 'Visual vanguardista de Tóquio. Minimalismo urbano, corte bob afiado e estética futurista para campanhas de streetwear e tecnologia.', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80',
  '{"https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80"}', '{"Streetwear","Tóquio","Cyber","Minimalista","Editorial"}', 'Tokyo streetwear editorial 8k, Yuki Tanaka, Japanese fashion model, sharp sleek black bob hair, minimalist oversized dark aesthetic trenchcoat, neon wet asphalt Shibuya reflections, Canon EOS R5, 35mm f/1.4, cinematic film tone', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80', 'lora_yuki_tanaka_v2',
  '@yuki.tanaka.tokyo', 'Tóquio, Japão', NULL, 5,
  TRUE, TRUE, FALSE, NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  category = EXCLUDED.category,
  bio = EXCLUDED.bio,
  "avatarUrl" = EXCLUDED."avatarUrl",
  "coverUrl" = EXCLUDED."coverUrl",
  gallery = EXCLUDED.gallery,
  tags = EXCLUDED.tags,
  "promptTrigger" = EXCLUDED."promptTrigger",
  "referenceFaceUrl" = EXCLUDED."referenceFaceUrl",
  "loraModelId" = EXCLUDED."loraModelId",
  "instagramHandle" = EXCLUDED."instagramHandle",
  location = EXCLUDED.location,
  "bookingPriceCents" = EXCLUDED."bookingPriceCents",
  "creditsPricePerGen" = EXCLUDED."creditsPricePerGen",
  status = EXCLUDED.status,
  "isFeatured" = EXCLUDED."isFeatured",
  "isHot18" = EXCLUDED."isHot18",
  "updatedAt" = NOW();

INSERT INTO "MarketplaceModel" (
  id, name, slug, type, category, bio, "avatarUrl", "coverUrl",
  gallery, tags, "promptTrigger", "referenceFaceUrl", "loraModelId",
  "instagramHandle", location, "bookingPriceCents", "creditsPricePerGen",
  status, "isFeatured", "isHot18", "updatedAt"
) VALUES (
  'model_zara_almansoor', 'Zara Al-Mansoor', 'zara-al-mansoor', 'AI'::"ModelType", 'FASHION'::"ModelCategory", 'A síntese do luxo do Oriente Médio. Elegância régia para campanhas de alta joalheria, vestidos de festa e perfumaria de nicho.', 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=1200&q=80',
  '{"https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=800&q=80"}', '{"Joalheria","Luxo","Dubai","Gala","Alta Moda"}', 'high jewelry luxury campaign 8k, Zara Al-Mansoor, Middle Eastern beauty, emerald jewelry necklace, captivating almond eyes, regal poise, flowing emerald green silk evening gown, softbox rim lighting, Leica SL2, 90mm f/2.0 portrait', 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=800&q=80', 'lora_zara_almansoor_v1',
  '@zara.almansoor', 'Dubai, EAU', NULL, 5,
  TRUE, FALSE, FALSE, NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  category = EXCLUDED.category,
  bio = EXCLUDED.bio,
  "avatarUrl" = EXCLUDED."avatarUrl",
  "coverUrl" = EXCLUDED."coverUrl",
  gallery = EXCLUDED.gallery,
  tags = EXCLUDED.tags,
  "promptTrigger" = EXCLUDED."promptTrigger",
  "referenceFaceUrl" = EXCLUDED."referenceFaceUrl",
  "loraModelId" = EXCLUDED."loraModelId",
  "instagramHandle" = EXCLUDED."instagramHandle",
  location = EXCLUDED.location,
  "bookingPriceCents" = EXCLUDED."bookingPriceCents",
  "creditsPricePerGen" = EXCLUDED."creditsPricePerGen",
  status = EXCLUDED.status,
  "isFeatured" = EXCLUDED."isFeatured",
  "isHot18" = EXCLUDED."isHot18",
  "updatedAt" = NOW();

INSERT INTO "MarketplaceModel" (
  id, name, slug, type, category, bio, "avatarUrl", "coverUrl",
  gallery, tags, "promptTrigger", "referenceFaceUrl", "loraModelId",
  "instagramHandle", location, "bookingPriceCents", "creditsPricePerGen",
  status, "isFeatured", "isHot18", "updatedAt"
) VALUES (
  'model_beatriz_lima', 'Beatriz Lima', 'beatriz-lima', 'AI'::"ModelType", 'FITNESS'::"ModelCategory", 'Atleta de alta performance com condicionamento impecável, energia solar e autenticidade para moda fitness e esportes ao ar livre.', 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=1200&q=80',
  '{"https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80"}', '{"Fitness","Atleta","Treino","Praia","Energia"}', 'athletic female fitness model 8k, Beatriz Lima, toned physique, natural sun-kissed skin, wearing technical athletic sportswear, coastal morning sunrise backdrop, dynamic sports photography, Nikon Z9, 70-200mm f/2.8, high shutter speed clarity', 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80', 'lora_beatriz_lima_v1',
  '@beatrizlima.fit', 'Florianópolis, Brasil', NULL, 5,
  TRUE, FALSE, FALSE, NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  category = EXCLUDED.category,
  bio = EXCLUDED.bio,
  "avatarUrl" = EXCLUDED."avatarUrl",
  "coverUrl" = EXCLUDED."coverUrl",
  gallery = EXCLUDED.gallery,
  tags = EXCLUDED.tags,
  "promptTrigger" = EXCLUDED."promptTrigger",
  "referenceFaceUrl" = EXCLUDED."referenceFaceUrl",
  "loraModelId" = EXCLUDED."loraModelId",
  "instagramHandle" = EXCLUDED."instagramHandle",
  location = EXCLUDED.location,
  "bookingPriceCents" = EXCLUDED."bookingPriceCents",
  "creditsPricePerGen" = EXCLUDED."creditsPricePerGen",
  status = EXCLUDED.status,
  "isFeatured" = EXCLUDED."isFeatured",
  "isHot18" = EXCLUDED."isHot18",
  "updatedAt" = NOW();

INSERT INTO "MarketplaceModel" (
  id, name, slug, type, category, bio, "avatarUrl", "coverUrl",
  gallery, tags, "promptTrigger", "referenceFaceUrl", "loraModelId",
  "instagramHandle", location, "bookingPriceCents", "creditsPricePerGen",
  status, "isFeatured", "isHot18", "updatedAt"
) VALUES (
  'model_sophie_laurent', 'Sophie Laurent', 'sophie-laurent', 'AI'::"ModelType", 'FASHION'::"ModelCategory", 'Delicadeza e sofisticação parisiense. Especializada em beleza clássica, maquiagem editorial e alta perfumaria europeia.', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
  '{"https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80"}', '{"Paris","Editorial","Perfume","Beleza","Haute Couture"}', 'French haute couture perfume advertisement 8k, Sophie Laurent, delicate Parisian features, effortless blonde updo, satin haute couture gown, Haussmann apartment interior, soft window natural light, Phase One IQ4 150MP, 80mm Schneider lens', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80', 'lora_sophie_laurent_v1',
  '@sophielaurent.paris', 'Paris, França', NULL, 5,
  TRUE, FALSE, FALSE, NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  category = EXCLUDED.category,
  bio = EXCLUDED.bio,
  "avatarUrl" = EXCLUDED."avatarUrl",
  "coverUrl" = EXCLUDED."coverUrl",
  gallery = EXCLUDED.gallery,
  tags = EXCLUDED.tags,
  "promptTrigger" = EXCLUDED."promptTrigger",
  "referenceFaceUrl" = EXCLUDED."referenceFaceUrl",
  "loraModelId" = EXCLUDED."loraModelId",
  "instagramHandle" = EXCLUDED."instagramHandle",
  location = EXCLUDED.location,
  "bookingPriceCents" = EXCLUDED."bookingPriceCents",
  "creditsPricePerGen" = EXCLUDED."creditsPricePerGen",
  status = EXCLUDED.status,
  "isFeatured" = EXCLUDED."isFeatured",
  "isHot18" = EXCLUDED."isHot18",
  "updatedAt" = NOW();

INSERT INTO "MarketplaceModel" (
  id, name, slug, type, category, bio, "avatarUrl", "coverUrl",
  gallery, tags, "promptTrigger", "referenceFaceUrl", "loraModelId",
  "instagramHandle", location, "bookingPriceCents", "creditsPricePerGen",
  status, "isFeatured", "isHot18", "updatedAt"
) VALUES (
  'model_aisha_bello', 'Aisha Bello', 'aisha-bello', 'AI'::"ModelType", 'COMMERCIAL'::"ModelCategory", 'Presença marcante e exuberância contemporânea. Pele retinta iluminada e porte majestoso para marcas vibrantes e campanhas globais.', 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&w=1200&q=80',
  '{"https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80"}', '{"Moda Afro","Vibrante","Comercial","Studio","Cores"}', 'vibrant contemporary commercial fashion 8k, Aisha Bello, radiant deep ebony skin, high cheekbones, wearing structured colorful tailored dress, minimalist studio cyclorama, crisp commercial beauty dish lighting, 8k hyper-detail', 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80', 'lora_aisha_bello_v1',
  '@aishabello.model', 'Lagos / São Paulo', NULL, 5,
  TRUE, TRUE, FALSE, NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  category = EXCLUDED.category,
  bio = EXCLUDED.bio,
  "avatarUrl" = EXCLUDED."avatarUrl",
  "coverUrl" = EXCLUDED."coverUrl",
  gallery = EXCLUDED.gallery,
  tags = EXCLUDED.tags,
  "promptTrigger" = EXCLUDED."promptTrigger",
  "referenceFaceUrl" = EXCLUDED."referenceFaceUrl",
  "loraModelId" = EXCLUDED."loraModelId",
  "instagramHandle" = EXCLUDED."instagramHandle",
  location = EXCLUDED.location,
  "bookingPriceCents" = EXCLUDED."bookingPriceCents",
  "creditsPricePerGen" = EXCLUDED."creditsPricePerGen",
  status = EXCLUDED.status,
  "isFeatured" = EXCLUDED."isFeatured",
  "isHot18" = EXCLUDED."isHot18",
  "updatedAt" = NOW();

INSERT INTO "MarketplaceModel" (
  id, name, slug, type, category, bio, "avatarUrl", "coverUrl",
  gallery, tags, "promptTrigger", "referenceFaceUrl", "loraModelId",
  "instagramHandle", location, "bookingPriceCents", "creditsPricePerGen",
  status, "isFeatured", "isHot18", "updatedAt"
) VALUES (
  'model_mia_chen', 'Mia Chen', 'mia-chen', 'AI'::"ModelType", 'LIFESTYLE'::"ModelCategory", 'Criadora de conteúdo moderna e cosmopolita. Estética acolhedora, café lifestyle e visual relaxado para o público jovem urbano.', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1200&q=80',
  '{"https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80"}', '{"Lifestyle","Café","Urbano","Creator","Inverno"}', 'modern urban lifestyle portrait 8k, Mia Chen, East Asian modern creator, stylish oversized knit sweater and pleated skirt, modern architectural cafe backdrop, soft morning diffused light, Fujifilm GFX 100S, 45mm lens f/2.8', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80', 'lora_mia_chen_v1',
  '@miachen.life', 'Singapura', NULL, 5,
  TRUE, FALSE, FALSE, NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  category = EXCLUDED.category,
  bio = EXCLUDED.bio,
  "avatarUrl" = EXCLUDED."avatarUrl",
  "coverUrl" = EXCLUDED."coverUrl",
  gallery = EXCLUDED.gallery,
  tags = EXCLUDED.tags,
  "promptTrigger" = EXCLUDED."promptTrigger",
  "referenceFaceUrl" = EXCLUDED."referenceFaceUrl",
  "loraModelId" = EXCLUDED."loraModelId",
  "instagramHandle" = EXCLUDED."instagramHandle",
  location = EXCLUDED.location,
  "bookingPriceCents" = EXCLUDED."bookingPriceCents",
  "creditsPricePerGen" = EXCLUDED."creditsPricePerGen",
  status = EXCLUDED.status,
  "isFeatured" = EXCLUDED."isFeatured",
  "isHot18" = EXCLUDED."isHot18",
  "updatedAt" = NOW();

INSERT INTO "MarketplaceModel" (
  id, name, slug, type, category, bio, "avatarUrl", "coverUrl",
  gallery, tags, "promptTrigger", "referenceFaceUrl", "loraModelId",
  "instagramHandle", location, "bookingPriceCents", "creditsPricePerGen",
  status, "isFeatured", "isHot18", "updatedAt"
) VALUES (
  'model_valentina_rossi', 'Valentina Rossi', 'valentina-rossi', 'AI'::"ModelType", 'LIFESTYLE'::"ModelCategory", 'Beleza solar e espírito livre do verão europeu e baiano. Perfeita para moda praia, resorts de luxo e marcas solares.', 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=80',
  '{"https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=800&q=80"}', '{"Resort","Verão","Praia","Linho","Moda Praia"}', 'summer luxury resort lookbook 8k, Valentina Rossi, tanned golden complexion, flowing white linen resort wear, turquoise ocean cliffside background, brilliant Mediterranean daylight, Canon R5, 50mm f/1.2, editorial travel vogue style', 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=800&q=80', 'lora_valentina_rossi_v1',
  '@valentinarossi.resort', 'Salvador, Brasil', NULL, 5,
  TRUE, FALSE, FALSE, NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  category = EXCLUDED.category,
  bio = EXCLUDED.bio,
  "avatarUrl" = EXCLUDED."avatarUrl",
  "coverUrl" = EXCLUDED."coverUrl",
  gallery = EXCLUDED.gallery,
  tags = EXCLUDED.tags,
  "promptTrigger" = EXCLUDED."promptTrigger",
  "referenceFaceUrl" = EXCLUDED."referenceFaceUrl",
  "loraModelId" = EXCLUDED."loraModelId",
  "instagramHandle" = EXCLUDED."instagramHandle",
  location = EXCLUDED.location,
  "bookingPriceCents" = EXCLUDED."bookingPriceCents",
  "creditsPricePerGen" = EXCLUDED."creditsPricePerGen",
  status = EXCLUDED.status,
  "isFeatured" = EXCLUDED."isFeatured",
  "isHot18" = EXCLUDED."isHot18",
  "updatedAt" = NOW();

INSERT INTO "MarketplaceModel" (
  id, name, slug, type, category, bio, "avatarUrl", "coverUrl",
  gallery, tags, "promptTrigger", "referenceFaceUrl", "loraModelId",
  "instagramHandle", location, "bookingPriceCents", "creditsPricePerGen",
  status, "isFeatured", "isHot18", "updatedAt"
) VALUES (
  'model_clara_mendes', 'Clara Mendes', 'clara-mendes', 'AI'::"ModelType", 'CORPORATE'::"ModelCategory", 'Liderança e credibilidade corporativa. Estilo executivo refinado para apresentações institucionais, fintechs e comunicação B2B.', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1200&q=80',
  '{"https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80"}', '{"Corporativo","Executiva","Liderança","B2B","Alfaiataria"}', 'modern executive portrait 8k, Clara Mendes, smart corporate leader, tailored charcoal blazer and crisp white shirt, minimalist glass glassboard fintech office, confident empowered stance, soft studio rim lighting, 85mm lens', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80', 'lora_clara_mendes_v1',
  '@claramendes.corp', 'Curitiba, Brasil', NULL, 5,
  TRUE, FALSE, FALSE, NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  category = EXCLUDED.category,
  bio = EXCLUDED.bio,
  "avatarUrl" = EXCLUDED."avatarUrl",
  "coverUrl" = EXCLUDED."coverUrl",
  gallery = EXCLUDED.gallery,
  tags = EXCLUDED.tags,
  "promptTrigger" = EXCLUDED."promptTrigger",
  "referenceFaceUrl" = EXCLUDED."referenceFaceUrl",
  "loraModelId" = EXCLUDED."loraModelId",
  "instagramHandle" = EXCLUDED."instagramHandle",
  location = EXCLUDED.location,
  "bookingPriceCents" = EXCLUDED."bookingPriceCents",
  "creditsPricePerGen" = EXCLUDED."creditsPricePerGen",
  status = EXCLUDED.status,
  "isFeatured" = EXCLUDED."isFeatured",
  "isHot18" = EXCLUDED."isHot18",
  "updatedAt" = NOW();

INSERT INTO "MarketplaceModel" (
  id, name, slug, type, category, bio, "avatarUrl", "coverUrl",
  gallery, tags, "promptTrigger", "referenceFaceUrl", "loraModelId",
  "instagramHandle", location, "bookingPriceCents", "creditsPricePerGen",
  status, "isFeatured", "isHot18", "updatedAt"
) VALUES (
  'model_matheus_becker', 'Matheus Becker', 'matheus-becker', 'AI'::"ModelType", 'FASHION'::"ModelCategory", 'Alfaiataria impecável e elegância masculina clássica. O padrão ouro para ternos sob medida, relógios suíços e editoriais masculinos.', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
  '{"https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80"}', '{"Alfaiataria","Ternos","Moda Masculina","GQ","Luxo"}', 'bespoke men tailoring 8k, Matheus Becker, sharp masculine jawline, tailored navy Italian wool three-piece suit, luxury hotel lobby setting, warm directional interior lighting, Leica M11, 50mm f/1.4 Summilux, GQ editorial cover style', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80', 'lora_matheus_becker_v1',
  '@matheusbecker.suit', 'São Paulo, Brasil', NULL, 5,
  TRUE, TRUE, FALSE, NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  category = EXCLUDED.category,
  bio = EXCLUDED.bio,
  "avatarUrl" = EXCLUDED."avatarUrl",
  "coverUrl" = EXCLUDED."coverUrl",
  gallery = EXCLUDED.gallery,
  tags = EXCLUDED.tags,
  "promptTrigger" = EXCLUDED."promptTrigger",
  "referenceFaceUrl" = EXCLUDED."referenceFaceUrl",
  "loraModelId" = EXCLUDED."loraModelId",
  "instagramHandle" = EXCLUDED."instagramHandle",
  location = EXCLUDED.location,
  "bookingPriceCents" = EXCLUDED."bookingPriceCents",
  "creditsPricePerGen" = EXCLUDED."creditsPricePerGen",
  status = EXCLUDED.status,
  "isFeatured" = EXCLUDED."isFeatured",
  "isHot18" = EXCLUDED."isHot18",
  "updatedAt" = NOW();

INSERT INTO "MarketplaceModel" (
  id, name, slug, type, category, bio, "avatarUrl", "coverUrl",
  gallery, tags, "promptTrigger", "referenceFaceUrl", "loraModelId",
  "instagramHandle", location, "bookingPriceCents", "creditsPricePerGen",
  status, "isFeatured", "isHot18", "updatedAt"
) VALUES (
  'model_liam_gallagher', 'Liam Gallagher', 'liam-gallagher', 'AI'::"ModelType", 'LIFESTYLE'::"ModelCategory", 'Visual britânico rebelde e atemporal. Jaqueta de couro vintage, bota Chelsea e presença magnética para marcas urbanas e streetwear.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=1200&q=80',
  '{"https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80"}', '{"Rock","Couro","Londres","Vintage","Urbano"}', 'raw British rock aesthetic 8k, Liam Gallagher, rugged handsome features, vintage distressed leather jacket, Chelsea boots, brick wall Shoreditch alleyway, moody overcast London lighting, Hasselblad 80mm, gritty cinema grain', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80', 'lora_liam_gallagher_v1',
  '@liamgallagher.raw', 'Londres, Reino Unido', NULL, 5,
  TRUE, FALSE, FALSE, NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  category = EXCLUDED.category,
  bio = EXCLUDED.bio,
  "avatarUrl" = EXCLUDED."avatarUrl",
  "coverUrl" = EXCLUDED."coverUrl",
  gallery = EXCLUDED.gallery,
  tags = EXCLUDED.tags,
  "promptTrigger" = EXCLUDED."promptTrigger",
  "referenceFaceUrl" = EXCLUDED."referenceFaceUrl",
  "loraModelId" = EXCLUDED."loraModelId",
  "instagramHandle" = EXCLUDED."instagramHandle",
  location = EXCLUDED.location,
  "bookingPriceCents" = EXCLUDED."bookingPriceCents",
  "creditsPricePerGen" = EXCLUDED."creditsPricePerGen",
  status = EXCLUDED.status,
  "isFeatured" = EXCLUDED."isFeatured",
  "isHot18" = EXCLUDED."isHot18",
  "updatedAt" = NOW();

INSERT INTO "MarketplaceModel" (
  id, name, slug, type, category, bio, "avatarUrl", "coverUrl",
  gallery, tags, "promptTrigger", "referenceFaceUrl", "loraModelId",
  "instagramHandle", location, "bookingPriceCents", "creditsPricePerGen",
  status, "isFeatured", "isHot18", "updatedAt"
) VALUES (
  'model_kenji_sato', 'Kenji Sato', 'kenji-sato', 'AI'::"ModelType", 'COMMERCIAL'::"ModelCategory", 'Harmonia entre arte, arquitetura e moda contemporânea. Perfil sereno e intelectual para campanhas sofisticadas e marcas de design.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1480429370139-e0132c086e2a?auto=format&fit=crop&w=1200&q=80',
  '{"https://images.unsplash.com/photo-1480429370139-e0132c086e2a?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80"}', '{"Arquitetura","Design","Tóquio","Smart Casual","Comercial"}', 'architectural smart casual commercial 8k, Kenji Sato, Japanese male model, modern horn-rimmed glasses, minimalist beige cashmere sweater, concrete brutalist gallery background, soft diffused natural daylight, 8k crisp details', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80', 'lora_kenji_sato_v1',
  '@kenjisato.design', 'Tóquio / Berlim', NULL, 5,
  TRUE, FALSE, FALSE, NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  category = EXCLUDED.category,
  bio = EXCLUDED.bio,
  "avatarUrl" = EXCLUDED."avatarUrl",
  "coverUrl" = EXCLUDED."coverUrl",
  gallery = EXCLUDED.gallery,
  tags = EXCLUDED.tags,
  "promptTrigger" = EXCLUDED."promptTrigger",
  "referenceFaceUrl" = EXCLUDED."referenceFaceUrl",
  "loraModelId" = EXCLUDED."loraModelId",
  "instagramHandle" = EXCLUDED."instagramHandle",
  location = EXCLUDED.location,
  "bookingPriceCents" = EXCLUDED."bookingPriceCents",
  "creditsPricePerGen" = EXCLUDED."creditsPricePerGen",
  status = EXCLUDED.status,
  "isFeatured" = EXCLUDED."isFeatured",
  "isHot18" = EXCLUDED."isHot18",
  "updatedAt" = NOW();

INSERT INTO "MarketplaceModel" (
  id, name, slug, type, category, bio, "avatarUrl", "coverUrl",
  gallery, tags, "promptTrigger", "referenceFaceUrl", "loraModelId",
  "instagramHandle", location, "bookingPriceCents", "creditsPricePerGen",
  status, "isFeatured", "isHot18", "updatedAt"
) VALUES (
  'model_rodrigo_paiva', 'Rodrigo Paiva', 'rodrigo-paiva', 'AI'::"ModelType", 'FITNESS'::"ModelCategory", 'Força, resistência e estética atlética pura. Especialista em campanhas esportivas intensas, crossfit, nutrição e suplementação de ponta.', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
  '{"https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80"}', '{"Crossfit","Atleta","Treino Pesado","Musculação","Sports"}', 'intense sports conditioning 8k, Rodrigo Paiva, muscular athletic build, sweat glistening under industrial gym spotlights, chalk on hands, aggressive motivated expression, high action commercial photography, Sony A1, 85mm f/1.4', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80', 'lora_rodrigo_paiva_v1',
  '@rodrigopaiva.pro', 'Belo Horizonte, Brasil', NULL, 5,
  TRUE, TRUE, FALSE, NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  category = EXCLUDED.category,
  bio = EXCLUDED.bio,
  "avatarUrl" = EXCLUDED."avatarUrl",
  "coverUrl" = EXCLUDED."coverUrl",
  gallery = EXCLUDED.gallery,
  tags = EXCLUDED.tags,
  "promptTrigger" = EXCLUDED."promptTrigger",
  "referenceFaceUrl" = EXCLUDED."referenceFaceUrl",
  "loraModelId" = EXCLUDED."loraModelId",
  "instagramHandle" = EXCLUDED."instagramHandle",
  location = EXCLUDED.location,
  "bookingPriceCents" = EXCLUDED."bookingPriceCents",
  "creditsPricePerGen" = EXCLUDED."creditsPricePerGen",
  status = EXCLUDED.status,
  "isFeatured" = EXCLUDED."isFeatured",
  "isHot18" = EXCLUDED."isHot18",
  "updatedAt" = NOW();

INSERT INTO "MarketplaceModel" (
  id, name, slug, type, category, bio, "avatarUrl", "coverUrl",
  gallery, tags, "promptTrigger", "referenceFaceUrl", "loraModelId",
  "instagramHandle", location, "bookingPriceCents", "creditsPricePerGen",
  status, "isFeatured", "isHot18", "updatedAt"
) VALUES (
  'model_julian_thorne', 'Julian Thorne', 'julian-thorne', 'AI'::"ModelType", 'CORPORATE'::"ModelCategory", 'Liderança executiva de Wall Street. Firmeza e sofisticação em ternos risca de giz para campanhas de finanças globais e tecnologia B2B.', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1200&q=80',
  '{"https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80"}', '{"Wall Street","Finanças","Fintech","Executivo","Nova York"}', 'Wall street modern financier 8k, Julian Thorne, charismatic corporate executive, charcoal pinstripe tailored suit with silk tie, high-rise glass skyscraper overlooking Manhattan skyline, golden dusk light, premium Forbes magazine cover', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80', 'lora_julian_thorne_v1',
  '@julianthorne.exec', 'Nova York, EUA', NULL, 5,
  TRUE, FALSE, FALSE, NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  category = EXCLUDED.category,
  bio = EXCLUDED.bio,
  "avatarUrl" = EXCLUDED."avatarUrl",
  "coverUrl" = EXCLUDED."coverUrl",
  gallery = EXCLUDED.gallery,
  tags = EXCLUDED.tags,
  "promptTrigger" = EXCLUDED."promptTrigger",
  "referenceFaceUrl" = EXCLUDED."referenceFaceUrl",
  "loraModelId" = EXCLUDED."loraModelId",
  "instagramHandle" = EXCLUDED."instagramHandle",
  location = EXCLUDED.location,
  "bookingPriceCents" = EXCLUDED."bookingPriceCents",
  "creditsPricePerGen" = EXCLUDED."creditsPricePerGen",
  status = EXCLUDED.status,
  "isFeatured" = EXCLUDED."isFeatured",
  "isHot18" = EXCLUDED."isHot18",
  "updatedAt" = NOW();

INSERT INTO "MarketplaceModel" (
  id, name, slug, type, category, bio, "avatarUrl", "coverUrl",
  gallery, tags, "promptTrigger", "referenceFaceUrl", "loraModelId",
  "instagramHandle", location, "bookingPriceCents", "creditsPricePerGen",
  status, "isFeatured", "isHot18", "updatedAt"
) VALUES (
  'model_kofi_mensah', 'Kofi Mensah', 'kofi-mensah', 'AI'::"ModelType", 'FASHION'::"ModelCategory", 'Porte régio e traços esculturais. Vanguarda da alta costura masculina contemporânea em casacos arquitetônicos e cores marcantes.', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=1200&q=80',
  '{"https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80"}', '{"Alta Costura","Vogue","Londres","Cores","Escultural"}', 'avant-garde luxury menswear 8k, Kofi Mensah, statuesque West African male model, sculptured features, wearing royal cobalt blue tailored coat with bold architectural lapels, minimalist white cyclorama, studio strobe rim light, Vogue Hommes cover', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80', 'lora_kofi_mensah_v1',
  '@kofimensah.vogue', 'Londres / Paris', NULL, 5,
  TRUE, TRUE, FALSE, NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  category = EXCLUDED.category,
  bio = EXCLUDED.bio,
  "avatarUrl" = EXCLUDED."avatarUrl",
  "coverUrl" = EXCLUDED."coverUrl",
  gallery = EXCLUDED.gallery,
  tags = EXCLUDED.tags,
  "promptTrigger" = EXCLUDED."promptTrigger",
  "referenceFaceUrl" = EXCLUDED."referenceFaceUrl",
  "loraModelId" = EXCLUDED."loraModelId",
  "instagramHandle" = EXCLUDED."instagramHandle",
  location = EXCLUDED.location,
  "bookingPriceCents" = EXCLUDED."bookingPriceCents",
  "creditsPricePerGen" = EXCLUDED."creditsPricePerGen",
  status = EXCLUDED.status,
  "isFeatured" = EXCLUDED."isFeatured",
  "isHot18" = EXCLUDED."isHot18",
  "updatedAt" = NOW();

INSERT INTO "MarketplaceModel" (
  id, name, slug, type, category, bio, "avatarUrl", "coverUrl",
  gallery, tags, "promptTrigger", "referenceFaceUrl", "loraModelId",
  "instagramHandle", location, "bookingPriceCents", "creditsPricePerGen",
  status, "isFeatured", "isHot18", "updatedAt"
) VALUES (
  'model_diego_morales', 'Diego Morales', 'diego-morales', 'AI'::"ModelType", 'LIFESTYLE'::"ModelCategory", 'O charme descomplicado do litoral sul-americano. Camisas de linho, dunas de areia branca e estilo resort para marcas de praia elegantes.', 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1495366691023-cc4eadcc2d7e?auto=format&fit=crop&w=1200&q=80',
  '{"https://images.unsplash.com/photo-1495366691023-cc4eadcc2d7e?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80"}', '{"Resort","Linho","Verão","Praia","Natural"}', 'relaxed summer coastal editorial 8k, Diego Morales, sun-bronzed skin, wavy dark hair, untucked light linen shirt, walking on white sand dunes, ocean breeze, soft warm afternoon light, Leica Q2, 28mm f/1.7, authentic lifestyle elegance', 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80', 'lora_diego_morales_v1',
  '@diegomorales.resort', 'Florianópolis, Brasil', NULL, 5,
  TRUE, FALSE, FALSE, NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  category = EXCLUDED.category,
  bio = EXCLUDED.bio,
  "avatarUrl" = EXCLUDED."avatarUrl",
  "coverUrl" = EXCLUDED."coverUrl",
  gallery = EXCLUDED.gallery,
  tags = EXCLUDED.tags,
  "promptTrigger" = EXCLUDED."promptTrigger",
  "referenceFaceUrl" = EXCLUDED."referenceFaceUrl",
  "loraModelId" = EXCLUDED."loraModelId",
  "instagramHandle" = EXCLUDED."instagramHandle",
  location = EXCLUDED.location,
  "bookingPriceCents" = EXCLUDED."bookingPriceCents",
  "creditsPricePerGen" = EXCLUDED."creditsPricePerGen",
  status = EXCLUDED.status,
  "isFeatured" = EXCLUDED."isFeatured",
  "isHot18" = EXCLUDED."isHot18",
  "updatedAt" = NOW();

INSERT INTO "MarketplaceModel" (
  id, name, slug, type, category, bio, "avatarUrl", "coverUrl",
  gallery, tags, "promptTrigger", "referenceFaceUrl", "loraModelId",
  "instagramHandle", location, "bookingPriceCents", "creditsPricePerGen",
  status, "isFeatured", "isHot18", "updatedAt"
) VALUES (
  'model_alexandre_dumas', 'Alexandre Dumas', 'alexandre-dumas', 'AI'::"ModelType", 'FASHION'::"ModelCategory", 'Glamour noturno, smoking de veludo e mistério aristocrático europeu. Especializado em campanhas de perfumes e noites de gala.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=1200&q=80',
  '{"https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80"}', '{"Smoking","Noite","Gala","Perfumaria","Aristocrático"}', 'luxury cologne campaign 8k, Alexandre Dumas, refined European features, piercing dark eyes, midnight black velvet tuxedo jacket, crystal whiskey glass in hand, luxury penthouse bar at night, dramatic chiaroscuro lighting, 8k master quality', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80', 'lora_alexandre_dumas_v1',
  '@alexandredumas.noir', 'Genebra, Suíça', NULL, 5,
  TRUE, FALSE, FALSE, NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  category = EXCLUDED.category,
  bio = EXCLUDED.bio,
  "avatarUrl" = EXCLUDED."avatarUrl",
  "coverUrl" = EXCLUDED."coverUrl",
  gallery = EXCLUDED.gallery,
  tags = EXCLUDED.tags,
  "promptTrigger" = EXCLUDED."promptTrigger",
  "referenceFaceUrl" = EXCLUDED."referenceFaceUrl",
  "loraModelId" = EXCLUDED."loraModelId",
  "instagramHandle" = EXCLUDED."instagramHandle",
  location = EXCLUDED.location,
  "bookingPriceCents" = EXCLUDED."bookingPriceCents",
  "creditsPricePerGen" = EXCLUDED."creditsPricePerGen",
  status = EXCLUDED.status,
  "isFeatured" = EXCLUDED."isFeatured",
  "isHot18" = EXCLUDED."isHot18",
  "updatedAt" = NOW();

INSERT INTO "MarketplaceModel" (
  id, name, slug, type, category, bio, "avatarUrl", "coverUrl",
  gallery, tags, "promptTrigger", "referenceFaceUrl", "loraModelId",
  "instagramHandle", location, "bookingPriceCents", "creditsPricePerGen",
  status, "isFeatured", "isHot18", "updatedAt"
) VALUES (
  'model_thiago_rocha', 'Thiago Rocha', 'thiago-rocha', 'AI'::"ModelType", 'LIFESTYLE'::"ModelCategory", 'Explorador e aventureiro das montanhas. Roupa técnica, jaqueta impermeável encerada e autenticidade para marcas de aventura e 4x4.', 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=1200&q=80',
  '{"https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=800&q=80"}', '{"Aventura","Outdoor","Montanha","Expedição","Natureza"}', 'outdoor wilderness expedition 8k, Thiago Rocha, rugged adventurer, short trimmed beard, heavy-duty waxed canvas jacket, alpine mountain trail summit, misty dramatic mountain peaks, natural morning mist and god rays, Canon 1D X Mark III', 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=800&q=80', 'lora_thiago_rocha_v1',
  '@thiagorocha.wild', 'Chapada Diamantina, Brasil', NULL, 5,
  TRUE, FALSE, FALSE, NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  category = EXCLUDED.category,
  bio = EXCLUDED.bio,
  "avatarUrl" = EXCLUDED."avatarUrl",
  "coverUrl" = EXCLUDED."coverUrl",
  gallery = EXCLUDED.gallery,
  tags = EXCLUDED.tags,
  "promptTrigger" = EXCLUDED."promptTrigger",
  "referenceFaceUrl" = EXCLUDED."referenceFaceUrl",
  "loraModelId" = EXCLUDED."loraModelId",
  "instagramHandle" = EXCLUDED."instagramHandle",
  location = EXCLUDED.location,
  "bookingPriceCents" = EXCLUDED."bookingPriceCents",
  "creditsPricePerGen" = EXCLUDED."creditsPricePerGen",
  status = EXCLUDED.status,
  "isFeatured" = EXCLUDED."isFeatured",
  "isHot18" = EXCLUDED."isHot18",
  "updatedAt" = NOW();

INSERT INTO "MarketplaceModel" (
  id, name, slug, type, category, bio, "avatarUrl", "coverUrl",
  gallery, tags, "promptTrigger", "referenceFaceUrl", "loraModelId",
  "instagramHandle", location, "bookingPriceCents", "creditsPricePerGen",
  status, "isFeatured", "isHot18", "updatedAt"
) VALUES (
  'model_marcus_sterling', 'Marcus Sterling', 'marcus-sterling', 'AI'::"ModelType", 'CORPORATE'::"ModelCategory", 'Conselheiro de grandes patrimônios e finanças privadas. Estética imponente para family offices, bancos suíços e advocacia corporativa.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
  '{"https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80"}', '{"Private Banking","Family Office","Advocacia","Corporativo","Ternos"}', 'elite private wealth advisor 8k, Marcus Sterling, distinguished corporate presence, crisp tailored dark navy bespoke suit, luxurious library boardroom with dark mahogany and leather books, warm incandescent lamps, 85mm f/1.4 portrait', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80', 'lora_marcus_sterling_v1',
  '@marcus.sterling.ai', 'Milão / Londres', NULL, 5,
  TRUE, FALSE, FALSE, NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  category = EXCLUDED.category,
  bio = EXCLUDED.bio,
  "avatarUrl" = EXCLUDED."avatarUrl",
  "coverUrl" = EXCLUDED."coverUrl",
  gallery = EXCLUDED.gallery,
  tags = EXCLUDED.tags,
  "promptTrigger" = EXCLUDED."promptTrigger",
  "referenceFaceUrl" = EXCLUDED."referenceFaceUrl",
  "loraModelId" = EXCLUDED."loraModelId",
  "instagramHandle" = EXCLUDED."instagramHandle",
  location = EXCLUDED.location,
  "bookingPriceCents" = EXCLUDED."bookingPriceCents",
  "creditsPricePerGen" = EXCLUDED."creditsPricePerGen",
  status = EXCLUDED.status,
  "isFeatured" = EXCLUDED."isFeatured",
  "isHot18" = EXCLUDED."isHot18",
  "updatedAt" = NOW();

INSERT INTO "MarketplaceModel" (
  id, name, slug, type, category, bio, "avatarUrl", "coverUrl",
  gallery, tags, "promptTrigger", "referenceFaceUrl", "loraModelId",
  "instagramHandle", location, "bookingPriceCents", "creditsPricePerGen",
  status, "isFeatured", "isHot18", "updatedAt"
) VALUES (
  'model_helena_vasconcelos', 'Dona Helena Vasconcelos', 'helena-vasconcelos', 'AI'::"ModelType", 'FASHION'::"ModelCategory", '65 anos. A consagração da elegância madura. Cabelos prateados reluzentes e alfaiataria em linho claro para moda atemporal e marcas consagradas.', 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=1200&q=80',
  '{"https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=800&q=80"}', '{"60+","Sênior","Cabelo Prateado","Elegância","Atemporal"}', 'sophisticated 65-year-old senior Brazilian woman 8k, Dona Helena Vasconcelos, graceful natural silver hair, elegant expressive smile, authentic mature skin texture with dignity, wearing tailored cream linen pantsuit, sunlit art gallery backdrop, soft warm daylight, Hasselblad portrait 85mm', 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=800&q=80', 'lora_helena_vasconcelos_v1',
  '@helena.vasconcelos.elegance', 'São Paulo, Brasil', NULL, 5,
  TRUE, TRUE, FALSE, NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  category = EXCLUDED.category,
  bio = EXCLUDED.bio,
  "avatarUrl" = EXCLUDED."avatarUrl",
  "coverUrl" = EXCLUDED."coverUrl",
  gallery = EXCLUDED.gallery,
  tags = EXCLUDED.tags,
  "promptTrigger" = EXCLUDED."promptTrigger",
  "referenceFaceUrl" = EXCLUDED."referenceFaceUrl",
  "loraModelId" = EXCLUDED."loraModelId",
  "instagramHandle" = EXCLUDED."instagramHandle",
  location = EXCLUDED.location,
  "bookingPriceCents" = EXCLUDED."bookingPriceCents",
  "creditsPricePerGen" = EXCLUDED."creditsPricePerGen",
  status = EXCLUDED.status,
  "isFeatured" = EXCLUDED."isFeatured",
  "isHot18" = EXCLUDED."isHot18",
  "updatedAt" = NOW();

INSERT INTO "MarketplaceModel" (
  id, name, slug, type, category, bio, "avatarUrl", "coverUrl",
  gallery, tags, "promptTrigger", "referenceFaceUrl", "loraModelId",
  "instagramHandle", location, "bookingPriceCents", "creditsPricePerGen",
  status, "isFeatured", "isHot18", "updatedAt"
) VALUES (
  'model_beatrix_von_berg', 'Beatrix Von Berg', 'beatrix-von-berg', 'AI'::"ModelType", 'FASHION'::"ModelCategory", '68 anos. Aristocracia austríaca, colar de pérolas e casaco de cashmere azul marinho. Destaque em campanhas de alta joalheria ageless.', 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
  '{"https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=800&q=80"}', '{"60+","Viena","Haute Couture","Joias","Ageless"}', 'high jewelry senior model campaign 8k, Beatrix Von Berg, 68 years old, striking silver platinum coiffure, dignified poise, wearing royal navy cashmere coat and pearl choker, historic Viennese grand hall, soft directional studio light, Vogue Ageless cover style', 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=800&q=80', 'lora_beatrix_vonberg_v1',
  '@beatrix.vonberg', 'Viena, Áustria', NULL, 5,
  TRUE, TRUE, FALSE, NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  category = EXCLUDED.category,
  bio = EXCLUDED.bio,
  "avatarUrl" = EXCLUDED."avatarUrl",
  "coverUrl" = EXCLUDED."coverUrl",
  gallery = EXCLUDED.gallery,
  tags = EXCLUDED.tags,
  "promptTrigger" = EXCLUDED."promptTrigger",
  "referenceFaceUrl" = EXCLUDED."referenceFaceUrl",
  "loraModelId" = EXCLUDED."loraModelId",
  "instagramHandle" = EXCLUDED."instagramHandle",
  location = EXCLUDED.location,
  "bookingPriceCents" = EXCLUDED."bookingPriceCents",
  "creditsPricePerGen" = EXCLUDED."creditsPricePerGen",
  status = EXCLUDED.status,
  "isFeatured" = EXCLUDED."isFeatured",
  "isHot18" = EXCLUDED."isHot18",
  "updatedAt" = NOW();

INSERT INTO "MarketplaceModel" (
  id, name, slug, type, category, bio, "avatarUrl", "coverUrl",
  gallery, tags, "promptTrigger", "referenceFaceUrl", "loraModelId",
  "instagramHandle", location, "bookingPriceCents", "creditsPricePerGen",
  status, "isFeatured", "isHot18", "updatedAt"
) VALUES (
  'model_carmen_almodovar', 'Carmen Almodóvar', 'carmen-almodovar', 'AI'::"ModelType", 'LIFESTYLE'::"ModelCategory", '62 anos. Alma artística e boêmia mediterrânea. Ceramista e artista plástica de Barcelona, perfeita para marcas artesanais e turismo cultural.', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80',
  '{"https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80"}', '{"60+","Artesã","Boêmia","Barcelona","Criativa"}', 'bohemian artistic senior woman 8k, Carmen Almodóvar, 62 years old, Spanish ceramicist and artist, bold terracotta statement necklace, colorful flowing linen artisan smock, sun-drenched Mediterranean pottery atelier, warm clay textures, cinematic natural window light', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80', 'lora_carmen_almodovar_v1',
  '@carmen.almodovar.arte', 'Barcelona, Espanha', NULL, 5,
  TRUE, FALSE, FALSE, NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  category = EXCLUDED.category,
  bio = EXCLUDED.bio,
  "avatarUrl" = EXCLUDED."avatarUrl",
  "coverUrl" = EXCLUDED."coverUrl",
  gallery = EXCLUDED.gallery,
  tags = EXCLUDED.tags,
  "promptTrigger" = EXCLUDED."promptTrigger",
  "referenceFaceUrl" = EXCLUDED."referenceFaceUrl",
  "loraModelId" = EXCLUDED."loraModelId",
  "instagramHandle" = EXCLUDED."instagramHandle",
  location = EXCLUDED.location,
  "bookingPriceCents" = EXCLUDED."bookingPriceCents",
  "creditsPricePerGen" = EXCLUDED."creditsPricePerGen",
  status = EXCLUDED.status,
  "isFeatured" = EXCLUDED."isFeatured",
  "isHot18" = EXCLUDED."isHot18",
  "updatedAt" = NOW();

INSERT INTO "MarketplaceModel" (
  id, name, slug, type, category, bio, "avatarUrl", "coverUrl",
  gallery, tags, "promptTrigger", "referenceFaceUrl", "loraModelId",
  "instagramHandle", location, "bookingPriceCents", "creditsPricePerGen",
  status, "isFeatured", "isHot18", "updatedAt"
) VALUES (
  'model_soraia_guimaraes', 'Soraia Guimarães', 'soraia-guimaraes', 'AI'::"ModelType", 'COMMERCIAL'::"ModelCategory", '64 anos. A referência do envelhecimento ativo e saudável. Sorriso contagiante para cosméticos pro-aging, planos de saúde e marcas de bem-estar.', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80',
  '{"https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80"}', '{"60+","Skincare Madura","Pro-Aging","Saúde","Bem-Estar"}', 'pro-aging skincare commercial 8k, Soraia Guimarães, 64 years old, radiant dewy mature skin, joyful sparkling eyes, wearing breathable white athletic top, botanical garden veranda, soft morning rim glow, clean commercial beauty style, Sony A7R IV', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80', 'lora_soraia_guimaraes_v1',
  '@soraia.guimaraes.vida', 'Rio de Janeiro, Brasil', NULL, 5,
  TRUE, TRUE, FALSE, NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  category = EXCLUDED.category,
  bio = EXCLUDED.bio,
  "avatarUrl" = EXCLUDED."avatarUrl",
  "coverUrl" = EXCLUDED."coverUrl",
  gallery = EXCLUDED.gallery,
  tags = EXCLUDED.tags,
  "promptTrigger" = EXCLUDED."promptTrigger",
  "referenceFaceUrl" = EXCLUDED."referenceFaceUrl",
  "loraModelId" = EXCLUDED."loraModelId",
  "instagramHandle" = EXCLUDED."instagramHandle",
  location = EXCLUDED.location,
  "bookingPriceCents" = EXCLUDED."bookingPriceCents",
  "creditsPricePerGen" = EXCLUDED."creditsPricePerGen",
  status = EXCLUDED.status,
  "isFeatured" = EXCLUDED."isFeatured",
  "isHot18" = EXCLUDED."isHot18",
  "updatedAt" = NOW();

INSERT INTO "MarketplaceModel" (
  id, name, slug, type, category, bio, "avatarUrl", "coverUrl",
  gallery, tags, "promptTrigger", "referenceFaceUrl", "loraModelId",
  "instagramHandle", location, "bookingPriceCents", "creditsPricePerGen",
  status, "isFeatured", "isHot18", "updatedAt"
) VALUES (
  'model_evelyn_montgomery', 'Evelyn Montgomery', 'evelyn-montgomery', 'AI'::"ModelType", 'CORPORATE'::"ModelCategory", '71 anos. Presidente de conselho e filantropa internacional. Respeito, solidez e autoridade inquestionável para grandes instituições e governança.', 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1200&q=80',
  '{"https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=800&q=80"}', '{"70+","Conselheira","Governança","Corporativo","Liderança"}', 'distinguished senior executive board chair 8k, Evelyn Montgomery, 71 years old, sharp intellect, styled silver bob, custom midnight blue velvet blazer, university boardroom with grand architectural windows, commanding trustworthy aura, 8k crisp details', 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=800&q=80', 'lora_evelyn_montgomery_v1',
  '@evelyn.montgomery.lead', 'Boston, EUA', NULL, 5,
  TRUE, FALSE, FALSE, NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  category = EXCLUDED.category,
  bio = EXCLUDED.bio,
  "avatarUrl" = EXCLUDED."avatarUrl",
  "coverUrl" = EXCLUDED."coverUrl",
  gallery = EXCLUDED.gallery,
  tags = EXCLUDED.tags,
  "promptTrigger" = EXCLUDED."promptTrigger",
  "referenceFaceUrl" = EXCLUDED."referenceFaceUrl",
  "loraModelId" = EXCLUDED."loraModelId",
  "instagramHandle" = EXCLUDED."instagramHandle",
  location = EXCLUDED.location,
  "bookingPriceCents" = EXCLUDED."bookingPriceCents",
  "creditsPricePerGen" = EXCLUDED."creditsPricePerGen",
  status = EXCLUDED.status,
  "isFeatured" = EXCLUDED."isFeatured",
  "isHot18" = EXCLUDED."isHot18",
  "updatedAt" = NOW();

INSERT INTO "MarketplaceModel" (
  id, name, slug, type, category, bio, "avatarUrl", "coverUrl",
  gallery, tags, "promptTrigger", "referenceFaceUrl", "loraModelId",
  "instagramHandle", location, "bookingPriceCents", "creditsPricePerGen",
  status, "isFeatured", "isHot18", "updatedAt"
) VALUES (
  'model_alvaro_prado', 'Dr. Álvaro Prado', 'alvaro-prado', 'AI'::"ModelType", 'CORPORATE'::"ModelCategory", '66 anos. O cavalheiro intelectual. Barba grisalha aparada, paletó de tweed com colete e relógio de bolso para medicina, advocacia e alta cultura.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
  '{"https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80"}', '{"60+","Tweed","Intelectual","Médico","Advogado"}', 'distinguished senior gentleman 8k, Dr. Álvaro Prado, 66 years old, trimmed salt-and-pepper full beard, tailored brown herringbone tweed suit with vest, vintage Swiss wristwatch, classic intellectual study room, soft amber library light, Leica SL2 75mm f/2', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80', 'lora_alvaro_prado_v1',
  '@dr.alvaroprado', 'Porto Alegre, Brasil', NULL, 5,
  TRUE, TRUE, FALSE, NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  category = EXCLUDED.category,
  bio = EXCLUDED.bio,
  "avatarUrl" = EXCLUDED."avatarUrl",
  "coverUrl" = EXCLUDED."coverUrl",
  gallery = EXCLUDED.gallery,
  tags = EXCLUDED.tags,
  "promptTrigger" = EXCLUDED."promptTrigger",
  "referenceFaceUrl" = EXCLUDED."referenceFaceUrl",
  "loraModelId" = EXCLUDED."loraModelId",
  "instagramHandle" = EXCLUDED."instagramHandle",
  location = EXCLUDED.location,
  "bookingPriceCents" = EXCLUDED."bookingPriceCents",
  "creditsPricePerGen" = EXCLUDED."creditsPricePerGen",
  status = EXCLUDED.status,
  "isFeatured" = EXCLUDED."isFeatured",
  "isHot18" = EXCLUDED."isHot18",
  "updatedAt" = NOW();

INSERT INTO "MarketplaceModel" (
  id, name, slug, type, category, bio, "avatarUrl", "coverUrl",
  gallery, tags, "promptTrigger", "referenceFaceUrl", "loraModelId",
  "instagramHandle", location, "bookingPriceCents", "creditsPricePerGen",
  status, "isFeatured", "isHot18", "updatedAt"
) VALUES (
  'model_arthur_kingsley', 'Arthur Kingsley', 'arthur-kingsley', 'AI'::"ModelType", 'FASHION'::"ModelCategory", '70 anos. O lorde escocês de Mayfair. Sobretudo de lã de cashmere cinza chumbo, charuto e clube privado britânico para marcas de prestígio centenário.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1200&q=80',
  '{"https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80"}', '{"70+","Gentleman","Savile Row","Mayfair","Whisky"}', 'Savile Row senior luxury tailoring 8k, Arthur Kingsley, 70 years old, aristocratic English gentleman, bespoke double-breasted charcoal overcoat, silk pocket square, historic club room in Mayfair, polished mahogany reflections, cinematic chiaroscuro', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80', 'lora_arthur_kingsley_v1',
  '@arthurkingsley.gent', 'Edimburgo / Londres', NULL, 5,
  TRUE, TRUE, FALSE, NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  category = EXCLUDED.category,
  bio = EXCLUDED.bio,
  "avatarUrl" = EXCLUDED."avatarUrl",
  "coverUrl" = EXCLUDED."coverUrl",
  gallery = EXCLUDED.gallery,
  tags = EXCLUDED.tags,
  "promptTrigger" = EXCLUDED."promptTrigger",
  "referenceFaceUrl" = EXCLUDED."referenceFaceUrl",
  "loraModelId" = EXCLUDED."loraModelId",
  "instagramHandle" = EXCLUDED."instagramHandle",
  location = EXCLUDED.location,
  "bookingPriceCents" = EXCLUDED."bookingPriceCents",
  "creditsPricePerGen" = EXCLUDED."creditsPricePerGen",
  status = EXCLUDED.status,
  "isFeatured" = EXCLUDED."isFeatured",
  "isHot18" = EXCLUDED."isHot18",
  "updatedAt" = NOW();

INSERT INTO "MarketplaceModel" (
  id, name, slug, type, category, bio, "avatarUrl", "coverUrl",
  gallery, tags, "promptTrigger", "referenceFaceUrl", "loraModelId",
  "instagramHandle", location, "bookingPriceCents", "creditsPricePerGen",
  status, "isFeatured", "isHot18", "updatedAt"
) VALUES (
  'model_helio_taniguchi', 'Hélio Taniguchi', 'helio-taniguchi', 'AI'::"ModelType", 'COMMERCIAL'::"ModelCategory", '65 anos. Mestre da arquitetura sustentável nipo-brasileira. Óculos redondos de titânio, jaqueta noragi escura e serenidade zen.', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1480429370139-e0132c086e2a?auto=format&fit=crop&w=1200&q=80',
  '{"https://images.unsplash.com/photo-1480429370139-e0132c086e2a?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80"}', '{"60+","Arquiteto","Zen","Minimalismo","Design Japonês"}', 'senior Japanese architect master 8k, Hélio Taniguchi, 65 years old, round titanium designer glasses, pure white hair, dark indigo minimalist noragi jacket, modern wooden minimalist pavilion, zen garden background, diffuse overcast daylight, Monocle magazine feature', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80', 'lora_helio_taniguchi_v1',
  '@helio.taniguchi.arch', 'Curitiba, Brasil', NULL, 5,
  TRUE, FALSE, FALSE, NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  category = EXCLUDED.category,
  bio = EXCLUDED.bio,
  "avatarUrl" = EXCLUDED."avatarUrl",
  "coverUrl" = EXCLUDED."coverUrl",
  gallery = EXCLUDED.gallery,
  tags = EXCLUDED.tags,
  "promptTrigger" = EXCLUDED."promptTrigger",
  "referenceFaceUrl" = EXCLUDED."referenceFaceUrl",
  "loraModelId" = EXCLUDED."loraModelId",
  "instagramHandle" = EXCLUDED."instagramHandle",
  location = EXCLUDED.location,
  "bookingPriceCents" = EXCLUDED."bookingPriceCents",
  "creditsPricePerGen" = EXCLUDED."creditsPricePerGen",
  status = EXCLUDED.status,
  "isFeatured" = EXCLUDED."isFeatured",
  "isHot18" = EXCLUDED."isHot18",
  "updatedAt" = NOW();

INSERT INTO "MarketplaceModel" (
  id, name, slug, type, category, bio, "avatarUrl", "coverUrl",
  gallery, tags, "promptTrigger", "referenceFaceUrl", "loraModelId",
  "instagramHandle", location, "bookingPriceCents", "creditsPricePerGen",
  status, "isFeatured", "isHot18", "updatedAt"
) VALUES (
  'model_cadu_fontes', 'Carlos Eduardo Fontes (Cadu)', 'cadu-fontes', 'AI'::"ModelType", 'LIFESTYLE'::"ModelCategory", '63 anos. Velejador experiente, cabelos prateados ao vento e pele curtida pelo sol do mar. O lifestyle náutico definitivo para marcas oceânicas.', 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1495366691023-cc4eadcc2d7e?auto=format&fit=crop&w=1200&q=80',
  '{"https://images.unsplash.com/photo-1495366691023-cc4eadcc2d7e?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80"}', '{"60+","Velejador","Náutico","Barco","Mar"}', 'nautical lifestyle senior sailor 8k, Carlos Eduardo Fontes, 63 years old, weathered tanned skin, windblown silver hair, navy windbreaker and white deck shorts, standing at the helm of classic sailboat, sparkling ocean waves, golden sunset backlight, Nikon Z9 85mm', 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80', 'lora_cadu_fontes_v1',
  '@cadu.velejador', 'Ilhabela, Brasil', NULL, 5,
  TRUE, FALSE, FALSE, NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  category = EXCLUDED.category,
  bio = EXCLUDED.bio,
  "avatarUrl" = EXCLUDED."avatarUrl",
  "coverUrl" = EXCLUDED."coverUrl",
  gallery = EXCLUDED.gallery,
  tags = EXCLUDED.tags,
  "promptTrigger" = EXCLUDED."promptTrigger",
  "referenceFaceUrl" = EXCLUDED."referenceFaceUrl",
  "loraModelId" = EXCLUDED."loraModelId",
  "instagramHandle" = EXCLUDED."instagramHandle",
  location = EXCLUDED.location,
  "bookingPriceCents" = EXCLUDED."bookingPriceCents",
  "creditsPricePerGen" = EXCLUDED."creditsPricePerGen",
  status = EXCLUDED.status,
  "isFeatured" = EXCLUDED."isFeatured",
  "isHot18" = EXCLUDED."isHot18",
  "updatedAt" = NOW();

INSERT INTO "MarketplaceModel" (
  id, name, slug, type, category, bio, "avatarUrl", "coverUrl",
  gallery, tags, "promptTrigger", "referenceFaceUrl", "loraModelId",
  "instagramHandle", location, "bookingPriceCents", "creditsPricePerGen",
  status, "isFeatured", "isHot18", "updatedAt"
) VALUES (
  'model_giancarlo_moretti', 'Giancarlo Moretti', 'giancarlo-moretti', 'AI'::"ModelType", 'FASHION'::"ModelCategory", '67 anos. Mestre alfaiate de Florença. Bigode prateado perfeito, fita métrica no pescoço e colete de lã riscado feito à mão para marcas artesanais de elite.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=1200&q=80',
  '{"https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80"}', '{"60+","Mestre Alfaiate","Florença","Sartorial","Artesanal"}', 'Florentine master tailor 8k, Giancarlo Moretti, 67 years old, immaculate silver mustache, tape measure around neck, handmade chalk-striped wool waistcoat, artisan tailoring workshop in Florence, rolls of cashmere fabric, warm vintage European daylight, 8k hyper-detail', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80', 'lora_giancarlo_moretti_v1',
  '@giancarlo.moretti.sarto', 'Florença, Itália', NULL, 5,
  TRUE, TRUE, FALSE, NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  category = EXCLUDED.category,
  bio = EXCLUDED.bio,
  "avatarUrl" = EXCLUDED."avatarUrl",
  "coverUrl" = EXCLUDED."coverUrl",
  gallery = EXCLUDED.gallery,
  tags = EXCLUDED.tags,
  "promptTrigger" = EXCLUDED."promptTrigger",
  "referenceFaceUrl" = EXCLUDED."referenceFaceUrl",
  "loraModelId" = EXCLUDED."loraModelId",
  "instagramHandle" = EXCLUDED."instagramHandle",
  location = EXCLUDED.location,
  "bookingPriceCents" = EXCLUDED."bookingPriceCents",
  "creditsPricePerGen" = EXCLUDED."creditsPricePerGen",
  status = EXCLUDED.status,
  "isFeatured" = EXCLUDED."isFeatured",
  "isHot18" = EXCLUDED."isHot18",
  "updatedAt" = NOW();
COMMIT;
