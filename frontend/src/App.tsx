import { useCallback, useReducer, useRef } from 'react';
import { Header } from './components/Header';
import { JobForm } from './components/JobForm';
import { ResultArea } from './components/ResultArea';
import { History } from './components/History';
import { useHistory } from './hooks/useHistory';
import { useRegistry } from './hooks/useRegistry';
import { gerarDescricao, GeracaoCancelada } from './lib/api';
import { HistoryEntry, JobFormData } from './types';
import {
  ESTADO_INICIAL,
  reducerGeracao,
  vagaInalterada,
  vagaParaRegenerar,
} from './state/geracao';

export default function App() {
  const [estado, dispatch] = useReducer(reducerGeracao, ESTADO_INICIAL);
  const { descricao, gerando, erro, aviso, vagaGerada, semente } = estado;
  const abortRef = useRef<AbortController | null>(null);
  const { entries, addEntry, clearHistory } = useHistory();
  const { registry, carregando: carregandoAreas, erro: erroAreas, recarregar } = useRegistry();

  const handleSubmit = useCallback(
    async (data: JobFormData, anterior?: string) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      dispatch({ tipo: 'geracaoIniciada', vaga: data });
      try {
        const { texto, truncada } = await gerarDescricao(
          { ...data, anterior },
          (parcial) => dispatch({ tipo: 'textoRecebido', texto: parcial }),
          controller.signal,
        );
        dispatch({ tipo: 'geracaoConcluida', texto, truncada });
        addEntry(data, texto);
      } catch (err) {
        if (err instanceof GeracaoCancelada) {
          dispatch({ tipo: 'geracaoCancelada' });
        } else {
          dispatch({
            tipo: 'geracaoFalhou',
            erro: err instanceof Error ? err.message : 'Erro desconhecido.',
          });
        }
      }
    },
    [addEntry],
  );

  const handleCancel = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const handleRegenerate = useCallback(() => {
    const alvo = vagaParaRegenerar(estado);
    if (!alvo) return;

    // O prompt só aproveita o começo da versão anterior. Mandar a descrição
    // inteira estourava o limite de corpo do backend e devolvia 413.
    const limite = registry?.limites.anterior ?? 2000;
    const anterior =
      vagaInalterada(estado) && descricao ? descricao.slice(0, limite) : undefined;

    handleSubmit(alvo, anterior);
  }, [estado, descricao, handleSubmit, registry]);

  const handleRetry = useCallback(() => {
    if (vagaGerada) handleSubmit(vagaGerada);
  }, [vagaGerada, handleSubmit]);

  const handleFormChange = useCallback((vaga: JobFormData) => {
    dispatch({ tipo: 'formularioEditado', vaga });
  }, []);

  const handleSelectHistory = useCallback((entry: HistoryEntry) => {
    dispatch({
      tipo: 'historicoSelecionado',
      descricao: entry.descricao,
      vaga: entry.form ?? null,
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <section className="max-w-6xl mx-auto w-full px-5 pt-12 pb-10 animate-fade-up">
        <p className="font-mono text-xs text-accent uppercase tracking-[0.2em] mb-4">
          Gerador de descrições de vagas
        </p>
        <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.05] max-w-3xl">
          Vagas bem escritas contratam <span className="text-accent italic">melhor</span>.
        </h1>
        <p className="mt-5 text-ink-soft text-lg max-w-xl leading-relaxed">
          De qualquer área, para qualquer cargo: informe os detalhes da vaga e a IA cria uma
          descrição profissional, completa e pronta para publicar no LinkedIn, na Gupy e afins.
        </p>
      </section>

      <main className="flex-1 max-w-6xl mx-auto w-full px-5 pb-16">
        {erro && (
          <div
            role="alert"
            className="mb-6 px-4 py-3 bg-danger-tint border border-danger/30 rounded-xl text-danger text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2"
          >
            <span>{erro}</span>
            {vagaGerada && (
              <button
                onClick={handleRetry}
                className="self-start sm:self-auto shrink-0 px-3 py-1 rounded-lg border border-danger/40 font-medium hover:bg-danger hover:text-sheet transition-colors"
              >
                Tentar novamente
              </button>
            )}
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div
            className="lg:col-span-5 bg-sheet rounded-2xl border border-line shadow-sheet p-6 sm:p-7 animate-fade-up"
            style={{ animationDelay: '0.1s' }}
          >
            {carregandoAreas && (
              <div role="status" aria-label="Carregando áreas" className="space-y-3 py-6">
                {['w-1/3', 'w-full', 'w-full', 'w-2/3'].map((w, i) => (
                  <div
                    key={i}
                    className={`h-9 rounded-lg ${w} animate-shimmer bg-[linear-gradient(90deg,var(--color-line)_25%,var(--color-paper)_50%,var(--color-line)_75%)] bg-[length:200%_100%]`}
                  />
                ))}
              </div>
            )}

            {!carregandoAreas && !registry && (
              <div role="alert" className="py-6 text-center space-y-3">
                <p className="text-sm text-ink-soft">
                  {erroAreas || 'Não foi possível carregar as áreas.'}
                </p>
                <button
                  onClick={recarregar}
                  className="px-4 py-2 rounded-lg border border-line-strong text-sm text-ink-soft hover:border-ink hover:text-ink transition-colors"
                >
                  Tentar novamente
                </button>
              </div>
            )}

            {registry && (
              <JobForm
                key={semente?.key ?? 0}
                registry={registry}
                initialData={semente?.data}
                onSubmit={handleSubmit}
                onFormChange={handleFormChange}
                isLoading={gerando}
              />
            )}
            <History entries={entries} onSelect={handleSelectHistory} onClear={clearHistory} />
          </div>
          <div
            className="lg:col-span-7 bg-sheet rounded-2xl border border-line shadow-lift lg:min-h-[640px] flex flex-col lg:sticky lg:top-6 animate-fade-up"
            style={{ animationDelay: '0.2s' }}
          >
            <ResultArea
              descricao={descricao}
              isLoading={gerando}
              onRegenerate={handleRegenerate}
              onCancel={handleCancel}
              canRegenerate={vagaGerada !== null}
              aviso={aviso || undefined}
            />
          </div>
        </div>
      </main>

      <footer className="border-t border-line">
        <div className="max-w-6xl mx-auto px-5 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-mono text-[11px] text-ink-faint">
            VagaAI — projeto open-source
          </span>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[11px] text-ink-faint">
              React · TypeScript · Node · Groq
            </span>
            <div className="flex items-center gap-2">
              <a
                href="https://github.com/leomoraessantdev"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub de Leonardo Moraes"
                title="GitHub"
                className="w-8 h-8 rounded-lg border border-line flex items-center justify-center text-ink-faint hover:text-ink hover:border-line-strong transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/leonardo-moraesdev/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn de Leonardo Moraes"
                title="LinkedIn"
                className="w-8 h-8 rounded-lg border border-line flex items-center justify-center text-ink-faint hover:text-ink hover:border-line-strong transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
