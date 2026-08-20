import { ExtraField, ExtraFieldValue } from '../types';
import { Campo, Chips, inputCls, selectCls } from './campos';

const TEXTO_MAX_PADRAO = 200;

interface Props {
  campos: ExtraField[];
  valores: Record<string, ExtraFieldValue>;
  onChange: (id: string, valor: ExtraFieldValue) => void;
}

function comoTexto(valor: ExtraFieldValue | undefined): string {
  return typeof valor === 'string' ? valor : '';
}

function comoLista(valor: ExtraFieldValue | undefined): string[] {
  return Array.isArray(valor) ? valor : [];
}

/**
 * Renderiza os campos exclusivos da área a partir do `extraFields` do registry.
 * Nenhum campo é codificado aqui: adicionar um campo novo a uma área é editar
 * o arquivo de configuração dela no backend.
 */
export function ExtraFields({ campos, valores, onChange }: Props) {
  return (
    <div className="space-y-4">
      {campos.map((campo) => {
        const id = `extra-${campo.id}`;

        if (campo.tipo === 'multi') {
          return (
            <Chips
              key={campo.id}
              legenda={campo.label}
              ajuda={campo.ajuda}
              opcoes={campo.opcoes}
              selecionados={comoLista(valores[campo.id])}
              onToggle={(opcaoId) => {
                const atuais = comoLista(valores[campo.id]);
                onChange(
                  campo.id,
                  atuais.includes(opcaoId)
                    ? atuais.filter((v) => v !== opcaoId)
                    : [...atuais, opcaoId],
                );
              }}
            />
          );
        }

        if (campo.tipo === 'select') {
          return (
            <Campo key={campo.id} id={id} label={campo.label} ajuda={campo.ajuda}>
              <select
                id={id}
                value={comoTexto(valores[campo.id])}
                onChange={(e) => onChange(campo.id, e.target.value)}
                className={selectCls}
              >
                <option value="">Não informar</option>
                {campo.opcoes.map((opcao) => (
                  <option key={opcao.id} value={opcao.id}>
                    {opcao.label}
                  </option>
                ))}
              </select>
            </Campo>
          );
        }

        if (campo.tipo === 'boolean') {
          return (
            <label key={campo.id} className="flex items-start gap-2.5 text-sm text-ink-soft">
              <input
                id={id}
                type="checkbox"
                checked={valores[campo.id] === true}
                onChange={(e) => onChange(campo.id, e.target.checked)}
                className="mt-0.5 accent-[var(--color-accent)]"
              />
              <span>
                {campo.label}
                {campo.ajuda && (
                  <span className="block text-[11px] text-ink-faint leading-snug">{campo.ajuda}</span>
                )}
              </span>
            </label>
          );
        }

        const max = campo.maxLength ?? TEXTO_MAX_PADRAO;
        const valor = comoTexto(valores[campo.id]);
        return (
          <Campo
            key={campo.id}
            id={id}
            label={campo.label}
            ajuda={campo.ajuda}
            contador={{ atual: valor.length, max }}
          >
            <input
              id={id}
              type="text"
              maxLength={max}
              placeholder={campo.placeholder}
              value={valor}
              onChange={(e) => onChange(campo.id, e.target.value)}
              className={inputCls}
            />
          </Campo>
        );
      })}
    </div>
  );
}