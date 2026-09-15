const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const models = require('./models_prompts_dataset');

const env = fs.readFileSync('.env', 'utf8');
const line = env.split('\n').find(l => l.startsWith('WAVESPEED_API_KEY='));
if (!line) {
  console.error("WAVESPEED_API_KEY não encontrada no .env");
  process.exit(1);
}
const key = line.split('=')[1].trim().replace(/['"]/g, '');

const SSH_KEY_PATH = 'G:\\Meu Drive\\Pita\\VPS ORACLE\\ssh-key-vpsOraclePrivate.key';
const VPS_HOST = 'ubuntu@144.22.173.125';
const LOCAL_DIR = path.join(__dirname, '..', 'public', 'uploads', 'models');

if (!fs.existsSync(LOCAL_DIR)) {
  fs.mkdirSync(LOCAL_DIR, { recursive: true });
}

async function generateImage(prompt, size = "768*1344", seed = 123456) {
  console.log(`[WAVESPEED] Submetendo tarefa (seed: ${seed}, size: ${size})...`);
  
  const res = await fetch('https://api.wavespeed.ai/api/v3/wavespeed-ai/wan-2.2/text-to-image-realism', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt,
      size,
      seed,
      output_format: 'webp'
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Erro na API WaveSpeed (${res.status}): ${errText}`);
  }

  const json = await res.json();
  const taskId = json.data?.id || json.id || json.data?.prediction_id || json.prediction_id;
  if (!taskId) throw new Error(`Task ID não retornado: ${JSON.stringify(json)}`);

  console.log(`  -> Task ID: ${taskId} | Aguardando inferência...`);
  const pollUrl = `https://api.wavespeed.ai/api/v3/predictions/${taskId}/result`;

  for (let attempt = 1; attempt <= 60; attempt++) {
    await new Promise(r => setTimeout(r, 4000));
    try {
      const pollRes = await fetch(pollUrl, {
        headers: { 'Authorization': `Bearer ${key}` }
      });
      if (!pollRes.ok) continue;

      const pollJson = await pollRes.json();
      const data = pollJson.data || pollJson;
      const status = (data.status || data.state || '').toLowerCase();

      if (status === 'completed' || status === 'succeeded') {
        const outputs = data.outputs || [];
        const finalUrl = outputs[0] || data.output?.url || data.url;
        console.log(`  ✓ Concluído em ~${attempt * 4}s! URL: ${finalUrl}`);
        return finalUrl;
      }

      if (status === 'failed' || status === 'cancelled') {
        throw new Error(`Falha na predição: ${JSON.stringify(data)}`);
      }
    } catch (e) {
      // erro transitório de rede
    }
  }

  throw new Error(`Timeout: tarefa ${taskId} excedeu 4 minutos.`);
}

async function downloadFile(url, targetPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Falha no download (${res.status}) de ${url}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(targetPath, buffer);
  return buffer.length;
}

function deployToVps(localFile, remoteName) {
  try {
    const cmd = `scp -i "${SSH_KEY_PATH}" -o StrictHostKeyChecking=no "${localFile}" ${VPS_HOST}:/var/www/vorixa-uploads/models/${remoteName}`;
    execSync(cmd, { stdio: 'pipe' });
    return true;
  } catch (err) {
    console.error(`  Erro no SCP para ${remoteName}:`, err.message);
    return false;
  }
}

async function processModel(model, index, total) {
  console.log(`\n================================================================`);
  console.log(`[${index + 1}/${total}] Processando Modelo: ${model.name} (${model.slug})`);
  console.log(`Categoria: ${model.category} | Seed Base: ${model.seed}`);
  console.log(`================================================================`);

  const profileName = `${model.slug}-profile.webp`;
  const bodyName = `${model.slug}-body.webp`;
  const localProfilePath = path.join(LOCAL_DIR, profileName);
  const localBodyPath = path.join(LOCAL_DIR, bodyName);

  // 1. Processar Foto de Perfil
  if (fs.existsSync(localProfilePath)) {
    console.log(`  ⏩ Perfil já existe localmente (${profileName}). Pulando geração.`);
  } else {
    console.log(`\n📸 Gerando Foto de Perfil (85mm close-up)...`);
    const profileUrl = await generateImage(model.profilePrompt, "768*1344", model.seed);
    const bytes = await downloadFile(profileUrl, localProfilePath);
    console.log(`  Salvo localmente: ${profileName} (${(bytes / 1024).toFixed(1)} KB)`);
  }
  deployToVps(localProfilePath, profileName);

  // 2. Processar Foto de Corpo Inteiro
  if (fs.existsSync(localBodyPath)) {
    console.log(`  ⏩ Corpo todo já existe localmente (${bodyName}). Pulando geração.`);
  } else {
    console.log(`\n🧍 Gerando Foto de Corpo Todo (35mm full-body)...`);
    const bodyUrl = await generateImage(model.bodyPrompt, "768*1344", model.seed);
    const bytes = await downloadFile(bodyUrl, localBodyPath);
    console.log(`  Salvo localmente: ${bodyName} (${(bytes / 1024).toFixed(1)} KB)`);
  }
  deployToVps(localBodyPath, bodyName);

  console.log(`\n✨ Modelo ${model.name} pronto!`);
  console.log(`  Perfil: https://vortixia.com.br/uploads/models/${profileName}`);
  console.log(`  Corpo:  https://vortixia.com.br/uploads/models/${bodyName}`);
}

async function main() {
  const args = process.argv.slice(2);
  let targetModels = models;

  // Filtro por slug específico (ex: node generate_all_models.js camila-duarte)
  if (args[0] && !args[0].startsWith('--')) {
    targetModels = models.filter(m => m.slug.includes(args[0]));
    if (targetModels.length === 0) {
      console.error(`Nenhum modelo encontrado para o filtro "${args[0]}".`);
      process.exit(1);
    }
  }

  // Filtro por limite de lote (ex: --limit=5)
  const limitArg = args.find(a => a.startsWith('--limit='));
  if (limitArg) {
    const limit = parseInt(limitArg.split('=')[1], 10);
    targetModels = targetModels.slice(0, limit);
  }

  console.log(`\nIniciando geração de ${targetModels.length} modelo(s)...`);
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < targetModels.length; i++) {
    try {
      await processModel(targetModels[i], i, targetModels.length);
      successCount++;
    } catch (err) {
      console.error(`❌ Erro no modelo ${targetModels[i].name}:`, err.message);
      failCount++;
    }
  }

  console.log(`\n================================================================`);
  console.log(`Processo finalizado!`);
  console.log(`Modelos com sucesso: ${successCount}`);
  console.log(`Modelos com falha:   ${failCount}`);
  console.log(`================================================================\n`);
}

main();
