import { Redirect, Stack, useLocalSearchParams } from 'expo-router';
import { ChatConversa } from '@/components/ChatConversa';
import { useAuth } from '@/contexts/AuthContext';

export default function Conversa() {
  const { usuario } = useAuth();
  const { id, nome } = useLocalSearchParams<{ id: string; nome?: string }>();
  const conversaId = Number(id);

  if (!usuario) return <Redirect href="/" />;

  return (
    <>
      <Stack.Screen options={{ title: nome ?? 'Conversa' }} />
      {Number.isInteger(conversaId) && conversaId > 0 ? <ChatConversa conversaId={conversaId} /> : null}
    </>
  );
}
