import { ChatView } from '@/components/ChatView';
import { mensagensIniciais } from '@/data/mock';

export default function ChatCliente() {
  return <ChatView initial={mensagensIniciais} />;
}
