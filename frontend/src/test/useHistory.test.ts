import { renderHook, act } from '@testing-library/react';
import { useHistory } from '../hooks/useHistory';

const mockStore: Record<string, string> = {};

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

  it('addEntry stores cargo and descricao', () => {
    const { result } = renderHook(() => useHistory());
    act(() => result.current.addEntry('Dev Frontend', 'Descrição da vaga'));
    expect(result.current.entries).toHaveLength(1);
    expect(result.current.entries[0].cargo).toBe('Dev Frontend');
    expect(result.current.entries[0].descricao).toBe('Descrição da vaga');
  });

  it('keeps only last 5 entries', () => {
    const { result } = renderHook(() => useHistory());
    act(() => {
      for (let i = 0; i < 7; i++) result.current.addEntry(`Cargo ${i}`, `Desc ${i}`);
    });
    expect(result.current.entries).toHaveLength(5);
  });

  it('newest entry is first', () => {
    const { result } = renderHook(() => useHistory());
    act(() => {
      result.current.addEntry('Primeiro', 'Desc 1');
      result.current.addEntry('Segundo', 'Desc 2');
    });
    expect(result.current.entries[0].cargo).toBe('Segundo');
  });

  it('persists to localStorage key vagaai_history', () => {
    const { result } = renderHook(() => useHistory());
    act(() => result.current.addEntry('Dev', 'Desc'));
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'vagaai_history',
      expect.stringContaining('Dev'),
    );
  });

  it('clearHistory empties entries', () => {
    const { result } = renderHook(() => useHistory());
    act(() => result.current.addEntry('Dev', 'Desc'));
    act(() => result.current.clearHistory());
    expect(result.current.entries).toHaveLength(0);
  });
});
