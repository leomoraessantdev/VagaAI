import { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { JobForm } from './components/JobForm';
import { ResultArea } from './components/ResultArea';
import { History } from './components/History';
import { useHistory } from './hooks/useHistory';
import { gerarDescricao } from './lib/api';
import { JobFormData } from './types';

export default function App() {
  const [descricao, setDescricao] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastForm, setLastForm] = useState<JobFormData | null>(null);
  const { entries, addEntry, clearHistory } = useHistory();

  async function handleSubmit(data: JobFormData, seed?: string) {
    setIsLoading(true);
    setError('');
    setLastForm(data);
    try {
      const result = await gerarDescricao({ ...data, seed });
      setDescricao(result);
      addEntry(data.cargo, result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido.');
    } finally {
      setIsLoading(false);
    }
  }

  const handleRegenerate = useCallback(() => {
    if (lastForm) handleSubmit(lastForm, Date.now().toString());
  }, [lastForm]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Dados da Vaga</h2>
            <JobForm onSubmit={handleSubmit} isLoading={isLoading} />
            <History entries={entries} onSelect={setDescricao} onClear={clearHistory} />
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:min-h-[600px] flex flex-col">
            <h2 className="text-lg font-sement text-gray-800 mb-4">Descrição Gerada</h2>
            <ResultArea
              descricao={descricao}
              isLoading={isLoading}
              onRegenerate={handleRegenerate}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
