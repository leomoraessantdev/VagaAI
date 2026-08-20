import { useId, useMemo, useRef, useState } from 'react';
import { inputCls, labelCls } from './campos';

interface Props {
  value: string;
  onChange: (valor: string) => void;
  sugestoes: string[];
  maxLength: number;
  label?: string;
}

/**
 * Combobox de cargo: sugere os cargos comuns da área, mas nunca trava a
 * digitação — o campo é um input de texto normal com uma lista de atalho.
 */
export function CargoCombobox({ value, onChange, sugestoes, maxLength, label = 'Cargo' }: Props) {
  const id = useId();
  const listaId = `${id}-lista`;
  const [aberto, setAberto] = useState(false);
  const [destaque, setDestaque] = useState(-1);
  const fecharTimer = useRef<number | undefined>(undefined);

  const filtradas = useMemo(() => {
    const termo = value.trim().toLowerCase();
    const base = termo
      ? sugestoes.filter((s) => s.toLowerCase().includes(termo))
      : sugestoes;
    return base.slice(0, 8);
  }, [value, sugestoes]);

  const mostrar = aberto && filtradas.length > 0;

  function escolher(sugestao: string) {
    onChange(sugestao);
    setAberto(false);
    setDestaque(-1);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!mostrar) {
      if (e.key === 'ArrowDown') setAberto(true);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setDestaque((d) => (d + 1) % filtradas.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setDestaque((d) => (d <= 0 ? filtradas.length - 1 : d - 1));
    } else if (e.key === 'Enter' && destaque >= 0) {
      e.preventDefault();
      escolher(filtradas[destaque]);
    } else if (e.key === 'Escape') {
      setAberto(false);
      setDestaque(-1);
    }
  }

  return (
    <div className="relative">
      <label htmlFor={id} className={labelCls}>
        {label} *
      </label>
      <input
        id={id}
        type="text"
        required
        maxLength={maxLength}
        autoComplete="off"
        role="combobox"
        aria-expanded={mostrar}
        aria-controls={listaId}
        aria-autocomplete="list"
        placeholder="Digite o cargo ou escolha uma sugestão"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setAberto(true);
          setDestaque(-1);
        }}
        onFocus={() => setAberto(true)}
        onKeyDown={onKeyDown}
        // Fecha depois do clique na sugestão conseguir disparar.
        onBlur={() => {
          fecharTimer.current = window.setTimeout(() => setAberto(false), 120);
        }}
        className={inputCls}
      />

      {mostrar && (
        <ul
          id={listaId}
          role="listbox"
          aria-label="Sugestões de cargo"
          className="absolute z-20 mt-1 w-full max-h-56 overflow-y-auto rounded-lg border border-line-strong bg-sheet shadow-lift py-1"
        >
          {filtradas.map((sugestao, i) => (
            <li key={sugestao}>
              <button
                type="button"
                role="option"
                aria-selected={i === destaque}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  window.clearTimeout(fecharTimer.current);
                  escolher(sugestao);
                }}
                className={
                  'w-full text-left px-3 py-1.5 text-sm transition-colors ' +
                  (i === destaque ? 'bg-accent-tint text-accent' : 'text-ink-soft hover:bg-paper')
                }
              >
                {sugestao}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}