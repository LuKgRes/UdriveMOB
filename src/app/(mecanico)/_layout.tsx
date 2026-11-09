import { Redirect, Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { tabScreenOptions } from '@/components/tabOptions';
import { useAuth } from '@/contexts/AuthContext';

export default function MecanicoLayout() {
  const { usuario } = useAuth();

  if (!usuario) return <Redirect href="/" />;
  if (usuario.perfil !== 'mecanico') return <Redirect href="/(cliente)/agendamentos" />;

  return (
    <Tabs screenOptions={tabScreenOptions}>
      <Tabs.Screen
        name="pendentes"
        options={{
          title: 'Serviços pendentes',
          tabBarLabel: 'Pendentes',
          tabBarIcon: ({ color, size }) => <Ionicons name="time-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Conversas',
          tabBarLabel: 'Chat',
          tabBarIcon: ({ color, size }) => <Ionicons name="chatbubbles-outline" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
