import { JobFormData } from '../types';

/**
 * Estado da geração de uma vaga.
 *
 * Ficava espalhado em seis useState no App, com o formulário vivo dentro do
 * JobForm. Duas fontes de verdade sobre "qual é a vaga atual" foi exatamente
 * o que fez o botão Regenerar reenviar a vaga anterior. Aqui as transições
 * ficam num só lugar, puras e testáveis sem montar componente.
 */
export interface EstadoGeracao {
  descricao: string;
  gerando: boolean;
  erro: string;
  aviso: string;
  /** Payload da última geração disparada — o que produziu `descricao`. */
  vagaGerada: JobFormData | null;
  /** O que está no formulário agora; pode já ter sido editado depois. */
  vagaNoFormulario: JobFormData | null;
  /** Repopula o formulário a partir do histórico. `key` força a remontagem. */
  semente: { key: number; data: JobFormData } | null;
}

export type AcaoGeracao =
  | { tipo: 'formularioEditado'; vaga: JobFormData }
  | { tipo: 'geracaoIniciada'; vaga: JobFormData }
  | { tipo: 'textoRecebido'; texto: string }
  | { tipo: 'geracaoConcluida'; texto: string; truncada: boolean }
  | { tipo: 'geracaoCancelada' }
  | { tipo: 'geracaoFalhou'; erro: string }
  | { tipo: 'historicoSelecionado'; descricao: string; vaga: JobFormData | null };

export const ESTADO_INICIAL: EstadoGeracao = {
  descricao: '',
  gerando: false,
  erro: '',
  aviso: '',
  vagaGerada: null,
  vagaNoFormulario: null,
  semente: null,
};

const AVISO_TRUNCADA =
  'A descrição atingiu o limite de tamanho e pode ter sido cortada no final.';

export function reducerGeracao(estado: EstadoGeracao, acao: AcaoGeracao): EstadoGeracao {
  switch (acao.tipo) {
    case 'formularioEditado':
      return { ...estado, vagaNoFormulario: acao.vaga };

    case 'geracaoIniciada':
      return {
        ...estado,
        gerando: true,
        erro: '',
        aviso: '',
        descricao: '',
        vagaGerada: acao.vaga,
      };

    case 'textoRecebido':
      return { ...estado, descricao: acao.texto };

    case 'geracaoConcluida':
      return {
        ...estado,
        gerando: false,
        descricao: acao.texto,
        aviso: acao.truncada ? AVISO_TRUNCADA : '',
      };

    // Interromper não é erro: o texto parcial já transmitido continua na tela.
    case 'geracaoCancelada':
      return { ...estado, gerando: false, aviso: 'Geração interrompida.' };

    case 'geracaoFalhou':
      return { ...estado, gerando: false, erro: acao.erro };

    case 'historicoSelecionado':
      return {
        ...estado,
        descricao: acao.descricao,
        erro: '',
        aviso: '',
        vagaGerada: acao.vaga,
        vagaNoFormulario: acao.vaga,
        semente: acao.vaga
          ? { key: (estado.semente?.key ?? 0) + 1, data: acao.vaga }
          : estado.semente,
      };
  }
}

/**
 * Vaga que o botão Regenerar deve enviar: o que está no formulário agora, com
 * o último payload gerado como reserva enquanto o formulário não reportou.
 */
export function vagaParaRegenerar(estado: EstadoGeracao): JobFormData | null {
  return estado.vagaNoFormulario ?? estado.vagaGerada;
}

/**
 * Só faz sentido pedir "uma versão diferente" quando a vaga na tela é a mesma
 * que gerou o texto atual. Depois de uma edição, Regenerar recomeça do zero.
 */
export function vagaInalterada(estado: EstadoGeracao): boolean {
  const alvo = vagaParaRegenerar(estado);
  if (!alvo || !estado.vagaGerada) return false;
  return JSON.stringify(alvo) === JSON.stringify(estado.vagaGerada);
}