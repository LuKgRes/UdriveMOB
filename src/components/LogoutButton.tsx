import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Alert, Platform, Pressable } from 'react-native';

export function LogoutButton() {
  const router = useRouter();

  function logout() {
    router.replace('/');
  }

  function confirmLogout() {
    if (Platform.OS === 'web') {
      if (window.confirm('Deseja sair da sua conta?')) logout();
      return;
    }

    Alert.alert('Sair', 'Deseja sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: logout },
    ]);
  }

  return (
    <Pressable onPress={confirmLogout} hitSlop={10} style={{ marginRight: 16 }}>
      <Ionicons name="log-out-outline" size={24} color="#000" />
    </Pressable>
  );
}