import { defineConfig, devices } from '@playwright/test';

// E2E roda contra o build de produção (vite preview) com o backend mockado
// via page.route — não precisa de GROQ_API_KEY nem de rede externa.
export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run preview -- --port 4173 --strictPort',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
  },
});
