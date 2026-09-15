const fs = require('fs');
const path = require('path');

const tsContent = fs.readFileSync(path.join(__dirname, '../lib/marketplace-models.ts'), 'utf-8');
const assignIdx = tsContent.indexOf('= [');
const arrayStart = assignIdx + 2;
const arrayEnd = tsContent.lastIndexOf(']');
const models = JSON.parse(tsContent.substring(arrayStart, arrayEnd + 1));

function escapeSql(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return val;
  if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
  if (Array.isArray(val)) {
    const escaped = val.map(s => '"' + s.replace(/"/g, '\\"') + '"').join(',');
    return "'{" + escaped.replace(/'/g, "''") + "}'";
  }
  return "'" + String(val).replace(/'/g, "''") + "'";
}

let sql = 'BEGIN;\n';
for (const m of models) {
  const id = escapeSql(m.id);
  const name = escapeSql(m.name);
  const slug = escapeSql(m.slug);
  const type = escapeSql(m.type || 'AI');
  const category = escapeSql(m.category || 'FASHION');
  const bio = escapeSql(m.bio);
  const avatarUrl = escapeSql(m.avatarUrl);
  const coverUrl = escapeSql(m.coverUrl);
  const gallery = escapeSql(m.gallery || []);
  const tags = escapeSql(m.tags || []);
  const promptTrigger = escapeSql(m.promptTrigger);
  const referenceFaceUrl = escapeSql(m.referenceFaceUrl);
  const loraModelId = escapeSql(m.loraModelId);
  const instagramHandle = escapeSql(m.instagramHandle);
  const location = escapeSql(m.location);
  const bookingPriceCents = escapeSql(m.bookingPriceCents);
  const creditsPricePerGen = escapeSql(m.creditsPricePerGen || 5);
  const status = escapeSql(m.status !== false);
  const isFeatured = escapeSql(Boolean(m.isFeatured));
  const isHot18 = escapeSql(Boolean(m.isHot18));

  sql += `
INSERT INTO "MarketplaceModel" (
  id, name, slug, type, category, bio, "avatarUrl", "coverUrl",
  gallery, tags, "promptTrigger", "referenceFaceUrl", "loraModelId",
  "instagramHandle", location, "bookingPriceCents", "creditsPricePerGen",
  status, "isFeatured", "isHot18", "updatedAt"
) VALUES (
  ${id}, ${name}, ${slug}, ${type}::"ModelType", ${category}::"ModelCategory", ${bio}, ${avatarUrl}, ${coverUrl},
  ${gallery}, ${tags}, ${promptTrigger}, ${referenceFaceUrl}, ${loraModelId},
  ${instagramHandle}, ${location}, ${bookingPriceCents}, ${creditsPricePerGen},
  ${status}, ${isFeatured}, ${isHot18}, NOW()
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
`;
}
sql += 'COMMIT;\n';

fs.writeFileSync(path.join(__dirname, 'sync_30_models.sql'), sql);
console.log('Arquivo scripts/sync_30_models.sql gerado com sucesso! Bytes:', sql.length);
