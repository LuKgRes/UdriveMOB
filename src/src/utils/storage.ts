import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// No celular usa o armazenamento seguro do sistema (Keychain/Keystore).
// No navegador (web), o SecureStore não existe, então usa o localStorage.

export async function salvar(chave: string, valor: string): Promise<void> {
  if (Platform.OS === 'web') {
    try {
      localStorage.setItem(chave, valor);
    } catch {}
    return;
  }
  await SecureStore.setItemAsync(chave, valor);
}

export async function ler(chave: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    try {
      return localStorage.getItem(chave);
    } catch {
      return null;
    }
  }
  return SecureStore.getItemAsync(chave);
}

export async function remover(chave: string): Promise<void> {
  if (Platform.OS === 'web') {
    try {
      localStorage.removeItem(chave);
    } catch {}
    return;
  }
  await SecureStore.deleteItemAsync(chave);
}
