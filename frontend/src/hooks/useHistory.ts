import { useState, useEffect } from 'react';
import { HistoryEntry } from '../types';

const KEY = 'vagaai_history';
const MAX = 5;

function load(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
  } catch {
    return [];
  }
}

export function useHistory() {
  const [entries, setEntries] = useState<HistoryEntry[]>(load);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(entries));
  }, [entries]);

  function addEntry(cargo: string, descricao: string) {
    const entry: HistoryEntry = {
      id: Date.now().toString(),
      cargo,
      descricao,
      timestamp: Date.now(),
    };
    setEntries((prev) => [entry, ...prev].slice(0, MAX));
  }

  function clearHistory() {
    setEntries([]);
  }

  return { entries, addEntry, clearHistory };
}
