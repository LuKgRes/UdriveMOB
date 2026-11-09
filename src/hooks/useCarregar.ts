import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { ApiError } from '@/api/client';

/**
 * Busca dados da API toda vez que a tela ganha foco (por exemplo, ao voltar
 * de "Novo agendamento"). Só mostra o carregamento na primeira vez.
 */
export function useCarregar<T>(buscar: () => Promise<T>) {
  const [dados, setDados] = useState<T | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState('');

  const buscarRef = useRef(buscar);
  buscarRef.current = buscar;
  const temDados = useRef(false);

  const carregar = useCallback(async () => {
    if (!temDados.current) setCarregando(true);
    try {
      const resultado = await buscarRef.current();
      setDados(resultado);
      temDados.current = true;
      setErro('');
    } catch (e) {
      setErro(e instanceof ApiError ? e.message : 'Algo deu errado. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar]),
  );

  const atualizar = useCallback(async () => {
    setAtualizando(true);
    await carregar();
    setAtualizando(false);
  }, [carregar]);

  return { dados, carregando, atualizando, erro, atualizar };
}
