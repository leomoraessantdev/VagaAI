import { AreaPublica } from '../types';
import { useRadioGroup } from '../hooks/useRadioGroup';

interface Props {
  areas: AreaPublica[];
  selecionada: string;
  onSelect: (id: string) => void;
}

/**
 * Grade de cards em vez de um `<select>` com onze opções: no celular a lista
 * suspensa esconde as áreas e o recrutador não vê o que existe.
 */
export function AreaPicker({ areas, selecionada, onSelect }: Props) {
  const propsDoItem = useRadioGroup(areas.map((a) => a.id), selecionada, onSelect);

  return (
    <fieldset>
      <legend className="sr-only">Área da vaga</legend>
      <div
        role="radiogroup"
        aria-label="Área da vaga"
        className="grid grid-cols-2 sm:grid-cols-3 gap-2.5"
      >
        {areas.map((area, i) => {
          const ativo = area.id === selecionada;
          return (
            <button
              key={area.id}
              type="button"
              {...propsDoItem(i)}
              title={area.descricao}
              className={
                'text-left rounded-xl border p-3 transition-colors focus:outline-none ' +
                'focus-visible:ring-2 focus-visible:ring-accent/40 ' +
                (ativo
                  ? 'border-accent bg-accent-tint'
                  : 'border-line hover:border-line-strong bg-sheet')
              }
            >
              <span className="text-xl leading-none block mb-1.5" aria-hidden>
                {area.icon}
              </span>
              <span
                className={
                  'block text-sm font-medium leading-tight ' +
                  (ativo ? 'text-accent' : 'text-ink')
                }
              >
                {area.label}
              </span>
              <span className="mt-1 block text-[11px] text-ink-faint leading-snug">
                {area.descricao}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}