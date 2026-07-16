import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ResultArea } from '../components/ResultArea';

const TEXT = 'Descrição da vaga gerada pela IA.';

function setupClipboard(writeText = vi.fn().mockResolvedValue(undefined)) {
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText },
    writable: true,
    configurable: true,
  });
  return writeText;
}

describe('ResultArea', () => {
  it('shows placeholder when no content', () => {
    render(
      <ResultArea descricao="" isLoading={false} onRegenerate={() => {}} canRegenerate={true} />,
    );
    expect(screen.getByText(/preencha o formulário/i)).toBeInTheDocument();
  });

  it('shows spinner when loading without content yet', () => {
    render(
      <ResultArea descricao="" isLoading={true} onRegenerate={() => {}} canRegenerate={true} />,
    );
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders descricao text when provided', () => {
    render(
      <ResultArea descricao={TEXT} isLoading={false} onRegenerate={() => {}} canRegenerate={true} />,
    );
    expect(screen.getByText(TEXT)).toBeInTheDocument();
  });

  it('shows streamed text while still loading', () => {
    render(
      <ResultArea descricao={TEXT} isLoading={true} onRegenerate={() => {}} canRegenerate={true} />,
    );
    expect(screen.getByText(TEXT)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /copiar/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /regenerar/i })).toBeDisabled();
  });

  it('announces completion for screen readers', () => {
    render(
      <ResultArea descricao={TEXT} isLoading={false} onRegenerate={() => {}} canRegenerate={true} />,
    );
    expect(screen.getByRole('status')).toHaveTextContent(/descrição gerada/i);
  });

  it('shows aviso when provided', () => {
    render(
      <ResultArea
        descricao={TEXT}
        isLoading={false}
        onRegenerate={() => {}}
        canRegenerate={true}
        aviso="A descrição atingiu o limite de tamanho."
      />,
    );
    expect(screen.getByText(/limite de tamanho/i)).toBeInTheDocument();
  });

  it('shows Copiar and Regenerar buttons when content present', () => {
    render(
      <ResultArea descricao={TEXT} isLoading={false} onRegenerate={() => {}} canRegenerate={true} />,
    );
    expect(screen.getByRole('button', { name: /copiar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /regenerar/i })).toBeInTheDocument();
  });

  it('calls onRegenerate when Regenerar clicked', async () => {
    const user = userEvent.setup();
    const onRegenerate = vi.fn();
    render(
      <ResultArea
        descricao={TEXT}
        isLoading={false}
        onRegenerate={onRegenerate}
        canRegenerate={true}
      />,
    );
    await user.click(screen.getByRole('button', { name: /regenerar/i }));
    expect(onRegenerate).toHaveBeenCalledOnce();
  });

  it('disables Regenerar when canRegenerate is false', () => {
    render(
      <ResultArea descricao={TEXT} isLoading={false} onRegenerate={() => {}} canRegenerate={false} />,
    );
    expect(screen.getByRole('button', { name: /regenerar/i })).toBeDisabled();
  });

  it('copies text to clipboard when Copiar clicked', async () => {
    const user = userEvent.setup();
    const writeText = setupClipboard();
    render(
      <ResultArea descricao={TEXT} isLoading={false} onRegenerate={() => {}} canRegenerate={true} />,
    );
    await user.click(screen.getByRole('button', { name: /copiar/i }));
    expect(writeText).toHaveBeenCalledWith(TEXT);
  });

  it('copies plain text without markdown markers', async () => {
    const user = userEvent.setup();
    const writeText = setupClipboard();
    render(
      <ResultArea
        descricao={'**Sobre a Vaga**\n- Item **um**'}
        isLoading={false}
        onRegenerate={() => {}}
        canRegenerate={true}
      />,
    );
    await user.click(screen.getByRole('button', { name: /copiar/i }));
    expect(writeText).toHaveBeenCalledWith('Sobre a Vaga\n\n• Item um');
  });

  it('shows failure feedback when clipboard write fails', async () => {
    const user = userEvent.setup();
    setupClipboard(vi.fn().mockRejectedValue(new Error('denied')));
    render(
      <ResultArea descricao={TEXT} isLoading={false} onRegenerate={() => {}} canRegenerate={true} />,
    );
    await user.click(screen.getByRole('button', { name: /copiar/i }));
    expect(await screen.findByText(/falhou/i)).toBeInTheDocument();
  });
});
