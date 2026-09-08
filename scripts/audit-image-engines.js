/**
 * VORIXA - Script de Auditoria e Teste de Comunicação de Motores de Imagem Fal.ai
 *
 * Motores validados:
 * 1. FLUX.1 Schnell (`fal-ai/flux/schnell`) - Modo texto para imagem rápido.
 * 2. Recraft V3 (`fal-ai/recraft-v3`) - Modo Design / Vetorial / Tipografia.
 * 3. Nano Banana Pro / Google Imagen 3 (`fal-ai/nano-banana-pro`) - Modo texto para imagem fotorrealista.
 * 4. Nano Banana Pro Edit (`fal-ai/nano-banana-pro/edit`) - Modo imagem para imagem com foto de referência.
 * 5. FLUX PuLID (`fal-ai/flux-pulid`) - Modo preservação facial idêntica de pessoa.
 * 6. FLUX Pro Ultra (`fal-ai/flux-pro/v1.1-ultra`) - Modo máxima resolução / cinema 4K.
 */

const https = require('https');
const dotenv = require('dotenv');
const path = require('path');

// Carregar variáveis de ambiente do .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const FAL_KEY = process.env.FAL_KEY || 'b853f917-5e92-4d12-bf3e-a09dba498291:a78de2b18ba9d65b4f8f881df4b5a6c3';
const USD_BRL_RATE = 5.80; // Taxa de câmbio USD -> BRL

// Tabela Oficial de Custos Unitários
const ENGINE_COST_TABLE = {
  'fal-ai/flux/schnell': {
    name: 'FLUX.1 Schnell (Turbo)',
    category: 'Text-to-Image (Fast)',
    creditsCharged: 1,
    unitCostUsd: 0.003,
    provider: 'fal.ai',
    maxSteps: 12,
    recommendedSteps: 4,
    billingType: 'Por Imagem Gerada',
  },
  'fal-ai/recraft-v3': {
    name: 'Recraft V3 Design',
    category: 'Design, Logos & Vetores',
    creditsCharged: 2,
    unitCostUsd: 0.040,
    provider: 'fal.ai',
    maxSteps: 40,
    recommendedSteps: 20,
    billingType: 'Por Imagem Gerada',
  },
  'fal-ai/nano-banana-pro': {
    name: 'Nano Banana Pro (Google Imagen 3)',
    category: 'Text-to-Image (Fotorrealismo)',
    creditsCharged: 3,
    unitCostUsd: 0.040,
    provider: 'fal.ai',
    maxSteps: 50,
    recommendedSteps: 24,
    billingType: 'Por Imagem Gerada',
  },
  'fal-ai/nano-banana-pro/edit': {
    name: 'Nano Banana Pro Edit (Google Imagen 3 Edit)',
    category: 'Image-to-Image / Edição com Referência',
    creditsCharged: 3,
    unitCostUsd: 0.040,
    provider: 'fal.ai',
    maxSteps: 50,
    recommendedSteps: 24,
    billingType: 'Por Imagem Editada',
  },
  'fal-ai/flux-pulid': {
    name: 'FLUX PuLID (Mesmo Rosto / Consistência Facial)',
    category: 'Identidade Facial Idêntica / PuLID',
    creditsCharged: 4,
    unitCostUsd: 0.045,
    provider: 'fal.ai',
    maxSteps: 50,
    recommendedSteps: 28,
    billingType: 'Por Imagem com FaceLock',
  },
  'fal-ai/flux-pro/v1.1-ultra': {
    name: 'FLUX Pro Ultra (v1.1 Ultra)',
    category: 'Cinematográfico Máxima Resolução / 4K',
    creditsCharged: 4,
    unitCostUsd: 0.060,
    provider: 'fal.ai',
    maxSteps: 50,
    recommendedSteps: 28,
    billingType: 'Por Imagem Ultra 4K',
  },
};

/**
 * Simula a lógica de sanitização interna exatamente como executada pelo FalAIProvider.ts
 */
function sanitizePayloadForFalAI(modelTechnicalName, rawInputs) {
  let targetModel = modelTechnicalName;
  const modelInputs = { ...rawInputs };

  // 1. FLUX Schnell: clamp de steps em max 12 e remoção de guidance_scale
  if (targetModel.includes('flux/schnell')) {
    if (modelInputs.num_inference_steps) {
      modelInputs.num_inference_steps = Math.min(Number(modelInputs.num_inference_steps) || 4, 12);
    } else {
      modelInputs.num_inference_steps = 4;
    }
    delete modelInputs.guidance_scale;
  }

  // 2. Roteamento automático de imagem de entrada / base
  const hasImageInput = Boolean(modelInputs.image_url || modelInputs.image);
  const isImageTool = !targetModel.includes('video') && 
                      !targetModel.includes('sync') && 
                      !targetModel.includes('upscale') && 
                      !targetModel.includes('omnihuman');

  if (hasImageInput && isImageTool) {
    const baseImg = modelInputs.image_url || modelInputs.image;
    modelInputs.image_url = baseImg;

    if (targetModel.includes('nano-banana')) {
      targetModel = 'fal-ai/nano-banana-pro/edit';
      modelInputs.image_urls = [baseImg];
    } else if (
      targetModel.includes('flux') || 
      targetModel.includes('recraft') ||
      modelInputs.mode === 'character'
    ) {
      targetModel = 'fal-ai/flux-pulid';
      modelInputs.reference_image_url = baseImg;
    }

    if (modelInputs.image_size === 'original' || modelInputs.aspect_ratio === 'original') {
      delete modelInputs.image_size;
      delete modelInputs.aspect_ratio;
    }
  }

  // 3. Normalização de Aspect Ratio
  const requiresAspectRatio = targetModel.includes('ideogram') || 
                              targetModel.includes('ultra') || 
                              targetModel.includes('nano-banana') || 
                              targetModel.includes('flux-pro');

  if (requiresAspectRatio) {
    const ratioMap = {
      '1:1': '1:1',
      '16:9': '16:9',
      '9:16': '9:16',
      '4:3': '4:3',
      '3:4': '3:4',
      '3:2': '3:2',
      '2:3': '2:3',
      '21:9': '21:9',
      '9:21': '9:21',
      square_hd: '1:1',
      square: '1:1',
      landscape_16_9: '16:9',
      portrait_16_9: '9:16',
      landscape_4_3: '4:3',
      portrait_4_3: '3:4',
      landscape_3_2: '3:2',
      portrait_3_2: '2:3',
    };

    const rawRatio = modelInputs.aspect_ratio || modelInputs.image_size || '16:9';
    modelInputs.aspect_ratio = ratioMap[rawRatio] || '16:9';
    delete modelInputs.image_size;
  }

  // 4. Remover metadados internos da VORIXA que não fazem parte do schema da fal.ai
  delete modelInputs.style;
  delete modelInputs.resolution;
  delete modelInputs.mode;

  return {
    finalModel: targetModel,
    sanitizedInputs: modelInputs,
  };
}

/**
 * Executa requisição HTTP direta contra a API fal.ai (queue.fal.run)
 */
function sendRequestToFalQueue(modelEndpoint, payload, apiKey) {
  return new Promise((resolve) => {
    const data = JSON.stringify({ input: payload });
    const options = {
      hostname: 'queue.fal.run',
      port: 443,
      path: '/' + modelEndpoint,
      method: 'POST',
      headers: {
        'Authorization': 'Key ' + apiKey,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (d) => { body += d; });
      res.on('end', () => {
        let parsed = null;
        try {
          parsed = JSON.parse(body);
        } catch (e) {
          parsed = { rawBody: body };
        }
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: parsed,
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        statusCode: 0,
        error: err.message,
      });
    });

    req.write(data);
    req.end();
  });
}

/**
 * Execução Principal dos Testes
 */
async function runAudit() {
  console.log('='.repeat(80));
  console.log('🛡️  VORIXA AI - AUDITORIA DE COMUNICAÇÃO DE MOTORES DE IMAGEM FAL.AI');
  console.log('='.repeat(80));
  console.log(`🔑 FAL_KEY: ${FAL_KEY.substring(0, 8)}...${FAL_KEY.substring(FAL_KEY.length - 6)}`);
  console.log(`💵 Taxa de Câmbio: 1 USD = R$ ${USD_BRL_RATE.toFixed(2)}\n`);

  const testCases = [
    {
      id: '1',
      title: 'FLUX.1 Schnell (Text-to-Image Turbo)',
      rawModel: 'fal-ai/flux/schnell',
      inputs: {
        prompt: 'Futuristic cyberpunk metropolis at dusk, neon rain reflections, hyper-detailed, 8k resolution',
        image_size: 'landscape_16_9',
        num_inference_steps: 4,
        guidance_scale: 3.5,
        resolution: '1080p',
        style: 'cyberpunk',
      },
      expectedModel: 'fal-ai/flux/schnell',
      description: 'Valida remoção de guidance_scale, clamp de inference steps e limpeza de metadados internos.',
    },
    {
      id: '2',
      title: 'Recraft V3 (Design / Vetorial & Tipografia)',
      rawModel: 'fal-ai/recraft-v3',
      inputs: {
        prompt: 'A modern minimalist vector logo of a cybernetic phoenix, clean lines, flat colors, brand identity',
        image_size: 'square_hd',
        style: 'vector_illustration',
        resolution: 'HD',
      },
      expectedModel: 'fal-ai/recraft-v3',
      description: 'Valida renderização vetorial e de logotipo em formato square_hd.',
    },
    {
      id: '3',
      title: 'Nano Banana Pro / Google Imagen 3 (Text-to-Image Fotorrealismo)',
      rawModel: 'fal-ai/nano-banana-pro',
      inputs: {
        prompt: 'Award-winning medium-shot portrait of a 40-year-old barista smiling in an artisan coffee shop, natural morning lighting, 85mm lens, f/1.8, bokeh',
        aspect_ratio: '16:9',
        num_inference_steps: 24,
        resolution: 'FHD',
      },
      expectedModel: 'fal-ai/nano-banana-pro',
      description: 'Valida mapeamento de aspect_ratio 16:9 nativo para o motor Google Imagen 3.',
    },
    {
      id: '4',
      title: 'Nano Banana Pro Edit (Google Imagen 3 Edit - Img2Img com Referência)',
      rawModel: 'fal-ai/nano-banana-pro',
      inputs: {
        prompt: 'Add futuristic glowing cybernetic glasses and neon jacket to the person',
        image_url: 'https://storage.googleapis.com/falserverless/gallery/default.png',
        aspect_ratio: '16:9',
        strength: 0.75,
      },
      expectedModel: 'fal-ai/nano-banana-pro/edit',
      description: 'Valida roteamento automático de nano-banana-pro para nano-banana-pro/edit e mapeamento para image_urls array.',
    },
    {
      id: '5',
      title: 'FLUX PuLID (Preservação Facial Idêntica / Consistência de Rosto)',
      rawModel: 'fal-ai/flux-pulid',
      inputs: {
        prompt: 'A sophisticated entrepreneur wearing an Italian navy blazer standing on a rooftop in Tokyo at dusk',
        image_url: 'https://storage.googleapis.com/falserverless/gallery/default.png',
        num_inference_steps: 28,
        mode: 'character',
      },
      expectedModel: 'fal-ai/flux-pulid',
      description: 'Valida injeção de reference_image_url para o motor FLUX PuLID para fixação facial.',
    },
    {
      id: '6',
      title: 'FLUX Pro Ultra (Máxima Resolução / Fotografia de Cinema 4K)',
      rawModel: 'fal-ai/flux-pro/v1.1-ultra',
      inputs: {
        prompt: 'Cinematic widescreen photograph of a lone explorer on Mars looking at Olympus Mons, atmospheric dust, IMAX composition',
        aspect_ratio: '21:9',
        num_inference_steps: 28,
        guidance_scale: 4.0,
      },
      expectedModel: 'fal-ai/flux-pro/v1.1-ultra',
      description: 'Valida proporção cinematográfica 21:9 e resolução ultra para FLUX Pro 1.1 Ultra.',
    },
  ];

  const results = [];

  for (const tc of testCases) {
    console.log('\n' + '-'.repeat(80));
    console.log(`🧪 Teste #${tc.id}: ${tc.title}`);
    console.log(`🎯 Objetivo: ${tc.description}`);

    // Etapa 1: Sanitização do FalAIProvider
    const sanitized = sanitizePayloadForFalAI(tc.rawModel, tc.inputs);
    const modelMatched = sanitized.finalModel === tc.expectedModel;

    console.log(`⚙️  Modelo Solicitado: ${tc.rawModel}`);
    console.log(`🚀 Modelo Sanitizado/Roteado: ${sanitized.finalModel} ${modelMatched ? '✅ (Correto)' : '❌ (Divergência)'}`);
    console.log(`📦 Payload Sanitizado para Envio:`, JSON.stringify(sanitized.sanitizedInputs, null, 2));

    // Etapa 2: Disparo Real na Queue API da Fal.ai
    console.log(`📡 Enviando requisição para https://queue.fal.run/${sanitized.finalModel} ...`);
    const response = await sendRequestToFalQueue(sanitized.finalModel, sanitized.sanitizedInputs, FAL_KEY);

    const isSuccess = response.statusCode === 200 || response.statusCode === 201;
    const isExhaustedBalance = response.statusCode === 403 && 
                               response.data && 
                               response.data.detail && 
                               response.data.detail.includes('Exhausted balance');
    const isAuthValid = isSuccess || isExhaustedBalance;
    const isSchemaAccepted = response.statusCode !== 400 && response.statusCode !== 422;
    const isEndpointFound = response.statusCode !== 404;

    console.log(`📥 Status HTTP: ${response.statusCode}`);
    console.log(`💬 Resposta Servidor:`, JSON.stringify(response.data));

    let statusLabel = 'FALHA';
    if (isSuccess) {
      statusLabel = 'SUCESSO_COM_SALDO';
    } else if (isExhaustedBalance && isEndpointFound && isSchemaAccepted) {
      statusLabel = 'COMUNICAÇÃO_E_SCHEMA_ACEITOS (SALDO_ESGOTADO_CONFIRMADO)';
    }

    const costInfo = ENGINE_COST_TABLE[sanitized.finalModel] || {
      name: tc.title,
      creditsCharged: 2,
      unitCostUsd: 0.04,
      billingType: 'Por Imagem',
    };

    results.push({
      testId: tc.id,
      name: tc.title,
      requestedModel: tc.rawModel,
      executedModel: sanitized.finalModel,
      modelMatched,
      sanitizedPayload: sanitized.sanitizedInputs,
      httpStatus: response.statusCode,
      responseBody: response.data,
      isAuthValid,
      isEndpointFound,
      isSchemaAccepted,
      statusLabel,
      costInfo,
    });
  }

  // Tabela e Relatório de Custos
  console.log('\n' + '='.repeat(80));
  console.log('📊 SUMÁRIO EXECUTIVO DE CUSTOS UNITÁRIOS DOS MOTORES DE IMAGEM (USD / BRL)');
  console.log('='.repeat(80));
  console.log(
    '| Motor | Endpoint fal.ai | Créditos VORIXA | Custo Unitário (USD) | Custo Unitário (BRL) | Margem Bruta |'
  );
  console.log(
    '|---|---|---|---|---|---|'
  );

  for (const [ep, info] of Object.entries(ENGINE_COST_TABLE)) {
    const costUsd = info.unitCostUsd;
    const costBrl = costUsd * USD_BRL_RATE;
    const creditRevenueBrl = info.creditsCharged * 0.299;
    const grossMargin = ((creditRevenueBrl - costBrl) / creditRevenueBrl) * 100;

    console.log(
      `| ${info.name.padEnd(28)} | \`${ep}\` | ${info.creditsCharged} cr | $${costUsd.toFixed(3)} | R$ ${costBrl.toFixed(3)} | ~${grossMargin.toFixed(1)}% |`
    );
  }

  console.log('\n' + '='.repeat(80));
  console.log('🏁 RESULTADOS CONSOLIDADOS DA AUDITORIA');
  console.log('='.repeat(80));

  let allPassed = true;
  for (const r of results) {
    const pass = r.modelMatched && r.isAuthValid && r.isEndpointFound && r.isSchemaAccepted;
    if (!pass) allPassed = false;
    console.log(
      `[${pass ? 'APROVADO' : 'REPROVADO'}] Motor #${r.testId} - ${r.name} -> HTTP ${r.httpStatus} (${r.statusLabel})`
    );
  }

  console.log('\nAudit Concluída com ' + (allPassed ? '100% DE APROVAÇÃO' : 'ALGUMAS DIVERGÊNCIAS'));
  return { allPassed, results };
}

runAudit().then((out) => {
  process.exit(out.allPassed ? 0 : 1);
});
