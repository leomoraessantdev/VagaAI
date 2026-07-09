import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ResultArea } from '../components/ResultArea';

const TEXT = 'Descrição da vaga gerada pela IA.';

describe('ResultArea', () => {
  it('shows placeholder when no content', () => {
    render(<ResultArea descricao="" isLoading={false} onRegenerate={() => {}} />);
    expect(screen.getByText(/preencha o formulário/i)).toBeInTheDocument();
  });

  it('shows spinner when loading', () => {
    render(<ResultArea descricao="" isLoading={true} onRegenerate={() => {}} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders descricao text when provided', () => {
    render(<ResultArea descricao={TEXT} isLoading={false} onRegenerate={() => {}} />);
    expect(screen.getByText(TEXT)).toBeInTheDocument();
  });

  it('shows Copiar and Regenerar buttons when content present', () => {
    render(<ResultArea descricao={TEXT} isLoading={false} onRegenerate={() => {}} />);
    expect(screen.getByRole('button', { name: /copiar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /regenerar/i })).toBeInTheDocument();
  });

  it('calls onRegenerate when Regenerar clicked', async () => {
    const user = userEvent.setup();
    const onRegenerate = vi.fn();
    render(<ResultArea descricao={TEXT} isLoading={false} onRegenerate={onRegenerate} />);
    await user.click(screen.getByRole('button', { name: /regenerar/i }));
    expect(onRegenerate).toHaveBeenCalledOnce();
  });

  it('copies text to clipboard when Copiar clicked', async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      writable: true,
    });
    render(<ResultArea descricao={TEXT} isLoading={false} onRegenerate={() => {}} />);
    await user.click(screen.getByRole('button', { name: /copiar/i }));
    expect(writeText).toHaveBeenCalledWith(TEXT);
  });
});
