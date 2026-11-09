import { api } from './client';

export type Agendamento = { id: number; servico: string; veiculo: string; dataHora: string; estado: string };
export type Ordem = {
  id: number;
  numero: string;
  servico: string;
  veiculo: string;
  status: string;
  valorCentavos: number | null;
  criadoEm: string;
};
export type Pendente = { id: number; cliente: string; veiculo: string; servico: string; dataHora: string };
export type ConversaResumo = { id: number; cliente: string; ultima: { texto: string; criadoEm: string } | null };
export type MensagemApi = { id: number; texto: string; criadoEm: string; minha: boolean };

export const listarAgendamentos = () => api<Agendamento[]>('/agendamentos');

export const criarAgendamento = (dados: { servico: string; veiculo: string; dataHora: string }) =>
  api<Agendamento>('/agendamentos', { method: 'POST', body: dados });

export const listarOrdens = () => api<Ordem[]>('/ordens');

export const listarPendentes = () => api<Pendente[]>('/pendentes');

export const listarConversas = () => api<ConversaResumo[]>('/conversas');

export const listarMensagens = (conversaId: number, depois: number) =>
  api<MensagemApi[]>(`/conversas/${conversaId}/mensagens?depois=${depois}`);

export const enviarMensagem = (conversaId: number, texto: string) =>
  api<MensagemApi>(`/conversas/${conversaId}/mensagens`, { method: 'POST', body: { texto } });
