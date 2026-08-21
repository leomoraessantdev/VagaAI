import { chromium } from '@playwright/test';
const RE_PAL = new RegExp('\\d+ palavras');
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
const envios = [];
p.on('request', (r) => {
  if (r.url().includes('/api/gerar-vaga') && r.method() === 'POST') envios.push(JSON.parse(r.postData()));
});

await p.goto('https://vagaai-demo.vercel.app/', { waitUntil: 'networkidle', timeout: 60000 });
await p.getByText('Passo 1 de 2').waitFor({ timeout: 30000 });

// Vaga 1: logistica
await p.getByRole('radio', { name: new RegExp('Logística') }).click();
await p.getByRole('combobox', { name: new RegExp('Cargo') }).fill('Auxiliar de Almoxarifado');
await p.getByRole('radio', { name: new RegExp('^Auxiliar') }).click();
await p.getByRole('button', { name: 'Continuar' }).click();
await p.getByText('Passo 2 de 2').waitFor();
await p.getByRole('button', { name: 'Gerar Descrição' }).click();
await p.getByText(RE_PAL).waitFor({ timeout: 90000 });

// Volta, troca tudo para TI
await p.getByRole('button', { name: new RegExp('Logística e Operações') }).first().click();
await p.getByText('Passo 1 de 2').waitFor();
await p.getByRole('radio', { name: new RegExp('Tecnologia') }).click();
await p.getByRole('combobox', { name: new RegExp('Cargo') }).fill('Desenvolvedor Júnior');
await p.getByRole('radio', { name: new RegExp('^Júnior') }).click();
await p.getByRole('button', { name: 'Continuar' }).click();
await p.getByText('Passo 2 de 2').waitFor();

// Clica REGENERAR (nao Gerar Descricao)
await p.getByRole('button', { name: 'Regenerar' }).click();
await p.getByText(RE_PAL).waitFor({ timeout: 90000 });
await p.waitForTimeout(1000);
const titulo = (await p.locator('[aria-busy]').innerText()).split('\n').filter(l => l.trim())[0];

console.log('formulario na tela: Tecnologia / Desenvolvedor Júnior / Júnior');
console.log('titulo gerado ....: ' + titulo);
console.log('');
console.log('=== payload do REGENERAR ===');
const ultimo = envios[envios.length - 1];
console.log('area=' + ultimo.area + ' | cargo=' + ultimo.cargo + ' | senioridade=' + ultimo.senioridade);
await b.close();