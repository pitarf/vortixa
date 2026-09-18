import { chromium } from 'playwright';
import path from 'path';

async function capturePricing() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto('http://localhost:3005/home-2', { waitUntil: 'networkidle' });
  
  // Rolar até a seção de planos
  const pricingSection = page.locator('#planos-topo');
  await pricingSection.scrollIntoViewIfNeeded();
  
  const outDir = path.resolve('public/audit-screenshots');
  await page.screenshot({ path: path.join(outDir, 'home2_pricing_section.png') });

  // Testar no mobile também
  await page.setViewportSize({ width: 375, height: 812 });
  await pricingSection.scrollIntoViewIfNeeded();
  await page.screenshot({ path: path.join(outDir, 'home2_pricing_mobile.png') });

  await browser.close();
  console.log('PRICING_SCREENSHOTS_DONE');
}

capturePricing().catch(err => {
  console.error(err);
  process.exit(1);
});
