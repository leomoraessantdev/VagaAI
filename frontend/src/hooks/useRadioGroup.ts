import { KeyboardEvent, useRef } from 'react';

interface PropsDoItem {
  ref: (el: HTMLButtonElement | null) => void;
  role: 'radio';
  'aria-checked': boolean;
  tabIndex: number;
  onClick: () => void;
  onKeyDown: (e: KeyboardEvent<HTMLButtonElement>) => void;
}

/**
 * Radiogroup navegável por teclado, como manda o padrão ARIA: o grupo inteiro
 * é uma única parada de Tab e as setas movem foco e seleção juntos.
 *
 * Sem isso, escolher a área custava onze paradas de Tab e as setas não faziam
 * nada — funcionava no mouse e atrapalhava quem usa teclado ou leitor de tela.
 */
export function useRadioGroup(
  ids: string[],
  selecionado: string,
  onSelect: (id: string) => void,
) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  // Sem nada selecionado (ou com valor de outra área), o Tab entra no primeiro.
  const indiceSelecionado = ids.indexOf(selecionado);
  const indiceComFoco = indiceSelecionado >= 0 ? indiceSelecionado : 0;

  function irPara(alvo: number) {
    if (ids.length === 0) return;
    const i = ((alvo % ids.length) + ids.length) % ids.length;
    onSelect(ids[i]);
    refs.current[i]?.focus();
  }

  return function propsDoItem(indice: number): PropsDoItem {
    return {
      ref: (el) => {
        refs.current[indice] = el;
      },
      role: 'radio',
      'aria-checked': ids[indice] === selecionado,
      tabIndex: indice === indiceComFoco ? 0 : -1,
      onClick: () => onSelect(ids[indice]),
      onKeyDown: (e) => {
        switch (e.key) {
          case 'ArrowRight':
          case 'ArrowDown':
            e.preventDefault();
            irPara(indice + 1);
            break;
          case 'ArrowLeft':
          case 'ArrowUp':
            e.preventDefault();
            irPara(indice - 1);
            break;
          case 'Home':
            e.preventDefault();
            irPara(0);
            break;
          case 'End':
            e.preventDefault();
            irPara(ids.length - 1);
            break;
          case ' ':
            e.preventDefault();
            onSelect(ids[indice]);
            break;
        }
      },
    };
  };
}