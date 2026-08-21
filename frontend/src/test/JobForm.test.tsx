import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { JobForm } from '../components/JobForm';
import { registryFake } from './fixtures';
import { JobFormData } from '../types';

const noop = vi.fn();

function montar(props: Partial<Parameters<typeof JobForm>[0]> = {}) {
  return render(
    <JobForm registry={registryFake} onSubmit={noop} isLoading={false} {...props} />,
  );
}

/** Preenche o passo 1 e avança. */
async function avancar(user: ReturnType<typeof userEvent.setup>, cargo = 'Analista de Dados') {
  await user.type(screen.getByRole('combobox', { name: /cargo/i }), cargo);
  await user.click(screen.getByRole('radio', { name: /Pleno/ }));
  await user.click(screen.getByRole('button', { name: /continuar/i }));
}

describe('passo 1: identificação', () => {
  beforeEach(() => noop.mockClear());

  it('mostra uma grade de áreas com todas as áreas do registry', () => {
    montar();
    const grupo = screen.getByRole('radiogroup', { name: /área da vaga/i });
    expect(within(grupo).getAllByRole('radio')).toHaveLength(registryFake.areas.length);
    expect(within(grupo).getByRole('radio', { name: /Tecnologia/ })).toBeInTheDocument();
    expect(within(grupo).getByRole('radio', { name: /Logística/ })).toBeInTheDocument();
  });

  it('começa no passo 1 e não mostra os detalhes ainda', () => {
    montar();
    expect(screen.getByText(/passo 1 de 2/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/tipo de contrato/i)).not.toBeInTheDocument();
  });

  it('mostra a escala de senioridade da área selecionada', () => {
    montar();
    const grupo = screen.getByRole('radiogroup', { name: /nível da vaga/i });
    expect(within(grupo).getByRole('radio', { name: /Tech Lead/ })).toBeInTheDocument();
    expect(within(grupo).queryByRole('radio', { name: /Encarregado/ })).not.toBeInTheDocument();
  });

  it('troca a escala de senioridade ao trocar de área', async () => {
    const user = userEvent.setup();
    montar();
    await user.click(screen.getByRole('radio', { name: /Logística/ }));

    const grupo = screen.getByRole('radiogroup', { name: /nível da vaga/i });
    expect(within(grupo).getByRole('radio', { name: /Encarregado/ })).toBeInTheDocument();
    expect(within(grupo).queryByRole('radio', { name: /Tech Lead/ })).not.toBeInTheDocument();
  });

  it('limpa o nível escolhido ao trocar de área, sem deixar estado órfão', async () => {
    const user = userEvent.setup();
    montar();
    await user.click(screen.getByRole('radio', { name: /Pleno/ }));
    expect(screen.getByRole('radio', { name: /Pleno/ })).toHaveAttribute('aria-checked', 'true');

    await user.click(screen.getByRole('radio', { name: /Logística/ }));
    for (const nivel of screen.getAllByRole('radio', { name: /Auxiliar|Encarregado/ })) {
      expect(nivel).toHaveAttribute('aria-checked', 'false');
    }
  });

  it('exige cargo antes de avançar', async () => {
    const user = userEvent.setup();
    montar();
    await user.click(screen.getByRole('button', { name: /continuar/i }));
    expect(screen.getByRole('alert')).toHaveTextContent(/informe o cargo/i);
    expect(screen.getByText(/passo 1 de 2/i)).toBeInTheDocument();
  });

  it('exige nível antes de avançar', async () => {
    const user = userEvent.setup();
    montar();
    await user.type(screen.getByRole('combobox', { name: /cargo/i }), 'Analista');
    await user.click(screen.getByRole('button', { name: /continuar/i }));
    expect(screen.getByRole('alert')).toHaveTextContent(/escolha o nível/i);
  });

  it('pede o nome da área quando a escolha é "Outra área"', async () => {
    const user = userEvent.setup();
    montar();
    await user.click(screen.getByRole('radio', { name: /Outra área/ }));
    expect(screen.getByLabelText(/qual área/i)).toBeInTheDocument();

    await user.type(screen.getByRole('combobox', { name: /cargo/i }), 'Auxiliar de Cozinha');
    await user.click(screen.getByRole('radio', { name: /Auxiliar/ }));
    await user.click(screen.getByRole('button', { name: /continuar/i }));
    expect(screen.getByRole('alert')).toHaveTextContent(/informe o nome da área/i);
  });

  it('sugere os cargos da área e deixa digitar livremente', async () => {
    const user = userEvent.setup();
    montar();
    const cargo = screen.getByRole('combobox', { name: /cargo/i });
    await user.click(cargo);
    await user.click(screen.getByRole('option', { name: 'Analista de Dados' }));
    expect(cargo).toHaveValue('Analista de Dados');

    await user.clear(cargo);
    await user.type(cargo, 'Cargo que não existe na lista');
    expect(cargo).toHaveValue('Cargo que não existe na lista');
  });
});

describe('passo 2: detalhes', () => {
  beforeEach(() => noop.mockClear());

  it('avança para o passo 2 com os obrigatórios preenchidos', async () => {
    const user = userEvent.setup();
    montar();
    await avancar(user);
    expect(screen.getByText(/passo 2 de 2/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tipo de contrato/i)).toBeInTheDocument();
  });

  it('usa o rótulo de skill da área no campo de requisitos', async () => {
    const user = userEvent.setup();
    montar();
    await avancar(user);
    expect(screen.getByLabelText('Stack / tecnologias')).toBeInTheDocument();
  });

  it('não exige responsabilidades nem requisitos para gerar', async () => {
    const user = userEvent.setup();
    montar();
    await avancar(user);
    await user.click(screen.getByRole('button', { name: /gerar descrição/i }));

    expect(noop).toHaveBeenCalledTimes(1);
    const enviado = noop.mock.calls[0][0] as JobFormData;
    expect(enviado.cargo).toBe('Analista de Dados');
    expect(enviado.senioridade).toBe('pleno');
    expect(enviado.responsabilidades).toBeUndefined();
  });

  it('pede cidade e UF só quando a vaga não é remota', async () => {
    const user = userEvent.setup();
    montar();
    await avancar(user);
    expect(screen.queryByLabelText(/cidade/i)).not.toBeInTheDocument();

    await user.click(screen.getByRole('radio', { name: 'Presencial' }));
    expect(screen.getByLabelText(/cidade/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^UF/i)).toBeInTheDocument();
  });

  it('não envia cidade e UF numa vaga remota', async () => {
    const user = userEvent.setup();
    montar();
    await avancar(user);
    await user.click(screen.getByRole('radio', { name: 'Presencial' }));
    await user.type(screen.getByLabelText(/cidade/i), 'Recife');
    await user.click(screen.getByRole('radio', { name: 'Remoto' }));
    await user.click(screen.getByRole('button', { name: /gerar descrição/i }));

    const enviado = noop.mock.calls[0][0] as JobFormData;
    expect(enviado.cidade).toBeUndefined();
    expect(enviado.uf).toBeUndefined();
  });

  it('mostra os campos extras da área e envia os valores marcados', async () => {
    const user = userEvent.setup();
    montar();
    await user.click(screen.getByRole('radio', { name: /Logística/ }));
    await user.type(screen.getByRole('combobox', { name: /cargo/i }), 'Auxiliar de Almoxarifado');
    await user.click(screen.getByRole('radio', { name: /Auxiliar/ }));
    await user.click(screen.getByRole('button', { name: /continuar/i }));

    await user.selectOptions(screen.getByLabelText(/CNH exigida/i), 'd');
    await user.click(screen.getByRole('checkbox', { name: /NR-35/ }));
    await user.click(screen.getByRole('radio', { name: 'Presencial' }));
    await user.type(screen.getByLabelText(/cidade/i), 'Guarulhos');
    await user.selectOptions(screen.getByLabelText(/^UF/i), 'SP');
    await user.click(screen.getByRole('button', { name: /gerar descrição/i }));

    const enviado = noop.mock.calls[0][0] as JobFormData;
    expect(enviado.extras).toEqual({ cnh: 'd', nrs: ['nr-35'] });
    expect(enviado.cidade).toBe('Guarulhos');
    expect(enviado.uf).toBe('SP');
  });

  it('não mostra bloco de campos extras numa área que não declara nenhum', async () => {
    const user = userEvent.setup();
    montar();
    await avancar(user);
    expect(screen.queryByLabelText(/CNH exigida/i)).not.toBeInTheDocument();
  });

  it('esconde os campos de salário quando o recrutador não divulga', async () => {
    const user = userEvent.setup();
    montar();
    await avancar(user);
    expect(screen.queryByLabelText(/salário mínimo/i)).not.toBeInTheDocument();

    await user.click(screen.getByRole('checkbox', { name: /divulgar a faixa salarial/i }));
    await user.type(screen.getByLabelText(/salário mínimo/i), '4000');
    await user.click(screen.getByRole('button', { name: /gerar descrição/i }));

    const enviado = noop.mock.calls[0][0] as JobFormData;
    expect(enviado.salario).toMatchObject({ min: 4000, divulgar: true, periodo: 'mes' });
  });

  it('marca linguagem neutra por padrão', async () => {
    const user = userEvent.setup();
    montar();
    await avancar(user);
    expect(screen.getByRole('checkbox', { name: /linguagem neutra/i })).toBeChecked();
  });

  it('volta ao passo 1 preservando o que foi digitado', async () => {
    const user = userEvent.setup();
    montar();
    await avancar(user);
    await user.click(screen.getByRole('button', { name: /Analista de Dados/ }));
    expect(screen.getByText(/passo 1 de 2/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /cargo/i })).toHaveValue('Analista de Dados');
  });
});

describe('aviso de conformidade', () => {
  beforeEach(() => noop.mockClear());

  it('avisa sobre requisito discriminatório sem bloquear a geração', async () => {
    const user = userEvent.setup();
    montar();
    await avancar(user);
    await user.type(screen.getByLabelText('Stack / tecnologias'), 'Idade máxima de 30, boa aparência');

    expect(screen.getByRole('status')).toHaveTextContent(/discrimina/i);
    await user.click(screen.getByRole('button', { name: /gerar descrição/i }));
    expect(noop).toHaveBeenCalledTimes(1);
  });

  it('não avisa quando o texto está limpo', async () => {
    const user = userEvent.setup();
    montar();
    await avancar(user);
    await user.type(screen.getByLabelText('Stack / tecnologias'), 'React, TypeScript, 3 anos de experiência');
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});

describe('navegação por teclado nos radiogroups', () => {
  beforeEach(() => noop.mockClear());

  function radiosDaArea() {
    return within(screen.getByRole('radiogroup', { name: /área da vaga/i })).getAllByRole('radio');
  }

  // Padrão ARIA: o grupo inteiro é uma parada de Tab, não uma por opção.
  it('o grupo de áreas é uma única parada de Tab', () => {
    montar();
    const focaveis = radiosDaArea().filter((r) => r.tabIndex === 0);
    expect(focaveis).toHaveLength(1);
    expect(radiosDaArea().length).toBeGreaterThan(1);
  });

  it('a parada de Tab acompanha a opção selecionada', async () => {
    const user = userEvent.setup();
    montar();
    await user.click(radiosDaArea()[1]);
    const atual = radiosDaArea();
    expect(atual[1].tabIndex).toBe(0);
    expect(atual[0].tabIndex).toBe(-1);
  });

  it('as setas movem foco e seleção juntos', async () => {
    const user = userEvent.setup();
    montar();
    radiosDaArea()[0].focus();
    await user.keyboard('{ArrowRight}');

    expect(radiosDaArea()[1]).toHaveAttribute('aria-checked', 'true');
    expect(radiosDaArea()[1]).toHaveFocus();

    await user.keyboard('{ArrowLeft}');
    expect(radiosDaArea()[0]).toHaveAttribute('aria-checked', 'true');
  });

  it('a navegação circula nas pontas', async () => {
    const user = userEvent.setup();
    montar();
    radiosDaArea()[0].focus();
    await user.keyboard('{ArrowLeft}');

    const ultimo = radiosDaArea().length - 1;
    expect(radiosDaArea()[ultimo]).toHaveAttribute('aria-checked', 'true');
  });

  it('Home e End vão para as pontas', async () => {
    const user = userEvent.setup();
    montar();
    radiosDaArea()[0].focus();
    await user.keyboard('{End}');
    const ultimo = radiosDaArea().length - 1;
    expect(radiosDaArea()[ultimo]).toHaveAttribute('aria-checked', 'true');

    await user.keyboard('{Home}');
    expect(radiosDaArea()[0]).toHaveAttribute('aria-checked', 'true');
  });

  it('o grupo de senioridade também navega por setas', async () => {
    const user = userEvent.setup();
    montar();
    const niveis = () =>
      within(screen.getByRole('radiogroup', { name: /nível da vaga/i })).getAllByRole('radio');

    niveis()[0].focus();
    await user.keyboard('{ArrowDown}');
    expect(niveis()[1]).toHaveAttribute('aria-checked', 'true');
  });

  it('sem nível escolhido, o Tab entra no primeiro do grupo', () => {
    montar();
    const niveis = within(
      screen.getByRole('radiogroup', { name: /nível da vaga/i }),
    ).getAllByRole('radio');
    expect(niveis[0].tabIndex).toBe(0);
    expect(niveis.every((n) => n.getAttribute('aria-checked') === 'false')).toBe(true);
  });
});

describe('Enter no passo 1', () => {
  beforeEach(() => noop.mockClear());

  // Regressão: o campo cargo fica dentro do <form>, então Enter disparava
  // submit implícito, pulava a validação e mandava senioridade vazia ao backend.
  it('avança em vez de enviar a vaga', async () => {
    const user = userEvent.setup();
    montar();
    await user.type(screen.getByRole('combobox', { name: /cargo/i }), 'Analista de Dados');
    await user.click(screen.getByRole('radio', { name: /Pleno/ }));
    await user.type(screen.getByRole('combobox', { name: /cargo/i }), '{Enter}');

    expect(noop).not.toHaveBeenCalled();
    expect(screen.getByText(/passo 2 de 2/i)).toBeInTheDocument();
  });

  it('mostra o erro em vez de enviar payload sem nível', async () => {
    const user = userEvent.setup();
    montar();
    await user.type(screen.getByRole('combobox', { name: /cargo/i }), 'Analista{Enter}');

    expect(noop).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent(/escolha o nível/i);
  });
});

describe('onFormChange', () => {
  it('reporta o payload atual a cada edição', async () => {
    const user = userEvent.setup();
    const onFormChange = vi.fn();
    render(
      <JobForm
        registry={registryFake}
        onSubmit={noop}
        isLoading={false}
        onFormChange={onFormChange}
      />,
    );
    await user.type(screen.getByRole('combobox', { name: /cargo/i }), 'Analista de Dados');
    await user.click(screen.getByRole('radio', { name: /Pleno/ }));

    const chamadas = onFormChange.mock.calls;
    const ultimo = chamadas[chamadas.length - 1][0] as JobFormData;
    expect(ultimo.cargo).toBe('Analista de Dados');
    expect(ultimo.senioridade).toBe('pleno');
  });

  it('reporta a troca de área já com a senioridade limpa', async () => {
    const user = userEvent.setup();
    const onFormChange = vi.fn();
    render(
      <JobForm
        registry={registryFake}
        onSubmit={noop}
        isLoading={false}
        onFormChange={onFormChange}
      />,
    );
    await user.click(screen.getByRole('radio', { name: /Pleno/ }));
    await user.click(screen.getByRole('radio', { name: /Logística/ }));

    const chamadas = onFormChange.mock.calls;
    const ultimo = chamadas[chamadas.length - 1][0] as JobFormData;
    expect(ultimo.area).toBe('logistica-operacoes');
    expect(ultimo.senioridade).toBe('');
  });
});

describe('troca de área não deixa sobra', () => {
  it('limpa nível, campos extras, local e modalidade', async () => {
    const user = userEvent.setup();
    const onFormChange = vi.fn();
    render(
      <JobForm
        registry={registryFake}
        onSubmit={noop}
        isLoading={false}
        onFormChange={onFormChange}
      />,
    );

    // Monta uma vaga presencial de logística com campo extra preenchido.
    await user.click(screen.getByRole('radio', { name: /Logística/ }));
    await user.type(screen.getByRole('combobox', { name: /cargo/i }), 'Auxiliar de Almoxarifado');
    await user.click(screen.getByRole('radio', { name: /^Auxiliar/ }));
    await user.click(screen.getByRole('button', { name: /continuar/i }));
    await user.click(screen.getByRole('radio', { name: 'Presencial' }));
    await user.type(screen.getByLabelText(/cidade/i), 'Guarulhos');
    await user.selectOptions(screen.getByLabelText(/^UF/i), 'SP');
    await user.selectOptions(screen.getByLabelText(/CNH exigida/i), 'd');

    // Volta ao passo 1 e troca de área.
    await user.click(screen.getByRole('button', { name: /Auxiliar de Almoxarifado/ }));
    await user.click(screen.getByRole('radio', { name: /Tecnologia/ }));

    const chamadas = onFormChange.mock.calls;
    const atual = chamadas[chamadas.length - 1][0] as JobFormData;
    expect(atual.area).toBe('tecnologia');
    expect(atual.senioridade).toBe('');
    expect(atual.extras).toBeUndefined();
    expect(atual.cidade).toBeUndefined();
    expect(atual.uf).toBeUndefined();
    expect(atual.modalidade).toBe('remoto');
  });
});

describe('estados do formulário', () => {
  beforeEach(() => noop.mockClear());

  it('mostra botão desabilitado durante a geração', async () => {
    const user = userEvent.setup();
    const { rerender } = montar();
    await avancar(user);
    rerender(<JobForm registry={registryFake} onSubmit={noop} isLoading={true} />);
    expect(screen.getByRole('button', { name: /gerando/i })).toBeDisabled();
  });

  it('preenche o exemplo e pula direto para os detalhes', async () => {
    const user = userEvent.setup();
    montar();
    await user.click(screen.getByRole('button', { name: /preencher com exemplo/i }));
    expect(screen.getByText(/passo 2 de 2/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/principais responsabilidades/i)).not.toHaveValue('');
  });

  it('abre direto no passo 2 quando recebe dados iniciais', () => {
    montar({
      initialData: {
        area: 'tecnologia',
        cargo: 'Analista de Suporte Técnico',
        senioridade: 'junior',
        modalidade: 'remoto',
        tom: 'moderno',
      },
    });
    expect(screen.getByText(/passo 2 de 2/i)).toBeInTheDocument();
  });
});