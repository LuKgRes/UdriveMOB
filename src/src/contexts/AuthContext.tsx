import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { buscarMeusDados, login, Usuario } from '@/api/auth';
import { setAoExpirarSessao, setToken } from '@/api/client';
import { ler, remover, salvar } from '@/utils/storage';

type AuthState = {
  usuario: Usuario | null;
  carregando: boolean;
  signIn: (email: string, senha: string) => Promise<Usuario>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  const signOut = useCallback(async () => {
    setToken(null);
    setUsuario(null);
    await remover('token');
    await remover('usuario');
  }, []);

  // Se a API disser que o token não vale mais, desloga
  useEffect(() => {
    setAoExpirarSessao(() => {
      signOut();
    });
    return () => setAoExpirarSessao(null);
  }, [signOut]);

  // Ao abrir o app, recupera a sessão salva
  useEffect(() => {
    (async () => {
      try {
        const token = await ler('token');
        const salvo = await ler('usuario');
        if (token && salvo) {
          setToken(token);
          setUsuario(JSON.parse(salvo));
          // Confere em segundo plano. Se der 401, o client já chama o signOut.
          buscarMeusDados()
            .then((atual) => setUsuario(atual))
            .catch(() => {});
        }
      } catch {
        // sessão salva corrompida: segue deslogado
      } finally {
        setCarregando(false);
      }
    })();
  }, []);

  const signIn = useCallback(async (email: string, senha: string) => {
    const { token, usuario: logado } = await login(email, senha);
    setToken(token);
    await salvar('token', token);
    await salvar('usuario', JSON.stringify(logado));
    setUsuario(logado);
    return logado;
  }, []);

  const valor = useMemo(() => ({ usuario, carregando, signIn, signOut }), [usuario, carregando, signIn, signOut]);

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth precisa estar dentro de <AuthProvider>.');
  return ctx;
}
