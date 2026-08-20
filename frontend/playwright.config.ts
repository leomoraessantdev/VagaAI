import { defineConfig, devices } from '@playwright/test';

// E2E roda contra o build de produção (vite preview) com o backend mockado
// via page.route — não precisa de GROQ_API_KEY nem de rede externa.
// Porta configurável: 4173 costuma estar ocupada por outro projeto na máquina.
const PORT = process.env.E2E_PORT ?? '4173';

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `npm run preview -- --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
  },
});
