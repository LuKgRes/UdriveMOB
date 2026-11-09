import { api } from './client';

export type Usuario = {
  id: number;
  nome: string;
  email: string;
  perfil: 'cliente' | 'mecanico';
  telefone?: string;
};

export function login(email: string, senha: string) {
  return api<{ token: string; usuario: Usuario }>('/auth/login', { method: 'POST', body: { email, senha } });
}

export function cadastrar(dados: { nome: string; email: string; telefone: string; senha: string }) {
  return api<{ usuario: Usuario }>('/auth/cadastro', { method: 'POST', body: dados });
}

export function buscarMeusDados() {
  return api<Usuario>('/me');
}
