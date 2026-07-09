import { useState, FormEvent } from 'react';
import { JobFormData, NivelVaga, Modalidade, TomDescricao } from '../types';

interface Props {
  onSubmit: (data: JobFormData) => void;
  isLoading: boolean;
}

const inputCls =
  'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 ' +
  'focus:outline-none focus:ring-2 focus:ring-[#1563D3] focus:border-transparent transition';
const labelCls = 'block text-sm font-medium text-gray-700 mb-1';

export function JobForm({ onSubmit, isLoading }: Props) {
  const [form, setForm] = useState<JobFormData>({
    cargo: '',
    area: '',
    nivel: 'pleno',
    modalidade: 'remoto',
    responsabilidades: '',
    requisitos: '',
    diferenciais: '',
    beneficios: '',
    tom: 'moderno',
  });

  function set<K extends keyof JobFormData>(k: K, v: JobFormData[K]) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="cargo" className={labelCls}>Cargo *</label>
          <input
            id="cargo"
            type="text"
            required
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
            className={inputCls}
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
            className={inputCls}
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
            className={inputCls}
          >
            <option value="formal">Formal</option>
            <option value="moderno">Moderno</option>
            <option value="descontraido">Descontraído</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="responsabilidades" className={labelCls}>
          Principais Responsabilidades *
        </label>
        <textarea
          id="responsabilidades"
          required
          rows={4}
          placeholder="Descreva as principais atividades do cargo..."
          value={form.responsabilidades}
          onChange={(e) => set('responsabilidades', e.target.value)}
          className={`${inputCls} resize-none`}
        />
      </div>

      <div>
        <label htmlFor="requisitos" className={labelCls}>Requisitos Técnicos *</label>
        <textarea
          id="requisitos"
          required
          rows={3}
          placeholder="Liste as habilidades e experiências necessárias..."
          value={form.requisitos}
          onChange={(e) => set('requisitos', e.target.value)}
          className={`${inputCls} resize-none`}
        />
      </div>

      <div>
        <label htmlFor="diferenciais" className={labelCls}>Diferenciais Desejados</label>
        <textarea
          id="diferenciais"
          rows={2}
          placeholder="Conhecimentos que serão um diferencial..."
          value={form.diferenciais}
          onChange={(e) => set('diferenciais', e.target.value)}
          className={`${inputCls} resize-none`}
        />
      </div>

      <div>
        <label htmlFor="beneficios" className={labelCls}>Benefícios Oferecidos</label>
        <textarea
          id="beneficios"
          rows={2}
          placeholder="Vale refeição, plano de saúde, home office..."
          value={form.beneficios}
          onChange={(e) => set('beneficios', e.target.value)}
          className={`${inputCls} resize-none`}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#1563D3] hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
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
          'Gerar Descrição'
        )}
      </button>
    </form>
  );
}
