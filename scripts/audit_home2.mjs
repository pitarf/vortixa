import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function runAudit() {
  const browser = await chromium.launch({ headless: true });
  
  const viewports = [
    { name: 'desktop', width: 1440, height: 900 },
    { name: 'mobile', width: 375, height: 812 }
  ];

  const outDir = path.resolve('public/audit-screenshots');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  for (const vp of viewports) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    
    // Testar /home-2
    console.log(`Auditing /home-2 on ${vp.name}...`);
    await page.goto('http://localhost:3005/home-2', { waitUntil: 'networkidle', timeout: 30000 });

    // Rolar a página suavemente para baixo para acionar o IntersectionObserver de todas as seções
    await page.evaluate(async () => {
      const distance = 400;
      const delay = 60;
      while (document.scrollingElement.scrollTop + window.innerHeight < document.scrollingElement.scrollHeight) {
        document.scrollingElement.scrollBy(0, distance);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
      // Rola de volta para o topo para screenshots
      document.scrollingElement.scrollTo(0, 0);
      await new Promise((resolve) => setTimeout(resolve, 200));
    });

    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(outDir, `home2_${vp.name}_full.png`), fullPage: true });

    // Tirar print específico do topo com Hero + Planos
    await page.screenshot({ path: path.join(outDir, `home2_${vp.name}_top.png`), fullPage: false });

    await page.close();
  }

  await browser.close();
  console.log('AUDIT_COMPLETE');
}

runAudit().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
