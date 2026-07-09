import { HistoryEntry } from '../types';

interface Props {
  entries: HistoryEntry[];
  onSelect: (descricao: string) => void;
  onClear: () => void;
}

function fmtDate(ts: number): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
  }).format(new Date(ts));
}

export function History({ entries, onSelect, onClear }: Props) {
  if (entries.length === 0) return null;

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
          Histórico recente
        </h3>
        <button
          onClick={onClear}
          className="text-xs text-gray-400 hover:text-red-500 transition"
        >
          Limpar
        </button>
      </div>
      <div className="space-y-2">
        {entries.map((entry) => (
          <button
            key={entry.id}
            onClick={() => onSelect(entry.descricao)}
            className="w-full text-left px-3 py-2 rounded-lg border border-gray-200 hover:border-[#1563D3] hover:bg-blue-50 transition group"
          >
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-sm font-medium text-gray-700 group-hover:text-[#1563D3] truncate max-w-[60%]">
                {entry.cargo}
              </span>
              <span className="text-xs text-gray-400 shrink-0">
                {fmtDate(entry.timestamp)}
              </span>
            </div>
            <p className="text-xs text-gray-400 truncate">
              {entry.descricao.slice(0, 80)}...
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
