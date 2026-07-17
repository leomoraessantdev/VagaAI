import { test, expect } from '@playwright/test';

const SSE_BODY = [
  'data: {"delta":"## Sobre a vaga\\n\\n"}\n\n',
  'data: {"delta":"Procuramos uma pessoa desenvolvedora front-end para o nosso time."}\n\n',
  'data: {"done":true,"truncada":false}\n\n',
].join('');

test('fluxo completo: exemplo → gerar → descrição na tela', async ({ page }) => {
  await page.route('**/api/gerar-vaga', (route) =>
    route.fulfill({
      status: 200,
      headers: { 'content-type': 'text/event-stream; charset=utf-8' },
      body: SSE_BODY,
    }),
  );

  await page.goto('/');

  await page.getByRole('button', { name: 'Preencher com exemplo' }).click();
  await expect(page.locator('#cargo')).toHaveValue('Desenvolvedor(a) Front-end Pleno');
  await expect(page.locator('#responsabilidades')).not.toHaveValue('');

  await page.getByRole('button', { name: 'Gerar Descrição' }).click();

  await expect(
    page.getByText('Procuramos uma pessoa desenvolvedora front-end para o nosso time.'),
  ).toBeVisible();
  await expect(page.getByText(/\d+ palavras/)).toBeVisible();

  // Geração bem-sucedida entra no histórico local.
  await expect(page.getByText('Histórico recente')).toBeVisible();
});

test('erro do backend mostra banner com retry', async ({ page }) => {
  let chamadas = 0;
  await page.route('**/api/gerar-vaga', (route) => {
    chamadas += 1;
    if (chamadas === 1) {
      return route.fulfill({
        status: 429,
        contentType: 'application/json',
        body: JSON.stringify({ erro: 'Muitas requisições. Aguarde um instante.' }),
      });
    }
    return route.fulfill({
      status: 200,
      headers: { 'content-type': 'text/event-stream; charset=utf-8' },
      body: SSE_BODY,
    });
  });

  await page.goto('/');
  await page.getByRole('button', { name: 'Preencher com exemplo' }).click();
  await page.getByRole('button', { name: 'Gerar Descrição' }).click();

  await expect(page.getByRole('alert')).toContainText('Muitas requisições');

  await page.getByRole('button', { name: 'Tentar novamente' }).click();
  await expect(
    page.getByText('Procuramos uma pessoa desenvolvedora front-end para o nosso time.'),
  ).toBeVisible();
});
