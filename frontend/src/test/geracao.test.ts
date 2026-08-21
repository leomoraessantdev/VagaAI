import {
  ESTADO_INICIAL,
  reducerGeracao,
  vagaInalterada,
  vagaParaRegenerar,
} from '../state/geracao';
import { JobFormData } from '../types';

const vagaLogistica: JobFormData = {
  area: 'logistica-operacoes',
  cargo: 'Auxiliar de Almoxarifado',
  senioridade: 'auxiliar',
  modalidade: 'presencial',
  cidade: 'Guarulhos',
  uf: 'SP',
  tom: 'moderno',
};

const vagaTi: JobFormData = {
  area: 'tecnologia',
  cargo: 'Desenvolvedor Júnior',
  senioridade: 'junior',
  modalidade: 'remoto',
  tom: 'moderno',
};

describe('ciclo de geração', () => {
  it('limpa erro, aviso e texto ao iniciar', () => {
    const sujo = {
      ...ESTADO_INICIAL,
      erro: 'algo quebrou',
      aviso: 'algum aviso',
      descricao: 'texto velho',
    };
    const e = reducerGeracao(sujo, { tipo: 'geracaoIniciada', vaga: vagaTi });

    expect(e.gerando).toBe(true);
    expect(e.erro).toBe('');
    expect(e.aviso).toBe('');
    expect(e.descricao).toBe('');
    expect(e.vagaGerada).toBe(vagaTi);
  });

  it('acumula o texto que chega pelo streaming', () => {
    let e = reducerGeracao(ESTADO_INICIAL, { tipo: 'geracaoIniciada', vaga: vagaTi });
    e = reducerGeracao(e, { tipo: 'textoRecebido', texto: 'Desenvolvedor' });
    e = reducerGeracao(e, { tipo: 'textoRecebido', texto: 'Desenvolvedor Júnior' });

    expect(e.descricao).toBe('Desenvolvedor Júnior');
    expect(e.gerando).toBe(true);
  });

  it('avisa quando a descrição sai truncada', () => {
    let e = reducerGeracao(ESTADO_INICIAL, { tipo: 'geracaoIniciada', vaga: vagaTi });
    e = reducerGeracao(e, { tipo: 'geracaoConcluida', texto: 'pronto', truncada: true });

    expect(e.gerando).toBe(false);
    expect(e.aviso).toMatch(/cortada no final/i);
  });

  it('não avisa nada quando a descrição sai inteira', () => {
    let e = reducerGeracao(ESTADO_INICIAL, { tipo: 'geracaoIniciada', vaga: vagaTi });
    e = reducerGeracao(e, { tipo: 'geracaoConcluida', texto: 'pronto', truncada: false });

    expect(e.aviso).toBe('');
    expect(e.descricao).toBe('pronto');
  });

  // Interromper é escolha do usuário, não falha: o texto parcial fica na tela.
  it('preserva o texto parcial ao cancelar e não trata como erro', () => {
    let e = reducerGeracao(ESTADO_INICIAL, { tipo: 'geracaoIniciada', vaga: vagaTi });
    e = reducerGeracao(e, { tipo: 'textoRecebido', texto: 'metade do texto' });
    e = reducerGeracao(e, { tipo: 'geracaoCancelada' });

    expect(e.gerando).toBe(false);
    expect(e.descricao).toBe('metade do texto');
    expect(e.erro).toBe('');
    expect(e.aviso).toMatch(/interrompida/i);
  });

  it('registra a falha e para de gerar', () => {
    let e = reducerGeracao(ESTADO_INICIAL, { tipo: 'geracaoIniciada', vaga: vagaTi });
    e = reducerGeracao(e, { tipo: 'geracaoFalhou', erro: 'Servidor fora do ar.' });

    expect(e.gerando).toBe(false);
    expect(e.erro).toBe('Servidor fora do ar.');
  });

  it('mantém a vaga gerada depois da falha, para o botão de tentar de novo', () => {
    let e = reducerGeracao(ESTADO_INICIAL, { tipo: 'geracaoIniciada', vaga: vagaTi });
    e = reducerGeracao(e, { tipo: 'geracaoFalhou', erro: 'boom' });

    expect(e.vagaGerada).toBe(vagaTi);
  });
});

describe('qual vaga o Regenerar envia', () => {
  // Regressão do bug relatado: o Regenerar reenviava a vaga anterior.
  it('usa o formulário atual, não a última vaga gerada', () => {
    let e = reducerGeracao(ESTADO_INICIAL, { tipo: 'geracaoIniciada', vaga: vagaLogistica });
    e = reducerGeracao(e, { tipo: 'geracaoConcluida', texto: 'vaga de almoxarifado', truncada: false });
    e = reducerGeracao(e, { tipo: 'formularioEditado', vaga: vagaTi });

    expect(vagaParaRegenerar(e)).toBe(vagaTi);
  });

  it('não pede variação quando a vaga mudou', () => {
    let e = reducerGeracao(ESTADO_INICIAL, { tipo: 'geracaoIniciada', vaga: vagaLogistica });
    e = reducerGeracao(e, { tipo: 'formularioEditado', vaga: vagaTi });

    expect(vagaInalterada(e)).toBe(false);
  });

  it('pede variação quando a vaga é a mesma', () => {
    let e = reducerGeracao(ESTADO_INICIAL, { tipo: 'geracaoIniciada', vaga: vagaTi });
    e = reducerGeracao(e, { tipo: 'formularioEditado', vaga: { ...vagaTi } });

    expect(vagaInalterada(e)).toBe(true);
  });

  it('cai na última vaga gerada enquanto o formulário não reportou', () => {
    const e = reducerGeracao(ESTADO_INICIAL, { tipo: 'geracaoIniciada', vaga: vagaTi });
    expect(vagaParaRegenerar(e)).toBe(vagaTi);
  });

  it('não regenera nada em estado limpo', () => {
    expect(vagaParaRegenerar(ESTADO_INICIAL)).toBeNull();
    expect(vagaInalterada(ESTADO_INICIAL)).toBe(false);
  });
});

describe('seleção no histórico', () => {
  it('mostra a descrição salva e repopula o formulário', () => {
    const e = reducerGeracao(ESTADO_INICIAL, {
      tipo: 'historicoSelecionado',
      descricao: 'vaga antiga',
      vaga: vagaLogistica,
    });

    expect(e.descricao).toBe('vaga antiga');
    expect(e.vagaGerada).toBe(vagaLogistica);
    expect(e.vagaNoFormulario).toBe(vagaLogistica);
    expect(e.semente).toEqual({ key: 1, data: vagaLogistica });
  });

  it('muda a key a cada seleção, para o formulário remontar', () => {
    let e = reducerGeracao(ESTADO_INICIAL, {
      tipo: 'historicoSelecionado',
      descricao: 'a',
      vaga: vagaLogistica,
    });
    e = reducerGeracao(e, { tipo: 'historicoSelecionado', descricao: 'b', vaga: vagaTi });

    expect(e.semente?.key).toBe(2);
    expect(e.semente?.data).toBe(vagaTi);
  });

  // Entrada salva antes do form completo ser guardado: dá para ler, não repopular.
  it('mostra a descrição de entrada antiga sem formulário', () => {
    const e = reducerGeracao(ESTADO_INICIAL, {
      tipo: 'historicoSelecionado',
      descricao: 'só o texto',
      vaga: null,
    });

    expect(e.descricao).toBe('só o texto');
    expect(e.semente).toBeNull();
    expect(vagaParaRegenerar(e)).toBeNull();
  });

  it('limpa erro e aviso da geração anterior', () => {
    const sujo = { ...ESTADO_INICIAL, erro: 'falhou', aviso: 'interrompida' };
    const e = reducerGeracao(sujo, {
      tipo: 'historicoSelecionado',
      descricao: 'texto',
      vaga: vagaTi,
    });

    expect(e.erro).toBe('');
    expect(e.aviso).toBe('');
  });
});