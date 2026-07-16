import { ReactNode } from 'react';

type Block =
  | { tipo: 'heading'; texto: string }
  | { tipo: 'paragrafo'; texto: string }
  | { tipo: 'lista'; itens: string[] };

/**
 * Divide o subconjunto de markdown que o modelo produz
 * (títulos, negrito e listas) em blocos estruturados.
 */
function parseBlocks(text: string): Block[] {
  const blocks: Block[] = [];
  let bullets: string[] = [];

  function flushBullets() {
    if (bullets.length === 0) return;
    blocks.push({ tipo: 'lista', itens: bullets });
    bullets = [];
  }

  for (const raw of text.split('\n')) {
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
      blocks.push({ tipo: 'heading', texto: heading[1].replace(/\*\*/g, '') });
      continue;
    }

    blocks.push({ tipo: 'paragrafo', texto: line });
  }
  flushBullets();

  return blocks;
}

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

/** Renderiza a descrição como React, estilizada para a área de resultado. */
export function renderDescription(text: string): ReactNode[] {
  return parseBlocks(text).map((block, i) => {
    switch (block.tipo) {
      case 'lista':
        return (
          <ul key={`ul-${i}`} className="space-y-1.5 pl-1">
            {block.itens.map((item, j) => (
              <li key={j} className="flex gap-2.5">
                <span className="text-accent mt-0.5 shrink-0 select-none" aria-hidden>
                  ▪
                </span>
                <span>{renderInline(item)}</span>
              </li>
            ))}
          </ul>
        );
      case 'heading':
        return (
          <h3 key={`h-${i}`} className="font-display font-semibold text-ink text-base mt-5 first:mt-0">
            {block.texto}
          </h3>
        );
      case 'paragrafo':
        return (
          <p key={`p-${i}`} className="leading-relaxed">
            {renderInline(block.texto)}
          </p>
        );
    }
  });
}

function stripBold(text: string): string {
  return text.replace(/\*\*([^*]+)\*\*/g, '$1');
}

/**
 * Versão em texto puro, sem marcadores de markdown — o que vai para o
 * clipboard como text/plain (LinkedIn e afins não renderizam markdown).
 */
export function descriptionToPlainText(text: string): string {
  return parseBlocks(text)
    .map((block) => {
      switch (block.tipo) {
        case 'lista':
          return block.itens.map((item) => `• ${stripBold(item)}`).join('\n');
        case 'heading':
          return block.texto;
        case 'paragrafo':
          return stripBold(block.texto);
      }
    })
    .join('\n\n');
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function inlineHtml(text: string): string {
  return escapeHtml(text).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}

/** Versão em HTML simples — o que vai para o clipboard como text/html. */
export function descriptionToHtml(text: string): string {
  return parseBlocks(text)
    .map((block) => {
      switch (block.tipo) {
        case 'lista':
          return `<ul>${block.itens.map((item) => `<li>${inlineHtml(item)}</li>`).join('')}</ul>`;
        case 'heading':
          return `<h3>${escapeHtml(block.texto)}</h3>`;
        case 'paragrafo':
          return `<p>${inlineHtml(block.texto)}</p>`;
      }
    })
    .join('');
}
