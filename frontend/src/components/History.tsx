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
    <div className="mt-8">
      <div className="flex items-baseline justify-between border-b border-line pb-1.5 mb-3">
        <h3 className="font-mono text-[11px] text-ink-faint uppercase tracking-widest">
          Histórico recente
        </h3>
        <button
          onClick={onClear}
          className="font-mono text-[11px] text-ink-faint hover:text-danger transition-colors"
        >
          Limpar
        </button>
      </div>
      <div className="space-y-2">
        {entries.map((entry) => (
          <button
            key={entry.id}
            onClick={() => onSelect(entry.descricao)}
            className="w-full text-left px-3.5 py-2.5 rounded-lg border border-line bg-sheet hover:border-accent hover:bg-accent-tint transition-colors group"
          >
            <div className="flex items-center justify-between mb-0.5 gap-2">
              <span className="text-sm font-medium text-ink group-hover:text-accent-deep truncate">
                {entry.cargo}
              </span>
              <span className="font-mono text-[11px] text-ink-faint shrink-0">
                {fmtDate(entry.timestamp)}
              </span>
            </div>
            <p className="text-xs text-ink-faint truncate">
              {entry.descricao.slice(0, 80)}...
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
