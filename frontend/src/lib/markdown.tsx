import { ReactNode } from 'react';

function renderInline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
    const bold = part.match(/^\*\*([^*]+)\*\*$/);
    return bold ? (
      <strong key={i} className="font-semibold text-ink">
        {bold[1]}
      </strong>
    ) : (
      part
    );
  });
}

/**
 * Renderiza o subconjunto de markdown que o modelo produz
 * (títulos, negrito e listas) como HTML estilizado.
 */
export function renderDescription(text: string): ReactNode[] {
  const lines = text.split('\n');
  const blocks: ReactNode[] = [];
  let bullets: string[] = [];

  function flushBullets() {
    if (bullets.length === 0) return;
    blocks.push(
      <ul key={`ul-${blocks.length}`} className="space-y-1.5 pl-1">
        {bullets.map((item, i) => (
          <li key={i} className="flex gap-2.5">
            <span className="text-accent mt-0.5 shrink-0 select-none" aria-hidden>
              ▪
            </span>
            <span>{renderInline(item)}</span>
          </li>
        ))}
      </ul>,
    );
    bullets = [];
  }

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flushBullets();
      continue;
    }

    const bullet = line.match(/^[-*•]\s+(.*)/);
    if (bullet) {
      bullets.push(bullet[1]);
      continue;
    }
    flushBullets();

    const heading = line.match(/^#{1,4}\s+(.*)/) ?? line.match(/^\*\*([^*]+):?\*\*:?$/);
    if (heading) {
      blocks.push(
        <h3
          key={`h-${blocks.length}`}
          className="font-display font-semibold text-ink text-base mt-5 first:mt-0"
        >
          {heading[1].replace(/\*\*/g, '')}
        </h3>,
      );
      continue;
    }

    blocks.push(
      <p key={`p-${blocks.length}`} className="leading-relaxed">
        {renderInline(line)}
      </p>,
    );
  }
  flushBullets();

  return blocks;
}
