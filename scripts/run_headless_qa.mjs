import { chromium } from 'playwright';
import fs from 'fs';

const BASE_URL = 'http://localhost:3001';
const SCREENSHOTS_DIR = './public/test-screenshots';
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 375, height: 667 },
];

const PAGES_TO_TEST = [
  { name: 'landing', path: '/' },
  { name: 'login', path: '/login' },
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
  console.log('Iniciando Automacao Headless via Playwright...');
  const browser = await chromium.launch({ headless: true });
  const results = [];

  for (const vp of VIEWPORTS) {
    console.log('Testando Resolucao:', vp.name, vp.width, vp.height);
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      userAgent: vp.name === 'mobile' 
        ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
        : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    });

    const page = await context.newPage();
    const consoleErrors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        if (!text.includes('Failed to load resource') && !text.includes('favicon')) {
          consoleErrors.push(text);
        }
      }
    });

    // 1. Fazer Login Inicial
    console.log('Realizando login no', vp.name);
    try {
      await page.goto(BASE_URL + '/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.screenshot({ path: SCREENSHOTS_DIR + '/' + vp.name + '_login_page.png' });

      const emailInput = page.locator('input[type= email]');
      const passwordInput = page.locator('input[type=password]');

      if (await emailInput.isVisible({ timeout: 5000 })) {
        await emailInput.fill('qa-tester@vorixa.com');
        await passwordInput.fill('Password123!');
        const submitBtn = page.locator('button[type=submit]');
        await submitBtn.click();
        await page.waitForTimeout(3000);
      }
    } catch (err) {
      console.warn('[Login Error]:', err.message);
    }

    // 2. Visitar cada tela do sistema
    for (const item of PAGES_TO_TEST) {
      console.log('  -> Auditando tela [' + item.name + ']: ' + item.path);
      const routeUrl = BASE_URL + item.path;

      try {
        const response = await page.goto(routeUrl, { waitUntil: 'domcontentloaded', timeout: 25000 });
        await page.waitForTimeout(1500);

        // Validar se houve overflow horizontal no mobile
        const hasHorizontalOverflow = await page.evaluate(() => {
          return document.documentElement.scrollWidth > window.innerWidth + 2;
        });

        // Screenshot de alta definição
        const screenshotPath = SCREENSHOTS_DIR + '/' + vp.name + '_' + item.name + '.png';
        await page.screenshot({ path: screenshotPath, fullPage: false });

        results.push({
          page: item.name,
          path: item.path,
          viewport: vp.name,
          status: response ? response.status() : 'OK',
          horizontalOverflow: hasHorizontalOverflow,
          consoleErrorsCount: consoleErrors.length,
          screenshot: screenshotPath,
        });

        if (hasHorizontalOverflow) {
          console.warn('    [ATENCAO]: Overflow horizontal detectado em ' + item.name + ' (' + vp.name + ')');
        }
      } catch (e) {
        console.error('    [ERRO] ao visitar ' + item.name + ':', e.message);
        results.push({
          page: item.name,
          path: item.path,
          viewport: vp.name,
          status: 'ERROR',
          error: e.message,
        });
      }
    }

    await context.close();
  }

  await browser.close();

  fs.writeFileSync('./playwright-report/qa-summary.json', JSON.stringify(results, null, 2));
  console.log('Automacao Playwright Finalizada com Sucesso! Relatorio gravado em ./playwright-report/qa-summary.json');
}

run().catch(console.error);