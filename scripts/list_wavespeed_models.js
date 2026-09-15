const fs = require('fs');

const env = fs.readFileSync('.env', 'utf8');
const line = env.split('\n').find(l => l.startsWith('WAVESPEED_API_KEY='));
if (!line) {
  console.error("WAVESPEED_API_KEY not found in .env");
  process.exit(1);
}
const key = line.split('=')[1].trim().replace(/['"]/g, '');

async function main() {
  try {
    const res = await fetch('https://api.wavespeed.ai/api/v3/models', {
      headers: { 'Authorization': `Bearer ${key}` }
    });
    const json = await res.json();
    const list = json.data || json;
    const items = list.map(m => m.uuid || m.id || m.name).filter(Boolean);

    console.log('--- FLUX TEXT TO IMAGE ---');
    items.filter(x => x.includes('flux') && x.includes('text-to-image')).forEach(x => console.log(' ', x));

    console.log('--- WAN TEXT TO IMAGE ---');
    items.filter(x => x.includes('wan') && x.includes('text-to-image')).forEach(x => console.log(' ', x));

    console.log('--- REALISM / REALISTIC ---');
    items.filter(x => x.includes('realism') || x.includes('realistic')).forEach(x => console.log(' ', x));

    console.log('--- QWEN / MINIMAX / GROK TEXT TO IMAGE ---');
    items.filter(x => (x.includes('minimax') || x.includes('qwen') || x.includes('grok')) && x.includes('text-to-image')).forEach(x => console.log(' ', x));
    
    console.log('--- MIDJOURNEY / RECRAFT ---');
    items.filter(x => (x.includes('midjourney') || x.includes('recraft')) && x.includes('text-to-image')).forEach(x => console.log(' ', x));
  } catch (err) {
    console.error('Error:', err);
  }
}

main();
