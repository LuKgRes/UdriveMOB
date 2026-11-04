import { Stack, useLocalSearchParams } from 'expo-router';
import { ChatView } from '@/components/ChatView';
import { conversas, mensagensIniciais } from '@/data/mock';

export default function Conversa() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const conversa = conversas.find((c) => c.id === id);

  return (
    <>
      <Stack.Screen options={{ title: conversa?.cliente ?? 'Conversa' }} />
      {/* Aqui "me" é o mecânico, então invertemos as mensagens de exemplo */}
      <ChatView
        initial={mensagensIniciais.map((m) => ({ ...m, from: m.from === 'me' ? 'other' : 'me' }))}
      />
    </>
  );
}
