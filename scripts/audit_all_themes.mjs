import { chromium } from 'playwright';
import fs from 'fs';

const BASE_URL = 'http://localhost:3005';
const SCREENSHOTS_DIR = './public/test-screenshots/theme-audit';
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

const PAGES_TO_TEST = [
  { name: 'landing', path: '/' },
  { name: 'dashboard_home', path: '/dashboard' },
  { name: 'studio_create', path: '/dashboard/create' },
  { name: 'tools_image', path: '/dashboard/tools/image' },
  { name: 'tools_video', path: '/dashboard/tools/video' },
  { name: 'tools_lipsync', path: '/dashboard/tools/lipsync' },
  { name: 'tools_motion', path: '/dashboard/tools/motion' },
  { name: 'tools_upscale', path: '/dashboard/tools/upscale' },
  { name: 'marketplace_models', path: '/dashboard/models' },
  { name: 'studio_flow', path: '/dashboard/flow' },
  { name: 'library', path: '/dashboard/library' },
  { name: 'credits', path: '/dashboard/credits' },
  { name: 'affiliates', path: '/dashboard/affiliates' },
  { name: 'admin', path: '/dashboard/admin' }
];

async function runThemeAudit() {
  console.log('🚀 [THEME AUDIT] Iniciando varredura fotográfica completa de Tema Claro vs Escuro...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });

  const page = await context.newPage();

  // 1. Login com conta de Admin para ter acesso irrestrito
  console.log('1. Efetuando login...');
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.locator('input[type=email]').fill('qa-tester@vorixa.com');
  await page.locator('input[type=password]').fill('Password123!');
  await page.locator('button[type=submit]').click();
  await page.waitForURL('**/dashboard**', { timeout: 15000 });
  console.log('  -> Logado com sucesso!');

  // 2. Iterar por cada tela em Tema Escuro e Tema Claro
  for (const pageInfo of PAGES_TO_TEST) {
    console.log(`\n📸 Auditando página: ${pageInfo.name} (${pageInfo.path})...`);
    await page.goto(`${BASE_URL}${pageInfo.path}`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1500);

    // Capturar Tema Escuro (Padrão)
    await page.evaluate(() => {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('vorixa_theme', 'dark');
    });
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${SCREENSHOTS_DIR}/${pageInfo.name}_dark.png`, fullPage: false });

    // Alternar para Tema Claro e Capturar
    await page.evaluate(() => {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('vorixa_theme', 'light');
    });
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${SCREENSHOTS_DIR}/${pageInfo.name}_light.png`, fullPage: false });
    console.log(`  ✓ Dark & Light capturados para ${pageInfo.name}`);
  }

  await browser.close();
  console.log('\n✅ [THEME AUDIT] Todas as capturas salvas com sucesso em:', SCREENSHOTS_DIR);
}

runThemeAudit().catch(err => {
  console.error('❌ Falha na auditoria de tema:', err);
  process.exit(1);
});
