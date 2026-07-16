import { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { JobForm } from './components/JobForm';
import { ResultArea } from './components/ResultArea';
import { History } from './components/History';
import { useHistory } from './hooks/useHistory';
import { gerarDescricao } from './lib/api';
import { HistoryEntry, JobFormData } from './types';

export default function App() {
  const [descricao, setDescricao] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [aviso, setAviso] = useState('');
  const [lastForm, setLastForm] = useState<JobFormData | null>(null);
  const { entries, addEntry, clearHistory } = useHistory();

  const handleSubmit = useCallback(
    async (data: JobFormData, anterior?: string) => {
      setIsLoading(true);
      setError('');
      setAviso('');
      setLastForm(data);
      setDescricao('');
      try {
        const { texto, truncada } = await gerarDescricao({ ...data, anterior }, setDescricao);
        setDescricao(texto);
        if (truncada) {
          setAviso('A descrição atingiu o limite de tamanho e pode ter sido cortada no final.');
        }
        addEntry(data, texto);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido.');
      } finally {
        setIsLoading(false);
      }
    },
    [addEntry],
  );

  const handleRegenerate = useCallback(() => {
    if (lastForm) handleSubmit(lastForm, descricao || undefined);
  }, [lastForm, descricao, handleSubmit]);

  const handleSelectHistory = useCallback((entry: HistoryEntry) => {
    setDescricao(entry.descricao);
    setLastForm(entry.form ?? null);
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
            className="mb-6 px-4 py-3 bg-danger-tint border border-danger/30 rounded-xl text-danger text-sm"
          >
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div
            className="lg:col-span-5 bg-sheet rounded-2xl border border-line shadow-sheet p-6 sm:p-7 animate-fade-up"
            style={{ animationDelay: '0.1s' }}
          >
            <JobForm onSubmit={handleSubmit} isLoading={isLoading} />
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
