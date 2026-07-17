import { useState } from 'react';

const THEME_KEY = 'vagaai_theme';

// O script inline no index.html já aplicou a classe antes do primeiro paint;
// aqui só lemos o estado atual para o botão nascer sincronizado.
function isDark(): boolean {
  return typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
}

export function Header() {
  const [dark, setDark] = useState(isDark);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    try {
      localStorage.setItem(THEME_KEY, next ? 'dark' : 'light');
    } catch {
      // localStorage indisponível (modo privado) — tema vale só para a sessão
    }
  }

  return (
    <header className="border-b border-line">
      <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-ink rounded-lg flex items-center justify-center shrink-0 rotate-3">
            <span className="text-paper font-display font-bold text-lg leading-none -rotate-3">
              V
            </span>
          </div>
          <span className="font-display font-bold text-xl tracking-tight">
            Vaga<span className="text-accent">AI</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-2 font-mono text-[11px] text-ink-faint border border-line rounded-full px-3 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Llama 3.3 via Groq
          </span>
          <button
            onClick={toggleTheme}
            aria-label={dark ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
            title={dark ? 'Tema claro' : 'Tema escuro'}
            className="w-9 h-9 rounded-lg border border-line flex items-center justify-center text-ink-soft hover:text-ink hover:border-line-strong transition-colors"
          >
            {dark ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
