import { useState, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { JobForm } from './components/JobForm';
import { ResultArea } from './components/ResultArea';
import { History } from './components/History';
import { useHistory } from './hooks/useHistory';
import { gerarDescricao, GeracaoCancelada } from './lib/api';
import { HistoryEntry, JobFormData } from './types';

// key força remontagem do JobForm para repopular os campos visíveis.
interface FormSeed {
  key: number;
  data: JobFormData;
}

export default function App() {
  const [descricao, setDescricao] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [aviso, setAviso] = useState('');
  const [lastForm, setLastForm] = useState<JobFormData | null>(null);
  const [formSeed, setFormSeed] = useState<FormSeed | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const seedCount = useRef(0);
  const { entries, addEntry, clearHistory } = useHistory();

  const handleSubmit = useCallback(
    async (data: JobFormData, anterior?: string) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setIsLoading(true);
      setError('');
      setAviso('');
      setLastForm(data);
      setDescricao('');
      try {
        const { texto, truncada } = await gerarDescricao(
          { ...data, anterior },
          setDescricao,
          controller.signal,
        );
        setDescricao(texto);
        if (truncada) {
          setAviso('A descrição atingiu o limite de tamanho e pode ter sido cortada no final.');
        }
        addEntry(data, texto);
      } catch (err) {
        if (err instanceof GeracaoCancelada) {
          // Mantém o texto parcial já transmitido; interromper não é erro.
          setAviso('Geração interrompida.');
        } else {
          setError(err instanceof Error ? err.message : 'Erro desconhecido.');
        }
      } finally {
        setIsLoading(false);
      }
    },
    [addEntry],
  );

  const handleCancel = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const handleRegenerate = useCallback(() => {
    if (lastForm) handleSubmit(lastForm, descricao || undefined);
  }, [lastForm, descricao, handleSubmit]);

  const handleRetry = useCallback(() => {
    if (lastForm) handleSubmit(lastForm);
  }, [lastForm, handleSubmit]);

  const handleSelectHistory = useCallback((entry: HistoryEntry) => {
    setDescricao(entry.descricao);
    setLastForm(entry.form ?? null);
    if (entry.form) {
      seedCount.current += 1;
      setFormSeed({ key: seedCount.current, data: entry.form });
    }
    setError('');
    setAviso('');
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
          Preencha os dados da posição e a IA escreve uma descrição completa, pronta para
          publicar no LinkedIn, Gupy ou Indeed.
        </p>
      </section>

      <main className="flex-1 max-w-6xl mx-auto w-full px-5 pb-16">
        {error && (
          <div
            role="alert"
            className="mb-6 px-4 py-3 bg-danger-tint border border-danger/30 rounded-xl text-danger text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2"
          >
            <span>{error}</span>
            {lastForm && (
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
            <JobForm
              key={formSeed?.key ?? 0}
              initialData={formSeed?.data}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
            <History entries={entries} onSelect={handleSelectHistory} onClear={clearHistory} />
          </div>
          <div
            className="lg:col-span-7 bg-sheet rounded-2xl border border-line shadow-lift lg:min-h-[640px] flex flex-col lg:sticky lg:top-6 animate-fade-up"
            style={{ animationDelay: '0.2s' }}
          >
            <ResultArea
              descricao={descricao}
              isLoading={isLoading}
              onRegenerate={handleRegenerate}
              onCancel={handleCancel}
              canRegenerate={lastForm !== null}
              aviso={aviso || undefined}
            />
          </div>
        </div>
      </main>

      <footer className="border-t border-line">
        <div className="max-w-6xl mx-auto px-5 py-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-mono text-[11px] text-ink-faint">
            VagaAI — projeto open-source
          </span>
          <span className="font-mono text-[11px] text-ink-faint">
            React · TypeScript · Node · Groq
          </span>
        </div>
      </footer>
    </div>
  );
}
