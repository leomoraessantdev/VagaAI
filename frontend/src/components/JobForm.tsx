import { FormEvent, useMemo, useState } from 'react';
import { AreaPublica, ExtraFieldValue, JobFormData, Registry } from '../types';
import { PassoIdentificacao } from './PassoIdentificacao';
import { PassoDetalhes } from './PassoDetalhes';
import { AvisoConformidade } from './AvisoConformidade';
import { verificarConformidade } from '../lib/conformidade';

interface Props {
  registry: Registry;
  onSubmit: (data: JobFormData) => void;
  isLoading: boolean;
  initialData?: JobFormData;
}

const AREA_LIVRE_ID = 'outra';

function formVazio(registry: Registry): JobFormData {
  return {
    area: registry.areas[0].id,
    cargo: '',
    // Vazio de propósito: cada área tem escala própria, então o nível é sempre
    // uma escolha explícita do recrutador.
    senioridade: '',
    modalidade: 'remoto',
    tom: 'moderno',
    plataforma: 'generico',
    linguagemNeutra: true,
  };
}

function exemplo(registry: Registry): JobFormData {
  const temTecnologia = registry.areas.some((a) => a.id === 'tecnologia');
  return {
    ...formVazio(registry),
    area: temTecnologia ? 'tecnologia' : registry.areas[0].id,
    senioridade: 'pleno',
    cargo: 'Desenvolvedor(a) Front-end',
    empresa: 'TechNova',
    sobreEmpresa: 'Produto de gestão para clínicas, 80 pessoas, sede em Curitiba.',
    modalidade: 'remoto',
    contrato: 'clt',
    jornada: 'integral',
    beneficios: ['vale-refeicao', 'vale-alimentacao', 'plano-saude', 'plano-odontologico'],
    responsabilidades:
      'Desenvolver e manter interfaces web em React e TypeScript; implementar protótipos do Figma ' +
      'junto ao time de design; escrever testes automatizados; participar de code reviews e das ' +
      'decisões de arquitetura do front-end.',
    requisitos:
      'Experiência sólida com React, TypeScript e consumo de APIs REST; domínio de HTML, CSS e ' +
      'layout responsivo; familiaridade com Git e integração contínua.',
    diferenciais: 'Next.js, Tailwind CSS, testes com Vitest, experiência com acessibilidade (WCAG).',
  };
}

/** Tira do payload o que o backend trata como ausente. */
function paraEnvio(form: JobFormData): JobFormData {
  const limpo: JobFormData = { ...form };

  if (limpo.modalidade === 'remoto') {
    delete limpo.cidade;
    delete limpo.uf;
  }
  if (limpo.area !== AREA_LIVRE_ID) delete limpo.areaLivre;
  if (!limpo.uf) delete limpo.uf;

  if (limpo.extras) {
    const extras = Object.entries(limpo.extras).filter(([, valor]) => {
      if (typeof valor === 'string') return valor.trim() !== '';
      if (Array.isArray(valor)) return valor.length > 0;
      return valor === true;
    });
    if (extras.length > 0) limpo.extras = Object.fromEntries(extras);
    else delete limpo.extras;
  }

  if (limpo.beneficios?.length === 0) delete limpo.beneficios;
  if (limpo.afirmativa?.length === 0) delete limpo.afirmativa;

  return limpo;
}

export function JobForm({ registry, onSubmit, isLoading, initialData }: Props) {
  const [form, setForm] = useState<JobFormData>(initialData ?? formVazio(registry));
  const [passo, setPasso] = useState<1 | 2>(initialData ? 2 : 1);
  const [erroPasso1, setErroPasso1] = useState('');

  const area: AreaPublica = useMemo(
    () => registry.areas.find((a) => a.id === form.area) ?? registry.areas[0],
    [registry.areas, form.area],
  );

  const alertas = useMemo(
    () =>
      verificarConformidade([
        { campo: 'Responsabilidades', valor: form.responsabilidades },
        { campo: area.skillLabel, valor: form.requisitos },
        { campo: 'Diferenciais', valor: form.diferenciais },
        { campo: 'Sobre a empresa', valor: form.sobreEmpresa },
        { campo: 'Outros benefícios', valor: form.beneficiosExtras },
      ]),
    [form.responsabilidades, form.requisitos, form.diferenciais, form.sobreEmpresa, form.beneficiosExtras, area.skillLabel],
  );

  function set<K extends keyof JobFormData>(campo: K, valor: JobFormData[K]) {
    setForm((anterior) => ({ ...anterior, [campo]: valor }));
  }

  /** Trocar de área invalida nível e campos extras: eles pertencem à área antiga. */
  function trocarArea(id: string) {
    setErroPasso1('');
    setForm((anterior) => ({
      ...anterior,
      area: id,
      senioridade: '',
      extras: undefined,
      areaLivre: id === AREA_LIVRE_ID ? anterior.areaLivre : undefined,
    }));
  }

  function setExtra(id: string, valor: ExtraFieldValue) {
    setForm((anterior) => ({ ...anterior, extras: { ...anterior.extras, [id]: valor } }));
  }

  function avancar() {
    if (!form.cargo.trim()) return setErroPasso1('Informe o cargo da vaga.');
    if (form.area === AREA_LIVRE_ID && !form.areaLivre?.trim()) {
      return setErroPasso1('Informe o nome da área.');
    }
    if (!form.senioridade) return setErroPasso1('Escolha o nível da vaga.');
    setErroPasso1('');
    setPasso(2);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit(paraEnvio(form));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5" aria-label={`Passo ${passo} de 2`}>
          {[1, 2].map((n) => (
            <span
              key={n}
              className={`h-1 w-8 rounded-full ${n <= passo ? 'bg-accent' : 'bg-line'}`}
              aria-hidden
            />
          ))}
          <span className="ml-1.5 font-mono text-[11px] text-ink-faint whitespace-nowrap">
            Passo {passo} de 2
          </span>
        </div>
        {passo === 1 && (
          <button
            type="button"
            onClick={() => {
              setForm(exemplo(registry));
              setErroPasso1('');
              setPasso(2);
            }}
            className="font-mono text-[11px] text-accent hover:text-accent-deep underline underline-offset-4 decoration-line-strong hover:decoration-accent transition-colors text-right shrink-0"
          >
            Preencher com exemplo
          </button>
        )}
      </div>

      {passo === 1 ? (
        <>
          <PassoIdentificacao
            areas={registry.areas}
            limites={registry.limites}
            form={form}
            area={area}
            onTrocarArea={trocarArea}
            onChange={set}
            erro={erroPasso1}
          />
          <button
            type="button"
            onClick={avancar}
            className="w-full bg-ink hover:bg-accent-deep text-sheet font-display font-semibold py-3.5 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 group"
          >
            Continuar
            <span className="transition-transform group-hover:translate-x-1" aria-hidden>
              →
            </span>
          </button>
        </>
      ) : (
        <>
          <button
            type="button"
            onClick={() => setPasso(1)}
            className="font-mono text-[11px] text-ink-faint hover:text-ink transition-colors"
          >
            ← {area.icon} {area.label} · {form.cargo || 'sem cargo'}
          </button>

          <PassoDetalhes
            catalogos={registry.catalogos}
            limites={registry.limites}
            form={form}
            area={area}
            onChange={set}
            onChangeExtra={setExtra}
          />

          <AvisoConformidade alertas={alertas} />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-ink hover:bg-accent-deep disabled:bg-ink-faint disabled:cursor-not-allowed text-sheet font-display font-semibold py-3.5 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 group"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Gerando...
              </>
            ) : (
              <>
                Gerar Descrição
                <span className="transition-transform group-hover:translate-x-1" aria-hidden>
                  →
                </span>
              </>
            )}
          </button>
        </>
      )}
    </form>
  );
}