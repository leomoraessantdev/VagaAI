import { useState } from 'react';
import { renderDescription } from '../lib/markdown';

interface Props {
  descricao: string;
  isLoading: boolean;
  onRegenerate: () => void;
}

const SKELETON_WIDTHS = ['w-2/5', 'w-full', 'w-11/12', 'w-4/5', 'w-1/3', 'w-full', 'w-3/4'];

export function ResultArea({ descricao, isLoading, onRegenerate }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(descricao);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (isLoading) {
    return (
      <div role="status" aria-label="Carregando" className="flex flex-col flex-1 gap-3.5 p-8">
        {SKELETON_WIDTHS.map((w, i) => (
          <div
            key={i}
            className={`h-3.5 rounded ${w} animate-shimmer bg-[linear-gradient(90deg,var(--color-line)_25%,var(--color-paper)_50%,var(--color-line)_75%)] bg-[length:200%_100%]`}
          />
        ))}
        <p className="mt-4 font-mono text-xs text-ink-faint">
          Gerando descrição com IA<span className="animate-pulse">…</span>
        </p>
      </div>
    );
  }

  if (!descricao) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 text-center px-10 py-16 gap-5">
        <div className="w-14 h-14 border border-line-strong border-dashed rounded-xl flex items-center justify-center rotate-3">
          <svg
            className="w-6 h-6 text-ink-faint -rotate-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <p className="text-ink-faint text-sm max-w-xs leading-relaxed">
          Preencha o formulário ao lado e clique em{' '}
          <span className="font-medium text-ink-soft">"Gerar Descrição"</span> para criar sua vaga
          com IA.
        </p>
      </div>
    );
  }

  const words = descricao.trim().split(/\s+/).length;

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex items-center justify-between gap-2 px-5 py-3 border-b border-line">
        <span className="font-mono text-[11px] text-ink-faint uppercase tracking-widest">
          {words} palavras
        </span>
        <div className="flex gap-2">
          <button
            onClick={onRegenerate}
            className="text-sm flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-line-strong text-ink-soft hover:border-ink hover:text-ink transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Regenerar
          </button>
          <button
            onClick={handleCopy}
            className="text-sm flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-accent text-sheet font-medium hover:bg-accent-deep transition-colors"
          >
            {copied ? (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copiado!
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                Copiar
              </>
            )}
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto min-h-0 px-6 sm:px-8 py-6">
        <div className="space-y-3 text-[15px] text-ink-soft">{renderDescription(descricao)}</div>
      </div>
    </div>
  );
}
