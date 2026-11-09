export const LIMITES = {
  nomeMin: 3,
  nomeMax: 80,
  emailMax: 100,
  senhaMin: 6,
  senhaMax: 32,
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validarEmail(valor: string): string {
  const email = valor.trim();
  if (!email) return 'Informe o e-mail.';
  if (email.length > LIMITES.emailMax) return `O e-mail deve ter no máximo ${LIMITES.emailMax} caracteres.`;
  if (!EMAIL_REGEX.test(email)) return 'Digite um e-mail válido.';
  return '';
}

export function validarSenha(valor: string): string {
  if (!valor) return 'Informe a senha.';
  if (valor.length < LIMITES.senhaMin) return `A senha deve ter pelo menos ${LIMITES.senhaMin} caracteres.`;
  if (valor.length > LIMITES.senhaMax) return `A senha deve ter no máximo ${LIMITES.senhaMax} caracteres.`;
  return '';
}

export function validarNome(valor: string): string {
  const nome = valor.trim().replace(/\s+/g, ' ');
  if (!nome) return 'Informe o nome completo.';
  if (nome.length < LIMITES.nomeMin) return `O nome deve ter pelo menos ${LIMITES.nomeMin} caracteres.`;
  if (nome.length > LIMITES.nomeMax) return `O nome deve ter no máximo ${LIMITES.nomeMax} caracteres.`;
  if (nome.split(' ').length < 2) return 'Informe nome e sobrenome.';
  return '';
}

export function validarTelefone(valor: string): string {
  const digitos = valor.replace(/\D/g, '');
  if (!digitos) return 'Informe o telefone.';
  if (digitos.length < 10 || digitos.length > 11) return 'Digite o telefone com DDD.';
  return '';
}

export function validarConfirmacao(senha: string, confirmacao: string): string {
  if (!confirmacao) return 'Confirme a senha.';
  if (senha !== confirmacao) return 'As senhas não são iguais.';
  return '';
}

/** Aplica a máscara (00) 00000-0000 enquanto a pessoa digita */
export function formatarTelefone(valor: string): string {
  const d = valor.replace(/\D/g, '').slice(0, 11);
  if (d.length === 0) return '';
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}
