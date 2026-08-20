import { ReactNode } from 'react';

export const inputCls =
  'w-full rounded-lg border border-line-strong bg-sheet px-3 py-2 text-sm text-ink ' +
  'placeholder:text-ink-faint focus:outline-none focus:border-accent focus:ring-2 ' +
  'focus:ring-accent/20 transition-colors';

export const selectCls =
  inputCls +
  ' appearance-none pr-8 bg-no-repeat bg-[right_0.6rem_center] bg-[length:14px] ' +
  'bg-[image:var(--select-arrow)]';

export const labelCls = 'block text-sm font-medium text-ink-soft mb-1';

export function Contador({ atual, max }: { atual: number; max: number }) {
  const perto = atual >= max * 0.9;
  return (
    <span
      className={`font-mono text-[11px] tabular-nums ${perto ? 'text-amber' : 'text-ink-faint'}`}
      aria-hidden
    >
      {atual}/{max}
    </span>
  );
}

interface CampoProps {
  id: string;
  label: string;
  ajuda?: string;
  contador?: { atual: number; max: number };
  children: ReactNode;
}

/** Rótulo, contador opcional e texto de apoio ao redor de um controle. */
export function Campo({ id, label, ajuda, contador, children }: CampoProps) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className={labelCls}>
          {label}
        </label>
        {contador && <Contador atual={contador.atual} max={contador.max} />}
      </div>
      {children}
      {ajuda && <p className="mt-1 text-[11px] text-ink-faint leading-snug">{ajuda}</p>}
    </div>
  );
}

export function Section({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <fieldset className="space-y-4">
      <legend className="flex items-baseline gap-2 mb-3 w-full border-b border-line pb-1.5">
        <span className="font-mono text-[11px] text-accent">{n}</span>
        <span className="font-mono text-[11px] text-ink-faint uppercase tracking-widest">
          {title}
        </span>
      </legend>
      {children}
    </fieldset>
  );
}

interface ChipsProps {
  legenda: string;
  ajuda?: string;
  opcoes: { id: string; label: string }[];
  selecionados: string[];
  onToggle: (id: string) => void;
}

/**
 * Multisseleção em botões em vez de `<select multiple>`: num celular o select
 * múltiplo é praticamente inutilizável, e muito recrutador publica do celular.
 */
export function Chips({ legenda, ajuda, opcoes, selecionados, onToggle }: ChipsProps) {
  return (
    <fieldset>
      <legend className={labelCls}>{legenda}</legend>
      <div className="flex flex-wrap gap-2">
        {opcoes.map((opcao) => {
          const ativo = selecionados.includes(opcao.id);
          return (
            <button
              key={opcao.id}
              type="button"
              role="checkbox"
              aria-checked={ativo}
              onClick={() => onToggle(opcao.id)}
              className={
                'rounded-full border px-3 py-1.5 text-xs transition-colors ' +
                (ativo
                  ? 'border-accent bg-accent-tint text-accent font-medium'
                  : 'border-line-strong text-ink-soft hover:border-ink-faint')
              }
            >
              {opcao.label}
            </button>
          );
        })}
      </div>
      {ajuda && <p className="mt-1.5 text-[11px] text-ink-faint leading-snug">{ajuda}</p>}
    </fieldset>
  );
}