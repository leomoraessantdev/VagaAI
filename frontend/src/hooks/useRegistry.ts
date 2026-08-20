import { useCallback, useEffect, useRef, useState } from 'react';
import { carregarRegistry } from '../lib/api';
import { Registry } from '../types';

interface Estado {
  registry: Registry | null;
  carregando: boolean;
  erro: string;
}

/**
 * Carrega o registry de áreas uma vez por sessão. Sem ele o formulário não
 * tem o que renderizar, então a tela mostra estado de carregando e um botão
 * de tentar de novo em vez de um formulário vazio e sem sentido.
 */
export function useRegistry() {
  const [estado, setEstado] = useState<Estado>({ registry: null, carregando: true, erro: '' });
  const abortRef = useRef<AbortController | null>(null);

  const buscar = useCallback(() => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setEstado({ registry: null, carregando: true, erro: '' });
    carregarRegistry(controller.signal)
      .then((registry) => {
        if (!controller.signal.aborted) setEstado({ registry, carregando: false, erro: '' });
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setEstado({
          registry: null,
          carregando: false,
          erro: err instanceof Error ? err.message : 'Erro ao carregar as áreas.',
        });
      });
  }, []);

  useEffect(() => {
    buscar();
    return () => abortRef.current?.abort();
  }, [buscar]);

  return { ...estado, recarregar: buscar };
}