import { chromium } from 'playwright';
import fs from 'fs';

const BASE_URL = 'http://localhost:3005';
const SCREENSHOTS_DIR = './public/test-screenshots';
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function runFlowTest() {
  console.log('🚀 [QA FLOW] Iniciando teste automatizado do Studio Flow via Playwright...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });

  const page = await context.newPage();
  const consoleLogs = [];
  const networkErrors = [];

  page.on('console', (msg) => {
    consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
    if (msg.type() === 'error') {
      console.log('  ⚠️ Console Error:', msg.text());
    }
  });

  page.on('response', (res) => {
    if (res.status() >= 400 && !res.url().includes('favicon')) {
      networkErrors.push(`${res.status()} ${res.url()}`);
      console.log(`  ❌ Network Error: ${res.status()} ${res.url()}`);
    }
  });

  try {
    // 1. Login com QA Tester
    console.log('1. Efetuando login com qa-tester@vorixa.com...');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.locator('input[type=email]').fill('qa-tester@vorixa.com');
    await page.locator('input[type=password]').fill('Password123!');
    await page.locator('button[type=submit]').click();
    
    // Aguarda redirecionamento pós-login
    await page.waitForURL('**/dashboard**', { timeout: 15000 });
    console.log('  -> Autenticado com sucesso! URL atual:', page.url());

    // 2. Acessar listagem de flows
    console.log('2. Acessando /dashboard/flow...');
    await page.goto(`${BASE_URL}/dashboard/flow`, { waitUntil: 'networkidle', timeout: 20000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${SCREENSHOTS_DIR}/flow_list.png` });

    // 3. Criar ou abrir um Flow
    console.log('3. Clicando para criar novo fluxo...');
    const createBtn = page.locator('button:has-text("Criar Novo Flow"), button:has-text("Criar Primeiro Flow")').first();
    await createBtn.waitFor({ state: 'visible', timeout: 5000 });
    await createBtn.click();
    console.log('  -> Botão clicado. Aguardando redirecionamento para o editor do fluxo...');
    await page.waitForURL('**/dashboard/flow/**', { timeout: 15000 });

    const currentUrl = page.url();
    console.log(`  -> URL atual do editor: ${currentUrl}`);
    await page.screenshot({ path: `${SCREENSHOTS_DIR}/flow_editor_initial.png` });

    // 4. Inserir Nós via UI
    console.log('4. Validando toolbar do Flow...');
    const addNodeBtn = page.locator('button:has-text("Add Node")');
    await addNodeBtn.waitFor({ state: 'visible', timeout: 5000 });
    await addNodeBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `${SCREENSHOTS_DIR}/flow_node_picker.png` });

    // Adicionar nó de Prompt
    console.log('5. Adicionando nó de Prompt Criativo...');
    const promptOption = page.locator('button:has-text("Prompt Criativo")').first();
    await promptOption.click();
    await page.waitForTimeout(1000);

    // Adicionar nó de Imagem
    console.log('6. Adicionando nó de FLUX Imagem...');
    await addNodeBtn.click();
    await page.waitForTimeout(500);
    const imageOption = page.locator('button:has-text("FLUX")').first();
    await imageOption.click();
    await page.waitForTimeout(1000);

    // Adicionar nó de Vídeo
    console.log('7. Adicionando nó de Kling Vídeo...');
    await addNodeBtn.click();
    await page.waitForTimeout(500);
    const videoOption = page.locator('button:has-text("Kling")').first();
    await videoOption.click();
    await page.waitForTimeout(1000);

    await page.screenshot({ path: `${SCREENSHOTS_DIR}/flow_nodes_added.png` });

    // 8. Clicar em "Salvar"
    console.log('8. Clicando no botão Salvar...');
    const saveBtn = page.locator('button:has-text("Salvar")').first();
    await saveBtn.click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${SCREENSHOTS_DIR}/flow_saved.png` });

    // 9. Clicar em "Run Flow"
    console.log('9. Clicando em "Run Flow"...');
    const runFlowBtn = page.locator('button:has-text("Run Flow")').first();
    await runFlowBtn.click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `${SCREENSHOTS_DIR}/flow_run_modal.png` });

    // 10. Confirmar no Modal "Executar Pipeline Real"
    console.log('10. Confirmando execução no modal...');
    const confirmBtn = page.locator('button:has-text("Executar Pipeline Real")');
    if (await confirmBtn.isVisible({ timeout: 3000 })) {
      await confirmBtn.click();
      console.log('  -> Execução disparada com sucesso!');
      await page.waitForTimeout(3000);
      await page.screenshot({ path: `${SCREENSHOTS_DIR}/flow_execution_running.png` });
    }

    console.log('✅ [QA FLOW SUCESSO] Teste de ponta a ponta do Studio Flow finalizado sem falhas!');
  } catch (err) {
    console.error('❌ [QA FLOW ERRO]:', err.message);
    await page.screenshot({ path: `${SCREENSHOTS_DIR}/flow_error.png` });
  } finally {
    await browser.close();
    fs.writeFileSync(
      './playwright-report/flow-qa-summary.json',
      JSON.stringify({ consoleLogs, networkErrors }, null, 2)
    );
  }
}

runFlowTest();
