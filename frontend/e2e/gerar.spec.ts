import { test, expect, type Page } from '@playwright/test';

const SSE_BODY = [
  'data: {"delta":"**Desenvolvedor(a) Front-end Pleno**\\n\\n"}\n\n',
  'data: {"delta":"Procuramos uma pessoa desenvolvedora front-end para o nosso time."}\n\n',
  'data: {"done":true,"truncada":false}\n\n',
].join('');

const REGISTRY = {
  areas: [
    {
      id: 'tecnologia',
      label: 'Tecnologia da Informação',
      icon: '💻',
      descricao: 'Desenvolvimento, dados, infraestrutura, QA e suporte.',
      seniorityLevels: [
        { id: 'junior', label: 'Júnior', yearsHint: 'até 2 anos' },
        { id: 'pleno', label: 'Pleno', yearsHint: '2 a 5 anos' },
      ],
      commonRoles: ['Desenvolvedor(a) Front-end', 'Analista de Dados'],
      skillLabel: 'Stack / tecnologias',
      skillPlaceholder: 'Ex: React, TypeScript',
    },
    {
      id: 'logistica-operacoes',
      label: 'Logística e Operações',
      icon: '📦',
      descricao: 'Armazém, expedição, estoque e transporte.',
      seniorityLevels: [
        { id: 'auxiliar', label: 'Auxiliar' },
        { id: 'encarregado', label: 'Encarregado' },
      ],
      commonRoles: ['Auxiliar de Almoxarifado'],
      skillLabel: 'Sistemas, equipamentos e certificações',
      skillPlaceholder: 'Ex: WMS, empilhadeira',
      extraFields: [
        {
          id: 'cnh',
          label: 'CNH exigida',
          tipo: 'select',
          opcoes: [
            { id: 'nao-exige', label: 'Não exige CNH' },
            { id: 'd', label: 'Categoria D' },
          ],
        },
      ],
    },
  ],
  catalogos: {
    modalidades: [
      { id: 'presencial', label: 'Presencial' },
      { id: 'hibrido', label: 'Híbrido' },
      { id: 'remoto', label: 'Remoto' },
    ],
    contratos: [{ id: 'clt', label: 'CLT' }],
    jornadas: [{ id: 'integral', label: 'Integral' }],
    beneficios: [{ id: 'vale-refeicao', label: 'Vale-refeição (VR)' }],
    afirmativas: [{ id: 'pcd', label: 'Pessoas com deficiência (PCD)' }],
    tons: [
      { id: 'formal', label: 'Formal corporativo' },
      { id: 'moderno', label: 'Neutro profissional' },
    ],
    periodosSalario: [{ id: 'mes', label: 'por mês' }],
    plataformas: [
      { id: 'generico', label: 'Uso geral' },
      { id: 'linkedin', label: 'LinkedIn' },
    ],
    ufs: ['RJ', 'SP'],
  },
  limites: {
    cargo: 120,
    areaLivre: 60,
    empresa: 120,
    sobreEmpresa: 240,
    cidade: 80,
    responsabilidades: 3000,
    requisitos: 3000,
    diferenciais: 2000,
    beneficiosExtras: 500,
    anterior: 20000,
  },
};

async function mockRegistry(page: Page) {
  await page.route('**/api/areas', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(REGISTRY) }),
  );
}

test('fluxo completo: exemplo, gerar e descrição na tela', async ({ page }) => {
  await mockRegistry(page);
  await page.route('**/api/gerar-vaga', (route) =>
    route.fulfill({
      status: 200,
      headers: { 'content-type': 'text/event-stream; charset=utf-8' },
      body: SSE_BODY,
    }),
  );

  await page.goto('/');

  await page.getByRole('button', { name: 'Preencher com exemplo' }).click();
  await expect(page.getByText('Passo 2 de 2')).toBeVisible();
  await expect(page.locator('#responsabilidades')).not.toHaveValue('');

  await page.getByRole('button', { name: 'Gerar Descrição' }).click();

  await expect(
    page.getByText('Procuramos uma pessoa desenvolvedora front-end para o nosso time.'),
  ).toBeVisible();
  await expect(page.getByText(/\d+ palavras/)).toBeVisible();

  // Geração bem-sucedida entra no histórico local.
  await expect(page.getByText('Histórico recente')).toBeVisible();
});

test('fluxo em dois passos: área, cargo e nível antes dos detalhes', async ({ page }) => {
  await mockRegistry(page);
  await page.route('**/api/gerar-vaga', (route) =>
    route.fulfill({
      status: 200,
      headers: { 'content-type': 'text/event-stream; charset=utf-8' },
      body: SSE_BODY,
    }),
  );

  await page.goto('/');
  await expect(page.getByText('Passo 1 de 2')).toBeVisible();

  await page.getByRole('radio', { name: /Logística/ }).click();
  // A escala de senioridade acompanha a área escolhida.
  await expect(page.getByRole('radio', { name: 'Encarregado' })).toBeVisible();

  await page.getByRole('combobox', { name: /Cargo/ }).fill('Auxiliar de Almoxarifado');
  await page.getByRole('radio', { name: 'Auxiliar', exact: true }).click();
  await page.getByRole('button', { name: 'Continuar' }).click();

  await expect(page.getByText('Passo 2 de 2')).toBeVisible();
  // Campo exclusivo da área aparece a partir do registry.
  await expect(page.getByLabel('CNH exigida')).toBeVisible();
  await expect(page.getByLabel('Sistemas, equipamentos e certificações')).toBeVisible();

  await page.getByRole('button', { name: 'Gerar Descrição' }).click();
  await expect(page.getByText(/\d+ palavras/)).toBeVisible();
});

test('aviso de conformidade aparece sem bloquear a geração', async ({ page }) => {
  await mockRegistry(page);
  await page.route('**/api/gerar-vaga', (route) =>
    route.fulfill({
      status: 200,
      headers: { 'content-type': 'text/event-stream; charset=utf-8' },
      body: SSE_BODY,
    }),
  );

  await page.goto('/');
  await page.getByRole('button', { name: 'Preencher com exemplo' }).click();
  await page.locator('#requisitos').fill('Idade máxima de 30 anos, boa aparência');

  await expect(page.getByRole('status').first()).toContainText(/discrimina/i);

  await page.getByRole('button', { name: 'Gerar Descrição' }).click();
  await expect(page.getByText(/\d+ palavras/)).toBeVisible();
});

test('erro do backend mostra banner com retry', async ({ page }) => {
  await mockRegistry(page);
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

test('falha ao carregar áreas mostra retry no lugar do formulário', async ({ page }) => {
  let tentativas = 0;
  await page.route('**/api/areas', (route) => {
    tentativas += 1;
    if (tentativas === 1) {
      return route.fulfill({ status: 500, contentType: 'application/json', body: '{}' });
    }
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(REGISTRY),
    });
  });

  await page.goto('/');
  await expect(page.getByRole('alert')).toContainText(/não foi possível carregar as áreas/i);

  await page.getByRole('button', { name: 'Tentar novamente' }).click();
  await expect(page.getByText('Passo 1 de 2')).toBeVisible();
});