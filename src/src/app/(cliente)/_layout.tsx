import { Redirect, Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { tabScreenOptions } from '@/components/tabOptions';
import { useAuth } from '@/contexts/AuthContext';

export default function ClienteLayout() {
  const { usuario } = useAuth();

  if (!usuario) return <Redirect href="/" />;
  if (usuario.perfil !== 'cliente') return <Redirect href="/(mecanico)/pendentes" />;

  return (
    <Tabs screenOptions={tabScreenOptions}>
      <Tabs.Screen
        name="agendamentos"
        options={{
          title: 'Agendamentos',
          tabBarIcon: ({ color, size }) => <Ionicons name="calendar-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="ordens"
        options={{
          title: 'Ordens de serviço',
          tabBarLabel: 'Ordens',
          tabBarIcon: ({ color, size }) => <Ionicons name="construct-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat com a oficina',
          tabBarLabel: 'Chat',
          tabBarIcon: ({ color, size }) => <Ionicons name="chatbubbles-outline" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
