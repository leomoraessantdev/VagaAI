import { useState, FormEvent, ReactNode } from 'react';
import { JobFormData, NivelVaga, Modalidade, TomDescricao } from '../types';

interface Props {
  onSubmit: (data: JobFormData) => void;
  isLoading: boolean;
  initialData?: JobFormData;
}

// Espelho dos limites validados pelo backend (backend/src/routes/gerarVaga.ts).
const MAX_CHARS = {
  cargo: 120,
  area: 120,
  responsabilidades: 3000,
  requisitos: 3000,
  diferenciais: 2000,
  beneficios: 2000,
} as const;

const FORM_VAZIO: JobFormData = {
  cargo: '',
  area: '',
  nivel: 'pleno',
  modalidade: 'remoto',
  responsabilidades: '',
  requisitos: '',
  diferenciais: '',
  beneficios: '',
  tom: 'moderno',
};

const EXEMPLO: JobFormData = {
  cargo: 'Desenvolvedor(a) Front-end Pleno',
  area: 'Tecnologia',
  nivel: 'pleno',
  modalidade: 'remoto',
  responsabilidades:
    'Desenvolver e manter interfaces web em React e TypeScript; ' +
    'implementar protótipos do Figma em colaboração com o time de design; ' +
    'escrever testes automatizados; participar de code reviews e das decisões de arquitetura do front-end.',
  requisitos:
    'Experiência sólida com React, TypeScript e consumo de APIs REST; ' +
    'domínio de HTML, CSS e layout responsivo; familiaridade com Git e integração contínua.',
  diferenciais: 'Next.js, Tailwind CSS, testes com Vitest, experiência com acessibilidade (WCAG).',
  beneficios:
    'Vale refeição e alimentação, plano de saúde e odontológico, auxílio home office, ' +
    'horário flexível, verba anual para cursos e eventos.',
  tom: 'moderno',
};

const inputCls =
  'w-full rounded-lg border border-line-strong bg-sheet px-3 py-2 text-sm text-ink ' +
  'placeholder:text-ink-faint focus:outline-none focus:border-accent focus:ring-2 ' +
  'focus:ring-accent/20 transition-colors';
const selectCls =
  inputCls +
  ' appearance-none pr-8 bg-no-repeat bg-[right_0.6rem_center] bg-[length:14px] ' +
  'bg-[image:var(--select-arrow)]';
const labelCls = 'block text-sm font-medium text-ink-soft mb-1';

function Section({ n, title, children }: { n: string; title: string; children: ReactNode }) {
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

function Contador({ atual, max }: { atual: number; max: number }) {
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

export function JobForm({ onSubmit, isLoading, initialData }: Props) {
  const [form, setForm] = useState<JobFormData>(initialData ?? FORM_VAZIO);

  function set<K extends keyof JobFormData>(k: K, v: JobFormData[K]) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      <div className="flex justify-end -mb-3">
        <button
          type="button"
          onClick={() => setForm(EXEMPLO)}
          className="font-mono text-[11px] text-accent hover:text-accent-deep underline underline-offset-4 decoration-line-strong hover:decoration-accent transition-colors"
        >
          Preencher com exemplo
        </button>
      </div>

      <Section n="01" title="A vaga">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="cargo" className={labelCls}>Cargo *</label>
            <input
              id="cargo"
              type="text"
              required
              maxLength={MAX_CHARS.cargo}
              placeholder="Ex: Desenvolvedor Frontend"
              value={form.cargo}
              onChange={(e) => set('cargo', e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="area" className={labelCls}>Área / Setor *</label>
            <input
              id="area"
              type="text"
              required
              maxLength={MAX_CHARS.area}
              placeholder="Ex: Tecnologia, Marketing"
              value={form.area}
              onChange={(e) => set('area', e.target.value)}
              className={inputCls}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="nivel" className={labelCls}>Nível</label>
            <select
              id="nivel"
              value={form.nivel}
              onChange={(e) => set('nivel', e.target.value as NivelVaga)}
              className={selectCls}
            >
              <option value="estagio">Estágio</option>
              <option value="junior">Júnior</option>
              <option value="pleno">Pleno</option>
              <option value="senior">Sênior</option>
            </select>
          </div>
          <div>
            <label htmlFor="modalidade" className={labelCls}>Modalidade</label>
            <select
              id="modalidade"
              value={form.modalidade}
              onChange={(e) => set('modalidade', e.target.value as Modalidade)}
              className={selectCls}
            >
              <option value="remoto">Remoto</option>
              <option value="hibrido">Híbrido</option>
              <option value="presencial">Presencial</option>
            </select>
          </div>
          <div>
            <label htmlFor="tom" className={labelCls}>Tom</label>
            <select
              id="tom"
              value={form.tom}
              onChange={(e) => set('tom', e.target.value as TomDescricao)}
              className={selectCls}
            >
              <option value="formal">Formal</option>
              <option value="moderno">Moderno</option>
              <option value="descontraido">Descontraído</option>
            </select>
          </div>
        </div>
      </Section>

      <Section n="02" title="O dia a dia">
        <div>
          <div className="flex items-baseline justify-between">
            <label htmlFor="responsabilidades" className={labelCls}>
              Principais Responsabilidades *
            </label>
            <Contador atual={form.responsabilidades.length} max={MAX_CHARS.responsabilidades} />
          </div>
          <textarea
            id="responsabilidades"
            required
            rows={4}
            maxLength={MAX_CHARS.responsabilidades}
            placeholder="Descreva as principais atividades do cargo..."
            value={form.responsabilidades}
            onChange={(e) => set('responsabilidades', e.target.value)}
            className={`${inputCls} resize-none`}
          />
        </div>

        <div>
          <div className="flex items-baseline justify-between">
            <label htmlFor="requisitos" className={labelCls}>Requisitos Técnicos *</label>
            <Contador atual={form.requisitos.length} max={MAX_CHARS.requisitos} />
          </div>
          <textarea
            id="requisitos"
            required
            rows={3}
            maxLength={MAX_CHARS.requisitos}
            placeholder="Liste as habilidades e experiências necessárias..."
            value={form.requisitos}
            onChange={(e) => set('requisitos', e.target.value)}
            className={`${inputCls} resize-none`}
          />
        </div>
      </Section>

      <Section n="03" title="Extras">
        <div>
          <div className="flex items-baseline justify-between">
            <label htmlFor="diferenciais" className={labelCls}>Diferenciais Desejados</label>
            <Contador atual={form.diferenciais.length} max={MAX_CHARS.diferenciais} />
          </div>
          <textarea
            id="diferenciais"
            rows={2}
            maxLength={MAX_CHARS.diferenciais}
            placeholder="Conhecimentos que serão um diferencial..."
            value={form.diferenciais}
            onChange={(e) => set('diferenciais', e.target.value)}
            className={`${inputCls} resize-none`}
          />
        </div>

        <div>
          <div className="flex items-baseline justify-between">
            <label htmlFor="beneficios" className={labelCls}>Benefícios Oferecidos</label>
            <Contador atual={form.beneficios.length} max={MAX_CHARS.beneficios} />
          </div>
          <textarea
            id="beneficios"
            rows={2}
            maxLength={MAX_CHARS.beneficios}
            placeholder="Vale refeição, plano de saúde, home office..."
            value={form.beneficios}
            onChange={(e) => set('beneficios', e.target.value)}
            className={`${inputCls} resize-none`}
          />
        </div>
      </Section>

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
    </form>
  );
}
