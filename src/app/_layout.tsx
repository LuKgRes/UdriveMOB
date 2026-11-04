import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@/constants/colors';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
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
        <Stack.Screen name="(cliente)" options={{ headerShown: false }} />
        <Stack.Screen name="(mecanico)" options={{ headerShown: false }} />
        <Stack.Screen name="conversa/[id]" options={{ title: 'Conversa' }} />
      </Stack>
    </>
  );
}
