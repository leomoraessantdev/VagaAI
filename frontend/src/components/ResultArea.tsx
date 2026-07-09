import { useState } from 'react';

interface Props {
  descricao: string;
  isLoading: boolean;
  onRegenerate: () => void;
}

export function ResultArea({ descricao, isLoading, onRegenerate }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(descricao);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 gap-4">
        <div
          role="status"
          aria-label="Carregando"
          className="w-10 h-10 border-4 border-[#1563D3] border-t-transparent rounded-full animate-spin"
        />
        <p className="text-gray-400 text-sm">Gerando descrição com IA...</p>
      </div>
    );
  }

  if (!descricao) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 text-center px-8 gap-4">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-[#1563D3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-gray-400 text-sm">
          Preencha o formulário ao lado e clique em "Gerar Descrição" para criar sua vaga com IA.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 gap-3">
      <div className="flex gap-2 justify-end">
        <button
          onClick={onRegenerate}
          className="text-sm flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Regenerar
        </button>
        <button
          onClick={handleCopy}
          className="text-sm flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1563D3] text-white hover:bg-blue-700 transition"
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copiar
            </>
          )}
        </button>
      </div>
      <div className="flex-1 bg-gray-50 rounded-lg border border-gray-200 p-4 overflow-y-auto min-h-0">
        <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans leading-relaxed">
          {descricao}
        </pre>
      </div>
    </div>
  );
}
