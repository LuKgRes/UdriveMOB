import { Alert, Platform, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export function LogoutButton() {
  const router = useRouter();
  const { signOut } = useAuth();

  async function sair() {
    await signOut();
    router.replace('/');
  }

  function confirmarSaida() {
    if (Platform.OS === 'web') {
      if (window.confirm('Deseja sair da sua conta?')) sair();
      return;
    }

    Alert.alert('Sair', 'Deseja sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: sair },
    ]);
  }

  return (
    <Pressable onPress={confirmarSaida} hitSlop={10} style={{ marginRight: 16 }}>
      <Ionicons name="log-out-outline" size={24} color="#000" />
    </Pressable>
  );
}
