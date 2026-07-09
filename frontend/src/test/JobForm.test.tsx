import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { JobForm } from '../components/JobForm';

const noop = vi.fn();

describe('JobForm', () => {
  beforeEach(() => noop.mockClear());

  it('renders all labeled fields', () => {
    render(<JobForm onSubmit={noop} isLoading={false} />);
    expect(screen.getByLabelText(/cargo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/área/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nível/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/modalidade/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/responsabilidades/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/requisitos técnicos/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tom/i)).toBeInTheDocument();
  });

  it('shows Gerar Descrição button when not loading', () => {
    render(<JobForm onSubmit={noop} isLoading={false} />);
    expect(screen.getByRole('button', { name: /gerar descrição/i })).toBeInTheDocument();
  });

  it('shows disabled Gerando button when loading', () => {
    render(<JobForm onSubmit={noop} isLoading={true} />);
    const btn = screen.getByRole('button', { name: /gerando/i });
    expect(btn).toBeDisabled();
  });

  it('calls onSubmit with form data', async () => {
    const user = userEvent.setup();
    render(<JobForm onSubmit={noop} isLoading={false} />);

    await user.type(screen.getByLabelText(/cargo/i), 'Dev React');
    await user.type(screen.getByLabelText(/área/i), 'Tech');
    await user.type(screen.getByLabelText(/responsabilidades/i), 'Codar');
    await user.type(screen.getByLabelText(/requisitos técnicos/i), 'React, TS');
    await user.click(screen.getByRole('button', { name: /gerar descrição/i }));

    expect(noop).toHaveBeenCalledWith(
      expect.objectContaining({
        cargo: 'Dev React',
        area: 'Tech',
        responsabilidades: 'Codar',
        requisitos: 'React, TS',
      }),
    );
  });
});
