import { renderHook, act } from '@testing-library/react';
import { useHistory } from '../hooks/useHistory';
import { JobFormData } from '../types';

const mockStore: Record<string, string> = {};

function makeForm(cargo: string): JobFormData {
  return {
    area: 'tecnologia',
    cargo,
    senioridade: 'pleno',
    modalidade: 'remoto',
    responsabilidades: 'Codar',
    requisitos: 'React',
    tom: 'moderno',
  };
}

beforeEach(() => {
  Object.keys(mockStore).forEach((k) => delete mockStore[k]);
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation((k) => mockStore[k] ?? null);
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation((k, v) => { mockStore[k] = String(v); });
  vi.spyOn(Storage.prototype, 'removeItem').mockImplementation((k) => { delete mockStore[k]; });
});

afterEach(() => vi.restoreAllMocks());

describe('useHistory', () => {
  it('starts empty', () => {
    const { result } = renderHook(() => useHistory());
    expect(result.current.entries).toEqual([]);
  });

  it('addEntry stores cargo, descricao and the full form', () => {
    const { result } = renderHook(() => useHistory());
    const form = makeForm('Dev Frontend');
    act(() => result.current.addEntry(form, 'Descrição da vaga'));
    expect(result.current.entries).toHaveLength(1);
    expect(result.current.entries[0].cargo).toBe('Dev Frontend');
    expect(result.current.entries[0].descricao).toBe('Descrição da vaga');
    expect(result.current.entries[0].form).toEqual(form);
  });

  it('keeps only last 5 entries', () => {
    const { result } = renderHook(() => useHistory());
    act(() => {
      for (let i = 0; i < 7; i++) result.current.addEntry(makeForm(`Cargo ${i}`), `Desc ${i}`);
    });
    expect(result.current.entries).toHaveLength(5);
  });

  it('newest entry is first', () => {
    const { result } = renderHook(() => useHistory());
    act(() => {
      result.current.addEntry(makeForm('Primeiro'), 'Desc 1');
      result.current.addEntry(makeForm('Segundo'), 'Desc 2');
    });
    expect(result.current.entries[0].cargo).toBe('Segundo');
  });

  it('persists to localStorage key vagaai_history', () => {
    const { result } = renderHook(() => useHistory());
    act(() => result.current.addEntry(makeForm('Dev'), 'Desc'));
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'vagaai_history',
      expect.stringContaining('Dev'),
    );
  });

  it('loads legacy entries saved without form', () => {
    mockStore['vagaai_history'] = JSON.stringify([
      { id: '1', cargo: 'Antigo', descricao: 'Desc antiga', timestamp: 1 },
    ]);
    const { result } = renderHook(() => useHistory());
    expect(result.current.entries).toHaveLength(1);
    expect(result.current.entries[0].cargo).toBe('Antigo');
    expect(result.current.entries[0].form).toBeUndefined();
  });

  it('clearHistory empties entries', () => {
    const { result } = renderHook(() => useHistory());
    act(() => result.current.addEntry(makeForm('Dev'), 'Desc'));
    act(() => result.current.clearHistory());
    expect(result.current.entries).toHaveLength(0);
  });
});

describe('migração de entradas antigas', () => {
  const legado = [
    {
      id: '1',
      cargo: 'Desenvolvedor Frontend',
      descricao: 'Descrição antiga da vaga.',
      timestamp: 1,
      form: {
        empresa: 'TechNova',
        cargo: 'Desenvolvedor Frontend',
        area: 'Tecnologia',
        nivel: 'pleno',
        modalidade: 'remoto',
        responsabilidades: 'Codar',
        requisitos: 'React',
        diferenciais: '',
        beneficios: 'VR, VA e plano de saúde',
        tom: 'moderno',
      },
    },
  ];

  it('converte nivel em senioridade e mantém o id do nível', () => {
    mockStore['vagaai_history'] = JSON.stringify(legado);
    const { result } = renderHook(() => useHistory());
    expect(result.current.entries[0].form).toMatchObject({
      area: 'tecnologia',
      senioridade: 'pleno',
      cargo: 'Desenvolvedor Frontend',
    });
  });

  it('move os benefícios em texto livre para beneficiosExtras', () => {
    mockStore['vagaai_history'] = JSON.stringify(legado);
    const { result } = renderHook(() => useHistory());
    expect(result.current.entries[0].form?.beneficiosExtras).toBe('VR, VA e plano de saúde');
  });

  it('descarta string vazia em vez de mandar campo vazio ao backend', () => {
    mockStore['vagaai_history'] = JSON.stringify(legado);
    const { result } = renderHook(() => useHistory());
    expect(result.current.entries[0].form?.diferenciais).toBeUndefined();
  });

  it('força remoto quando a entrada antiga não tem cidade nem UF', () => {
    const presencial = [
      { ...legado[0], form: { ...legado[0].form, modalidade: 'presencial' } },
    ];
    mockStore['vagaai_history'] = JSON.stringify(presencial);
    const { result } = renderHook(() => useHistory());
    expect(result.current.entries[0].form?.modalidade).toBe('remoto');
  });

  it('preserva entrada já no formato novo', () => {
    const novo = [
      {
        id: '2',
        cargo: 'Auxiliar de Almoxarifado',
        descricao: 'Vaga nova.',
        timestamp: 2,
        form: {
          area: 'logistica-operacoes',
          cargo: 'Auxiliar de Almoxarifado',
          senioridade: 'auxiliar',
          modalidade: 'presencial',
          cidade: 'Guarulhos',
          uf: 'SP',
          tom: 'moderno',
        },
      },
    ];
    mockStore['vagaai_history'] = JSON.stringify(novo);
    const { result } = renderHook(() => useHistory());
    expect(result.current.entries[0].form).toMatchObject({
      area: 'logistica-operacoes',
      senioridade: 'auxiliar',
      cidade: 'Guarulhos',
    });
  });

  it('mantém a descrição legível quando o form não é convertível', () => {
    const quebrado = [
      { id: '3', cargo: 'X', descricao: 'Texto sobrevive.', timestamp: 3, form: { lixo: true } },
    ];
    mockStore['vagaai_history'] = JSON.stringify(quebrado);
    const { result } = renderHook(() => useHistory());
    expect(result.current.entries[0].descricao).toBe('Texto sobrevive.');
    expect(result.current.entries[0].form).toBeUndefined();
  });

  it('ignora localStorage corrompido sem quebrar a tela', () => {
    mockStore['vagaai_history'] = '{nao é json';
    const { result } = renderHook(() => useHistory());
    expect(result.current.entries).toEqual([]);
  });

  it('descarta entrada sem descrição', () => {
    mockStore['vagaai_history'] = JSON.stringify([{ id: '4', cargo: 'X', timestamp: 4 }]);
    const { result } = renderHook(() => useHistory());
    expect(result.current.entries).toEqual([]);
  });
});