import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { listarConversas } from '@/api/dados';
import { ChatConversa } from '@/components/ChatConversa';
import { colors } from '@/constants/colors';
import { useCarregar } from '@/hooks/useCarregar';

export default function ChatCliente() {
  // Para o cliente, a API devolve só a própria conversa com a oficina
  const { dados, carregando, erro, atualizar } = useCarregar(listarConversas);
  const conversa = dados?.[0];

  if (conversa) return <ChatConversa conversaId={conversa.id} />;

  return (
    <View style={styles.centro}>
      {carregando ? (
        <ActivityIndicator size="large" color={colors.white} />
      ) : (
        <>
          <Text style={styles.texto}>{erro || 'Não foi possível abrir o chat.'}</Text>
          <Pressable style={styles.botao} onPress={atualizar}>
            <Text style={styles.botaoTexto}>Tentar de novo</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  centro: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
  texto: { color: colors.white, fontSize: 14, textAlign: 'center' },
  botao: { backgroundColor: colors.dark, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 20 },
  botaoTexto: { color: colors.white, fontSize: 14, fontWeight: '600' },
});
