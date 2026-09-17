import { chromium } from 'playwright';
import fs from 'fs';

const BASE_URL = 'http://localhost:3001';
const SCREENSHOTS_DIR = './public/test-screenshots/clean';
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 375, height: 812 },
];

const PAGES = [
  { name: 'create_studio', path: '/dashboard/create' },
  { name: 'models_showcase', path: '/dashboard/models' },
  { name: 'library', path: '/dashboard/library' },
  { name: 'credits_pricing', path: '/dashboard/credits' },
  { name: 'tools_image', path: '/dashboard/tools/image' },
  { name: 'tools_video', path: '/dashboard/tools/video' },
  { name: 'tools_lipsync', path: '/dashboard/tools/lipsync' },
  { name: 'tools_motion', path: '/dashboard/tools/motion' },
  { name: 'tools_upscale', path: '/dashboard/tools/upscale' },
  { name: 'admin_dashboard', path: '/dashboard/admin' },
];

async function run() {
  console.log('Iniciando auditoria visual profunda...');
  const browser = await chromium.launch({ headless: true });

  for (const vp of VIEWPORTS) {
    console.log('Iniciando viewport:', vp.name);
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      userAgent: vp.name === 'mobile' 
        ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15' 
        : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    });

    const page = await context.newPage();

    // 1. Fazer Login
    await page.goto(BASE_URL + '/login', { waitUntil: 'domcontentloaded' });
    const emailInput = page.locator('input[type= email]');
    if (await emailInput.isVisible({ timeout: 4000 })) {
      await emailInput.fill('qa-tester@vorixa.com');
      await page.locator('input[type=password]').fill('Password123!');
      await page.locator('button[type=submit]').click();
      await page.waitForTimeout(2000);
    }

    // 2. Setar cookie de consentimento diretamente para não bloquear a tela
    await context.addCookies([
      { name: 'vorixa_cookies_consent', value: 'all', domain: 'localhost', path: '/' },
      { name: 'cookie_consent', value: 'accepted', domain: 'localhost', path: '/' }
    ]);
    await page.evaluate(() => {
      try {
        localStorage.setItem('cookie_consent', 'accepted');
        localStorage.setItem('vorixa_cookie_consent', 'accepted');
      } catch {}
    });

    // 3. Capturar cada página de forma limpa (Viewport e Fullpage)
    for (const p of PAGES) {
      console.log('  -> ' + vp.name + ': ' + p.name);
      await page.goto(BASE_URL + p.path, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1200);

      // Se houver banner de cookies, fechar
      const btn = page.getByRole('button', { name: /Aceitar/i });
      if (await btn.isVisible({ timeout: 1000 }).catch(() => false)) {
        await btn.click().catch(() => {});
        await page.waitForTimeout(400);
      }

      // Screenshot da visualização imediata
      await page.screenshot({ path: SCREENSHOTS_DIR + '/' + vp.name + '_' + p.name + '_viewport.png' });
      // Screenshot de página inteira
      await page.screenshot({ path: SCREENSHOTS_DIR + '/' + vp.name + '_' + p.name + '_fullpage.png', fullPage: true });

      // Se for a Vitrine de Modelos, testar clique no primeiro card para abrir o Lookbook
      if (p.name === 'models_showcase') {
        const firstCard = page.locator('[tabindex=0]').first();
        if (await firstCard.isVisible({ timeout: 2000 }).catch(() => false)) {
          await firstCard.click().catch(() => {});
          await page.waitForTimeout(1000);
          await page.screenshot({ path: SCREENSHOTS_DIR + '/' + vp.name + '_modal_lookbook.png' });
          const closeBtn = page.locator('button[aria-label*=Fechar], button:has-text(✕), button:has-text(X)').first();
          if (await closeBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
            await closeBtn.click().catch(() => {});
            await page.waitForTimeout(400);
          }
        }
      }

      // Se for Studio Create, testar clique em Alterar Modelo para abrir o Modal
      if (p.name === 'create_studio') {
        const changeModelBtn = page.getByRole('button', { name: /Alterar modelo/i }).first();
        if (await changeModelBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
          await changeModelBtn.click().catch(() => {});
          await page.waitForTimeout(1000);
          await page.screenshot({ path: SCREENSHOTS_DIR + '/' + vp.name + '_modal_model_picker.png' });
          const closeBtn = page.locator('button[aria-label*=Fechar], button:has-text(✕), button:has-text(X)').first();
          if (await closeBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
            await closeBtn.click().catch(() => {});
            await page.waitForTimeout(400);
          }
        }
      }
    }

    await context.close();
  }

  await browser.close();
  console.log('Auditoria profunda concluida com sucesso!');
}

run().catch(console.error);