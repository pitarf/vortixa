const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const env = fs.readFileSync('.env', 'utf8');
const line = env.split('\n').find(l => l.startsWith('WAVESPEED_API_KEY='));
if (!line) {
  console.error("WAVESPEED_API_KEY not found in .env");
  process.exit(1);
}
const key = line.split('=')[1].trim().replace(/['"]/g, '');

const SSH_KEY_PATH = 'G:\\Meu Drive\\Pita\\VPS ORACLE\\ssh-key-vpsOraclePrivate.key';
const VPS_HOST = 'ubuntu@144.22.173.125';

async function generateImage(prompt, size = "768*1344", seed = 123456) {
  console.log(`\n[WAVESPEED] Submetendo tarefa de geração...`);
  console.log(`Prompt: ${prompt.slice(0, 80)}...`);
  console.log(`Size: ${size} | Seed: ${seed} | Format: webp`);

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

  const text = await res.text();
  console.log('WaveSpeed HTTP Status:', res.status);
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`Resposta não é JSON: ${text}`);
  }

  if (!res.ok) {
    throw new Error(`Erro WaveSpeed: ${JSON.stringify(json)}`);
  }

  const taskId = json.data?.id || json.id || json.data?.prediction_id || json.prediction_id;
  if (!taskId) {
    throw new Error(`ID da tarefa ausente: ${JSON.stringify(json)}`);
  }
  console.log(`Tarefa iniciada com sucesso! Task ID: ${taskId}`);

  // Polling de resultado
  const pollUrl = `https://api.wavespeed.ai/api/v3/predictions/${taskId}/result`;
  console.log(`Consultando status da tarefa...`);

  for (let attempt = 1; attempt <= 60; attempt++) {
    await new Promise(r => setTimeout(r, 4000));
    try {
      const pollRes = await fetch(pollUrl, {
        headers: { 'Authorization': `Bearer ${key}` }
      });
      if (!pollRes.ok) {
        console.log(`[Tentativa ${attempt}] HTTP ${pollRes.status}, aguardando...`);
        continue;
      }
      const pollJson = await pollRes.json();
      const data = pollJson.data || pollJson;
      const status = (data.status || data.state || '').toLowerCase();
      console.log(`[Tentativa ${attempt}] Status: ${status}`);

      if (status === 'completed' || status === 'succeeded') {
        const outputs = data.outputs || [];
        const finalUrl = outputs[0] || data.output?.url || data.url;
        console.log(`Geração concluída com sucesso! URL: ${finalUrl}`);
        return finalUrl;
      }

      if (status === 'failed' || status === 'cancelled') {
        throw new Error(`Geração falhou: ${JSON.stringify(data)}`);
      }
    } catch (pollErr) {
      console.warn(`Aviso no polling:`, pollErr.message);
    }
  }

  throw new Error(`Timeout: tarefa ${taskId} excedeu 4 minutos.`);
}

async function downloadAndDeploy(imageUrl, localFilename, vpsFilename) {
  const localDir = path.join(__dirname, '..', 'public', 'uploads', 'models');
  if (!fs.existsSync(localDir)) {
    fs.mkdirSync(localDir, { recursive: true });
  }

  const localPath = path.join(localDir, localFilename);
  console.log(`\nBaixando imagem de ${imageUrl} para ${localPath}...`);

  const res = await fetch(imageUrl);
  if (!res.ok) throw new Error(`Falha no download: HTTP ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(localPath, buffer);
  console.log(`Imagem salva localmente: ${localPath} (${(buffer.length / 1024).toFixed(1)} KB)`);

  // Upload para a VPS via SCP
  console.log(`Enviando para a VPS (/var/www/vorixa-uploads/models/${vpsFilename})...`);
  const scpCmd = `scp -i "${SSH_KEY_PATH}" -o StrictHostKeyChecking=no "${localPath}" ${VPS_HOST}:/var/www/vorixa-uploads/models/${vpsFilename}`;
  execSync(scpCmd, { stdio: 'inherit' });
  console.log(`Upload para VPS concluído com sucesso!`);

  const publicUrl = `https://vortixia.com.br/uploads/models/${vpsFilename}`;
  console.log(`URL pública acessível: ${publicUrl}`);
  return publicUrl;
}

async function run() {
  try {
    console.log(`=== TESTE: GERANDO ISABELLA FIORE (PERFIL & CORPO TODO) ===`);

    const sharedSeed = 884219;

    // 1. Foto de Perfil
    const profilePrompt = "ultra photorealistic 8k close-up 85mm portrait photo of Isabella Fiore, Italian fashion model, striking hazel eyes, flowing dark brunette waves, natural unairbrushed skin texture with fine pores and subtle skin imperfections, soft studio key lighting, shot on Hasselblad H6D-100c 85mm f/1.4, cinematic editorial grade, documentary style, authentic raw photograph, no plastic skin, no CGI render, no doll look";
    const profileUrl = await generateImage(profilePrompt, "768*1344", sharedSeed);
    const publicProfileUrl = await downloadAndDeploy(profileUrl, "isabella-fiore-profile.webp", "isabella-fiore-profile.webp");

    // 2. Foto de Corpo Todo
    const bodyPrompt = "ultra photorealistic 8k full body head-to-toe 35mm fashion photograph of Isabella Fiore, Italian fashion model, striking hazel eyes, flowing dark brunette waves, wearing structured cream silk blazer and tailored wide-leg trousers, standing full length pose, high fashion runway editorial studio, authentic unairbrushed skin texture, shot on Hasselblad H6D-100c 35mm f/2.8, cinematic studio lighting, authentic raw photograph, no plastic skin, no CGI render, no doll look";
    const bodyUrl = await generateImage(bodyPrompt, "768*1344", sharedSeed);
    const publicBodyUrl = await downloadAndDeploy(bodyUrl, "isabella-fiore-body.webp", "isabella-fiore-body.webp");

    console.log(`\n=== SUCESSO! ISABELLA FIORE GERADA COM SUCESSO ===`);
    console.log(`Perfil: ${publicProfileUrl}`);
    console.log(`Corpo Todo: ${publicBodyUrl}`);
  } catch (err) {
    console.error(`Erro na execução do teste:`, err);
    process.exit(1);
  }
}

run();
