import { useState, useEffect } from 'react';
import { HistoryEntry, JobFormData } from '../types';

const KEY = 'vagaai_history';
const MAX = 5;

/**
 * Converte uma entrada salva pela versão anterior do app (só TI, campo `nivel`,
 * benefícios em texto livre) para o formato atual. Os ids de nível da versão
 * antiga — estagio, junior, pleno, senior — existem tal e qual na escala de
 * tecnologia, então a conversão é direta.
 *
 * Devolve `undefined` quando não dá para converter: a entrada continua no
 * histórico para leitura, só não repopula o formulário.
 */
function migrarForm(bruto: unknown): JobFormData | undefined {
  if (!bruto || typeof bruto !== 'object') return undefined;
  const f = bruto as Record<string, unknown>;

  const texto = (v: unknown): string | undefined =>
    typeof v === 'string' && v.trim() !== '' ? v : undefined;

  // Formato atual: já tem senioridade.
  if (typeof f.senioridade === 'string' && typeof f.area === 'string') {
    return bruto as JobFormData;
  }

  if (typeof f.nivel !== 'string' || typeof f.cargo !== 'string') return undefined;

  const modalidade = typeof f.modalidade === 'string' ? f.modalidade : 'remoto';

  return {
    area: 'tecnologia',
    cargo: f.cargo,
    senioridade: f.nivel,
    // Entradas antigas não guardavam cidade nem UF, e vaga não remota exige as
    // duas. Sem esse dado a única migração que continua válida é remoto.
    modalidade: modalidade === 'remoto' ? modalidade : 'remoto',
    tom: typeof f.tom === 'string' ? f.tom : 'moderno',
    plataforma: 'generico',
    linguagemNeutra: true,
    empresa: texto(f.empresa),
    responsabilidades: texto(f.responsabilidades),
    requisitos: texto(f.requisitos),
    diferenciais: texto(f.diferenciais),
    beneficiosExtras: texto(f.beneficios),
  };
}

function load(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const bruto = JSON.parse(raw) as unknown;
    if (!Array.isArray(bruto)) return [];
    return bruto
      .filter((e): e is Record<string, unknown> => Boolean(e) && typeof e === 'object')
      .map((e) => ({
        id: String(e.id ?? Date.now()),
        cargo: String(e.cargo ?? ''),
        descricao: String(e.descricao ?? ''),
        timestamp: Number(e.timestamp ?? 0),
        form: migrarForm(e.form),
      }))
      .filter((e) => e.descricao !== '');
  } catch {
    return [];
  }
}

export function useHistory() {
  const [entries, setEntries] = useState<HistoryEntry[]>(load);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(entries));
  }, [entries]);

  function addEntry(form: JobFormData, descricao: string) {
    const entry: HistoryEntry = {
      id: Date.now().toString(),
      cargo: form.cargo,
      descricao,
      timestamp: Date.now(),
      form,
    };
    setEntries((prev) => [entry, ...prev].slice(0, MAX));
  }

  function clearHistory() {
    setEntries([]);
  }

  return { entries, addEntry, clearHistory };
}