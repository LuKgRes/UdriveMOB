const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000').replace(/\/$/, '');
const TIMEOUT_MS = 10000;

export class ApiError extends Error {
  status: number;
  campos?: Record<string, string[]>;

  constructor(message: string, status: number, campos?: Record<string, string[]>) {
    super(message);
    this.status = status;
    this.campos = campos;
  }
}

let tokenAtual: string | null = null;
let aoExpirarSessao: (() => void) | null = null;

export function setToken(token: string | null) {
  tokenAtual = token;
}

/** Chamada quando a API responde 401 com um token em uso (sessão expirada ou inválida) */
export function setAoExpirarSessao(fn: (() => void) | null) {
  aoExpirarSessao = fn;
}

type Opcoes = { method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'; body?: unknown };

export async function api<T>(caminho: string, { method = 'GET', body }: Opcoes = {}): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (tokenAtual) headers.Authorization = `Bearer ${tokenAtual}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let resposta: Response;
  try {
    resposta = await fetch(`${API_URL}${caminho}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch {
    throw new ApiError('Não foi possível conectar ao servidor. Verifique sua internet e tente de novo.', 0);
  } finally {
    clearTimeout(timer);
  }

  const dados = await resposta.json().catch(() => null);

  if (!resposta.ok) {
    if (resposta.status === 401 && tokenAtual) aoExpirarSessao?.();
    throw new ApiError(dados?.erro ?? 'Algo deu errado. Tente novamente.', resposta.status, dados?.campos);
  }

  return dados as T;
}
