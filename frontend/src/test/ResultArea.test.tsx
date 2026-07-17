import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { ResultArea } from '../components/ResultArea';

const TEXT = 'Descrição da vaga gerada pela IA.';

function renderArea(props: Partial<ComponentProps<typeof ResultArea>> = {}) {
  return render(
    <ResultArea
      descricao=""
      isLoading={false}
      onRegenerate={() => {}}
      onCancel={() => {}}
      canRegenerate={true}
      {...props}
    />,
  );
}

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
    renderArea();
    expect(screen.getByText(/preencha o formulário/i)).toBeInTheDocument();
  });

  it('shows spinner when loading without content yet', () => {
    renderArea({ isLoading: true });
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders descricao text when provided', () => {
    renderArea({ descricao: TEXT });
    expect(screen.getByText(TEXT)).toBeInTheDocument();
  });

  it('shows streamed text while still loading', () => {
    renderArea({ descricao: TEXT, isLoading: true });
    expect(screen.getByText(TEXT)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /copiar/i })).toBeDisabled();
  });

  it('replaces Regenerar with Parar while loading', () => {
    renderArea({ descricao: TEXT, isLoading: true });
    expect(screen.queryByRole('button', { name: /regenerar/i })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /parar/i })).toBeInTheDocument();
  });

  it('calls onCancel when Parar clicked during streaming', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    renderArea({ descricao: TEXT, isLoading: true, onCancel });
    await user.click(screen.getByRole('button', { name: /parar/i }));
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('offers Parar in the skeleton state before first chunk', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    renderArea({ isLoading: true, onCancel });
    await user.click(screen.getByRole('button', { name: /parar/i }));
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('announces completion for screen readers', () => {
    renderArea({ descricao: TEXT });
    expect(screen.getByRole('status')).toHaveTextContent(/descrição gerada/i);
  });

  it('shows aviso when provided', () => {
    renderArea({ descricao: TEXT, aviso: 'A descrição atingiu o limite de tamanho.' });
    expect(screen.getByText(/limite de tamanho/i)).toBeInTheDocument();
  });

  it('shows Copiar and Regenerar buttons when content present', () => {
    renderArea({ descricao: TEXT });
    expect(screen.getByRole('button', { name: /copiar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /regenerar/i })).toBeInTheDocument();
  });

  it('calls onRegenerate when Regenerar clicked', async () => {
    const user = userEvent.setup();
    const onRegenerate = vi.fn();
    renderArea({ descricao: TEXT, onRegenerate });
    await user.click(screen.getByRole('button', { name: /regenerar/i }));
    expect(onRegenerate).toHaveBeenCalledOnce();
  });

  it('disables Regenerar when canRegenerate is false', () => {
    renderArea({ descricao: TEXT, canRegenerate: false });
    expect(screen.getByRole('button', { name: /regenerar/i })).toBeDisabled();
  });

  it('copies text to clipboard when Copiar clicked', async () => {
    const user = userEvent.setup();
    const writeText = setupClipboard();
    renderArea({ descricao: TEXT });
    await user.click(screen.getByRole('button', { name: /copiar/i }));
    expect(writeText).toHaveBeenCalledWith(TEXT);
  });

  it('copies plain text without markdown markers', async () => {
    const user = userEvent.setup();
    const writeText = setupClipboard();
    renderArea({ descricao: '**Sobre a Vaga**\n- Item **um**' });
    await user.click(screen.getByRole('button', { name: /copiar/i }));
    expect(writeText).toHaveBeenCalledWith('Sobre a Vaga\n\n• Item um');
  });

  it('shows failure feedback when clipboard write fails', async () => {
    const user = userEvent.setup();
    setupClipboard(vi.fn().mockRejectedValue(new Error('denied')));
    renderArea({ descricao: TEXT });
    await user.click(screen.getByRole('button', { name: /copiar/i }));
    expect(await screen.findByText(/falhou/i)).toBeInTheDocument();
  });
});
