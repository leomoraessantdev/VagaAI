import { AreaPublica, JobFormData, Limites } from '../types';
import { AreaPicker } from './AreaPicker';
import { CargoCombobox } from './CargoCombobox';
import { Campo, inputCls } from './campos';
import { useRadioGroup } from '../hooks/useRadioGroup';

interface Props {
  areas: AreaPublica[];
  limites: Limites;
  form: JobFormData;
  area: AreaPublica;
  onTrocarArea: (id: string) => void;
  onChange: <K extends keyof JobFormData>(campo: K, valor: JobFormData[K]) => void;
  erro: string;
}

const AREA_LIVRE_ID = 'outra';

/**
 * Passo 1: só o que define a vaga — área, cargo e senioridade. São os três
 * campos obrigatórios; com eles a IA já escreve uma descrição publicável.
 */
export function PassoIdentificacao({
  areas,
  limites,
  form,
  area,
  onTrocarArea,
  onChange,
  erro,
}: Props) {
  const propsDoNivel = useRadioGroup(
    area.seniorityLevels.map((n) => n.id),
    form.senioridade,
    (id) => onChange('senioridade', id),
  );

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-[11px] text-ink-faint uppercase tracking-widest mb-3">
          01 — Qual é a área da vaga?
        </p>
        <AreaPicker areas={areas} selecionada={form.area} onSelect={onTrocarArea} />
      </div>

      {form.area === AREA_LIVRE_ID && (
        <Campo
          id="areaLivre"
          label="Qual área? *"
          ajuda="Escreva o nome da área como o mercado a chama."
          contador={{ atual: (form.areaLivre ?? '').length, max: limites.areaLivre }}
        >
          <input
            id="areaLivre"
            type="text"
            required
            maxLength={limites.areaLivre}
            placeholder="Ex: Gastronomia, Engenharia Civil, Agronegócio"
            value={form.areaLivre ?? ''}
            onChange={(e) => onChange('areaLivre', e.target.value)}
            className={inputCls}
          />
        </Campo>
      )}

      <CargoCombobox
        value={form.cargo}
        onChange={(v) => onChange('cargo', v)}
        sugestoes={area.commonRoles}
        maxLength={limites.cargo}
      />

      <fieldset>
        <legend className="font-mono text-[11px] text-ink-faint uppercase tracking-widest mb-1">
          02 — Nível da vaga *
        </legend>
        <p className="text-[11px] text-ink-faint mb-3 leading-snug">
          Escala usada no mercado brasileiro para {area.label.toLowerCase()}.
        </p>
        <div role="radiogroup" aria-label="Nível da vaga" className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {area.seniorityLevels.map((nivel, i) => {
            const ativo = nivel.id === form.senioridade;
            return (
              <button
                key={nivel.id}
                type="button"
                {...propsDoNivel(i)}
                className={
                  'h-full w-full text-left rounded-lg border px-3.5 py-2.5 transition-colors ' +
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 ' +
                  (ativo ? 'border-accent bg-accent-tint' : 'border-line hover:border-line-strong')
                }
              >
                <span
                  className={
                    'block text-sm font-medium ' + (ativo ? 'text-accent' : 'text-ink')
                  }
                >
                  {nivel.label}
                </span>
                {(nivel.yearsHint || nivel.scopeHint) && (
                  <span className="mt-0.5 block text-[11px] text-ink-faint leading-snug">
                    {[nivel.yearsHint, nivel.scopeHint].filter(Boolean).join(' · ')}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </fieldset>

      {erro && (
        <p role="alert" className="text-sm text-danger">
          {erro}
        </p>
      )}
    </div>
  );
}