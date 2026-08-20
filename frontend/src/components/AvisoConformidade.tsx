import { AlertaConformidade } from '../lib/conformidade';

interface Props {
  alertas: AlertaConformidade[];
}

/**
 * Aviso não bloqueante. O recrutador continua livre para gerar a vaga; o
 * modelo já recebe instrução para não reproduzir requisito discriminatório,
 * mas quem escreveu merece saber que escreveu.
 */
export function AvisoConformidade({ alertas }: Props) {
  if (alertas.length === 0) return null;

  return (
    <div
      role="status"
      className="rounded-xl border border-amber/40 bg-amber-tint px-4 py-3 space-y-2.5"
    >
      <p className="text-sm font-medium text-ink flex items-center gap-2">
        <span aria-hidden>⚠</span>
        {alertas.length === 1
          ? 'Um requisito pode configurar discriminação na contratação'
          : `${alertas.length} requisitos podem configurar discriminação na contratação`}
      </p>
      <ul className="space-y-2">
        {alertas.map((alerta) => (
          <li key={alerta.id} className="text-xs text-ink-soft leading-relaxed">
            <span className="font-mono text-[10px] uppercase tracking-wide text-ink-faint">
              {alerta.campo}
            </span>
            <span className="block italic text-ink">&ldquo;{alerta.trecho}&rdquo;</span>
            <span className="block">{alerta.motivo}</span>
          </li>
        ))}
      </ul>
      <p className="text-[11px] text-ink-faint leading-snug">
        Sugerimos reformular. A Lei 9.029/95 proíbe esse tipo de exigência. Você pode gerar a vaga
        assim mesmo — a IA foi instruída a não reproduzir o trecho.
      </p>
    </div>
  );
}