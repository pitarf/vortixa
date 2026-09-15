const fs = require('fs');
const path = require('path');
const models = require('./models_prompts_dataset');

const modelsFile = path.join(__dirname, '..', 'lib', 'marketplace-models.ts');
let content = fs.readFileSync(modelsFile, 'utf8');

// Atualizar URLs de cada um dos 30 modelos no arquivo lib/marketplace-models.ts
models.forEach(m => {
  const profileUrl = `https://vortixia.com.br/uploads/models/${m.slug}-profile.webp`;
  const bodyUrl = `https://vortixia.com.br/uploads/models/${m.slug}-body.webp`;

  // Regex para encontrar o bloco do modelo pelo slug
  const slugRegex = new RegExp(`"slug":\\s*"${m.slug}"[\\s\\S]*?(?=},\\s*{|}\\s*\\])`, 'g');
  const match = content.match(slugRegex);
  if (match) {
    let block = match[0];
    
    // Substituir avatarUrl
    block = block.replace(/"avatarUrl":\s*"[^"]*"/, `"avatarUrl": "${profileUrl}"`);
    // Substituir coverUrl
    block = block.replace(/"coverUrl":\s*"[^"]*"/, `"coverUrl": "${bodyUrl}"`);
    // Substituir gallery
    block = block.replace(/"gallery":\s*\[\s*"[^"]*",\s*"[^"]*"\s*\]/, `"gallery": [\n      "${bodyUrl}",\n      "${profileUrl}"\n    ]`);
    // Substituir referenceFaceUrl
    block = block.replace(/"referenceFaceUrl":\s*"[^"]*"/, `"referenceFaceUrl": "${profileUrl}"`);
    
    content = content.replace(match[0], block);
  }
});

fs.writeFileSync(modelsFile, content, 'utf8');
console.log('lib/marketplace-models.ts atualizado com URLs definitivas dos uploads!');

// Gerar script SQL para atualização direta no PostgreSQL
let sql = `-- Script de sincronização das URLs de fotos reais WebP dos 30 modelos no PostgreSQL\n`;
models.forEach(m => {
  const profileUrl = `https://vortixia.com.br/uploads/models/${m.slug}-profile.webp`;
  const bodyUrl = `https://vortixia.com.br/uploads/models/${m.slug}-body.webp`;

  sql += `UPDATE "MarketplaceModel" SET ` +
    `"avatarUrl" = '${profileUrl}', ` +
    `"coverUrl" = '${bodyUrl}', ` +
    `"gallery" = ARRAY['${bodyUrl}', '${profileUrl}']::text[], ` +
    `"referenceFaceUrl" = '${profileUrl}' ` +
    `WHERE "slug" = '${m.slug}';\n`;
});

const sqlFile = path.join(__dirname, 'update_models_webp_urls.sql');
fs.writeFileSync(sqlFile, sql, 'utf8');
console.log(`Script SQL gerado: ${sqlFile}`);
