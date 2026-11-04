import { LogoutButton } from '@/components/LogoutButton';
import { colors } from '@/constants/colors';

export const tabScreenOptions = {
  headerStyle: { backgroundColor: colors.primary },
  headerTitleAlign: 'center' as const,
  headerTitleStyle: { fontWeight: '800' as const, color: '#000' },
  headerRight: () => <LogoutButton />,
  tabBarStyle: { backgroundColor: colors.primary, borderTopWidth: 0 },
  tabBarActiveTintColor: '#000',
  tabBarInactiveTintColor: '#2B5F70',
  sceneStyle: { backgroundColor: colors.background },
};