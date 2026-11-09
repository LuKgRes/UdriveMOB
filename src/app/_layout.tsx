import { ActivityIndicator, View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@/constants/colors';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

function Rotas() {
  const { carregando } = useAuth();

  if (carregando) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTitleAlign: 'center',
        headerTitleStyle: { fontWeight: '800' },
        headerTintColor: '#000',
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="cadastro" options={{ title: 'Cadastro' }} />
      <Stack.Screen name="(cliente)" options={{ headerShown: false }} />
      <Stack.Screen name="(mecanico)" options={{ headerShown: false }} />
      <Stack.Screen name="novo-agendamento" options={{ title: 'Novo agendamento' }} />
      <Stack.Screen name="conversa/[id]" options={{ title: 'Conversa' }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <Rotas />
    </AuthProvider>
  );
}
