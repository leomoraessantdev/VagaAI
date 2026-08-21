import { AreaPublica, Catalogos, ExtraFieldValue, FaixaSalarial, JobFormData, Limites } from '../types';
import { Campo, Chips, Section, inputCls, labelCls, selectCls } from './campos';
import { ExtraFields } from './ExtraFields';
import { useRadioGroup } from '../hooks/useRadioGroup';

interface Props {
  catalogos: Catalogos;
  limites: Limites;
  form: JobFormData;
  area: AreaPublica;
  onChange: <K extends keyof JobFormData>(campo: K, valor: JobFormData[K]) => void;
  onChangeExtra: (id: string, valor: ExtraFieldValue) => void;
}

const SALARIO_PADRAO: FaixaSalarial = { periodo: 'mes', divulgar: false };

function paraNumero(valor: string): number | undefined {
  if (valor.trim() === '') return undefined;
  const n = Number(valor);
  return Number.isFinite(n) && n >= 0 ? Math.round(n) : undefined;
}

function alternar(lista: string[] | undefined, id: string): string[] {
  const atuais = lista ?? [];
  return atuais.includes(id) ? atuais.filter((v) => v !== id) : [...atuais, id];
}

/** Passo 2: tudo opcional. O recrutador preenche só o que tiver em mãos. */
export function PassoDetalhes({ catalogos, limites, form, area, onChange, onChangeExtra }: Props) {
  const salario = form.salario ?? SALARIO_PADRAO;
  const propsDaModalidade = useRadioGroup(
    catalogos.modalidades.map((m) => m.id),
    form.modalidade,
    (id) => onChange('modalidade', id),
  );

  function setSalario(patch: Partial<FaixaSalarial>) {
    onChange('salario', { ...SALARIO_PADRAO, ...form.salario, ...patch });
  }

  return (
    <div className="space-y-7">
      <Section n="03" title="Condições">
        <fieldset>
          <legend className={labelCls}>Modalidade</legend>
          <div role="radiogroup" aria-label="Modalidade" className="grid grid-cols-3 gap-2">
            {catalogos.modalidades.map((opcao, i) => {
              const ativo = form.modalidade === opcao.id;
              return (
                <button
                  key={opcao.id}
                  type="button"
                  {...propsDaModalidade(i)}
                  className={
                    'rounded-lg border py-2 text-sm transition-colors ' +
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
        </fieldset>

        {form.modalidade !== 'remoto' && (
          <div className="grid grid-cols-[1fr_auto] gap-3">
            <Campo id="cidade" label="Cidade *">
              <input
                id="cidade"
                type="text"
                required
                maxLength={limites.cidade}
                placeholder="Ex: Guarulhos"
                value={form.cidade ?? ''}
                onChange={(e) => onChange('cidade', e.target.value)}
                className={inputCls}
              />
            </Campo>
            <Campo id="uf" label="UF *">
              <select
                id="uf"
                required
                value={form.uf ?? ''}
                onChange={(e) => onChange('uf', e.target.value)}
                className={`${selectCls} w-24`}
              >
                <option value="">--</option>
                {catalogos.ufs.map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </select>
            </Campo>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Campo id="contrato" label="Tipo de contrato">
            <select
              id="contrato"
              value={form.contrato ?? ''}
              onChange={(e) => onChange('contrato', e.target.value || undefined)}
              className={selectCls}
            >
              <option value="">Não informar</option>
              {catalogos.contratos.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </Campo>
          <Campo id="jornada" label="Jornada">
            <select
              id="jornada"
              value={form.jornada ?? ''}
              onChange={(e) => onChange('jornada', e.target.value || undefined)}
              className={selectCls}
            >
              <option value="">Não informar</option>
              {catalogos.jornadas.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </Campo>
        </div>

        <fieldset>
          <legend className={labelCls}>Faixa salarial</legend>
          <label className="flex items-center gap-2 text-sm text-ink-soft mb-2.5">
            <input
              type="checkbox"
              checked={salario.divulgar}
              onChange={(e) => setSalario({ divulgar: e.target.checked })}
              className="accent-[var(--color-accent)]"
            />
            Divulgar a faixa salarial na vaga
          </label>
          {salario.divulgar && (
            <div className="grid grid-cols-[1fr_1fr_auto] gap-2">
              <input
                type="number"
                min={0}
                aria-label="Salário mínimo"
                placeholder="De (R$)"
                value={salario.min ?? ''}
                onChange={(e) => setSalario({ min: paraNumero(e.target.value) })}
                className={inputCls}
              />
              <input
                type="number"
                min={0}
                aria-label="Salário máximo"
                placeholder="Até (R$)"
                value={salario.max ?? ''}
                onChange={(e) => setSalario({ max: paraNumero(e.target.value) })}
                className={inputCls}
              />
              <select
                aria-label="Período do salário"
                value={salario.periodo}
                onChange={(e) => setSalario({ periodo: e.target.value })}
                className={`${selectCls} w-28`}
              >
                {catalogos.periodosSalario.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          )}
          {!salario.divulgar && (
            <p className="text-[11px] text-ink-faint leading-snug">
              A vaga sai com &quot;A combinar&quot;.
            </p>
          )}
        </fieldset>

        <Chips
          legenda="Benefícios"
          opcoes={catalogos.beneficios}
          selecionados={form.beneficios ?? []}
          onToggle={(id) => onChange('beneficios', alternar(form.beneficios, id))}
        />

        <Campo
          id="beneficiosExtras"
          label="Outros benefícios"
          contador={{ atual: (form.beneficiosExtras ?? '').length, max: limites.beneficiosExtras }}
        >
          <input
            id="beneficiosExtras"
            type="text"
            maxLength={limites.beneficiosExtras}
            placeholder="Ex: auxílio home office, licença-maternidade estendida"
            value={form.beneficiosExtras ?? ''}
            onChange={(e) => onChange('beneficiosExtras', e.target.value)}
            className={inputCls}
          />
        </Campo>

        <Chips
          legenda="Vaga afirmativa"
          ajuda="A vaga é publicada como prioridade de contratação para esse público, nunca como exclusão."
          opcoes={catalogos.afirmativas}
          selecionados={form.afirmativa ?? []}
          onToggle={(id) => onChange('afirmativa', alternar(form.afirmativa, id))}
        />
      </Section>
      <Section n="04" title="O trabalho">
        <p className="-mt-1 text-[11px] text-ink-faint leading-snug">
          Tudo opcional. O que você deixar em branco, a IA deduz a partir do cargo e do nível.
        </p>

        <Campo
          id="responsabilidades"
          label="Principais responsabilidades"
          contador={{ atual: (form.responsabilidades ?? '').length, max: limites.responsabilidades }}
        >
          <textarea
            id="responsabilidades"
            rows={4}
            maxLength={limites.responsabilidades}
            placeholder="Descreva as principais atividades do cargo..."
            value={form.responsabilidades ?? ''}
            onChange={(e) => onChange('responsabilidades', e.target.value)}
            className={`${inputCls} resize-none`}
          />
        </Campo>

        <Campo
          id="requisitos"
          label={area.skillLabel}
          contador={{ atual: (form.requisitos ?? '').length, max: limites.requisitos }}
        >
          <textarea
            id="requisitos"
            rows={3}
            maxLength={limites.requisitos}
            placeholder={area.skillPlaceholder}
            value={form.requisitos ?? ''}
            onChange={(e) => onChange('requisitos', e.target.value)}
            className={`${inputCls} resize-none`}
          />
        </Campo>

        <Campo
          id="diferenciais"
          label="Diferenciais"
          contador={{ atual: (form.diferenciais ?? '').length, max: limites.diferenciais }}
        >
          <textarea
            id="diferenciais"
            rows={2}
            maxLength={limites.diferenciais}
            placeholder="O que soma, mas não elimina quem não tiver..."
            value={form.diferenciais ?? ''}
            onChange={(e) => onChange('diferenciais', e.target.value)}
            className={`${inputCls} resize-none`}
          />
        </Campo>
      </Section>

      {area.extraFields && area.extraFields.length > 0 && (
        <Section n="05" title={`Específico de ${area.label}`}>
          <ExtraFields
            campos={area.extraFields}
            valores={form.extras ?? {}}
            onChange={onChangeExtra}
          />
        </Section>
      )}

      <Section n="06" title="Empresa e estilo">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
          <Campo id="empresa" label="Empresa">
            <input
              id="empresa"
              type="text"
              maxLength={limites.empresa}
              placeholder="Ex: TechNova"
              value={form.empresa ?? ''}
              onChange={(e) => onChange('empresa', e.target.value)}
              className={inputCls}
            />
          </Campo>
          <Campo
            id="sobreEmpresa"
            label="Sobre a empresa"
            contador={{ atual: (form.sobreEmpresa ?? '').length, max: limites.sobreEmpresa }}
          >
            <input
              id="sobreEmpresa"
              type="text"
              maxLength={limites.sobreEmpresa}
              placeholder="Ex: Rede de farmácias com 40 lojas no interior de SP"
              value={form.sobreEmpresa ?? ''}
              onChange={(e) => onChange('sobreEmpresa', e.target.value)}
              className={inputCls}
            />
          </Campo>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Campo id="tom" label="Tom da descrição">
            <select
              id="tom"
              value={form.tom}
              onChange={(e) => onChange('tom', e.target.value)}
              className={selectCls}
            >
              {catalogos.tons.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </Campo>
          <Campo
            id="plataforma"
            label="Onde vai publicar"
            ajuda="Ajusta só a formatação da saída."
          >
            <select
              id="plataforma"
              value={form.plataforma ?? 'generico'}
              onChange={(e) => onChange('plataforma', e.target.value)}
              className={selectCls}
            >
              {catalogos.plataformas.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </Campo>
        </div>

        <label className="flex items-start gap-2.5 text-sm text-ink-soft">
          <input
            type="checkbox"
            checked={form.linguagemNeutra !== false}
            onChange={(e) => onChange('linguagemNeutra', e.target.checked)}
            className="mt-0.5 accent-[var(--color-accent)]"
          />
          <span>
            Linguagem neutra de gênero
            <span className="block text-[11px] text-ink-faint leading-snug">
              Prefere &quot;profissional&quot; e &quot;pessoa candidata&quot; a formas marcadas.
            </span>
          </span>
        </label>
      </Section>
    </div>
  );
}