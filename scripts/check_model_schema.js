const fs = require('fs');

const env = fs.readFileSync('.env', 'utf8');
const line = env.split('\n').find(l => l.startsWith('WAVESPEED_API_KEY='));
const key = line.split('=')[1].trim().replace(/['"]/g, '');

async function run() {
  const res = await fetch('https://api.wavespeed.ai/api/v3/models', {
    headers: { 'Authorization': `Bearer ${key}` }
  });
  const json = await res.json();
  const list = json.data || json;
  const kontext = list.find(m => (m.uuid || m.id || m.name) === 'wavespeed-ai/flux-kontext-pro/text-to-image');
  console.log('Kontext Pro:', JSON.stringify(kontext, null, 2));
}

run();
