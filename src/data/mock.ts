export type Agendamento = { id: string; servico: string; veiculo: string; data: string; estado: string };
export type Ordem = { id: string; numero: string; veiculo: string; servico: string; data: string; status: string; valor: string };
export type Pendente = { id: string; cliente: string; veiculo: string; servico: string; data: string };
export type Mensagem = { id: string; text: string; from: 'me' | 'other'; time: string };
export type Conversa = { id: string; cliente: string; ultima: string; hora: string };

export const agendamentos: Agendamento[] = [
  { id: '1', servico: 'Troca de óleo', veiculo: 'Uno - 123E345', data: '15/07/2026 10:34', estado: 'Confirmado' },
  { id: '2', servico: 'Personalizado', veiculo: 'Uno - 123E345', data: '22/07/2026 14:00', estado: 'Pendente' },
  { id: '3', servico: 'Revisão de freios', veiculo: 'Gol - ABC1D23', data: '02/06/2026 09:00', estado: 'Concluído' },
];

export const ordens: Ordem[] = [
  { id: '1', numero: 'OS-0042', veiculo: 'Uno - 123E345', servico: 'Troca de óleo', data: '15/07/2026', status: 'Em andamento', valor: 'R$ 180,00' },
  { id: '2', numero: 'OS-0031', veiculo: 'Gol - ABC1D23', servico: 'Revisão de freios', data: '02/06/2026', status: 'Concluído', valor: 'R$ 420,00' },
];

export const pendentes: Pendente[] = [
  { id: '1', cliente: 'Regis Souza', veiculo: 'Uno - 123E345', servico: 'Personalizado - 15/07/2026', data: '15/07/2026 10:34' },
  { id: '2', cliente: 'Marina Alves', veiculo: 'Onix - QWE4R56', servico: 'Alinhamento', data: '16/07/2026 08:00' },
];

export const conversas: Conversa[] = [
  { id: '1', cliente: 'Regis Souza', ultima: 'Pode vir amanhã às 10h?', hora: '10:41' },
  { id: '2', cliente: 'Marina Alves', ultima: 'Obrigada, até lá!', hora: 'Ontem' },
];

export const mensagensIniciais: Mensagem[] = [
  { id: '1', text: 'Bom dia! Meu carro já está pronto?', from: 'me', time: '09:12' },
  { id: '2', text: 'Bom dia! Estamos finalizando a troca de óleo.', from: 'other', time: '09:15' },
  { id: '3', text: 'Fica pronto até o meio-dia.', from: 'other', time: '09:15' },
];
