import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ConversaResumo, listarConversas } from '@/api/dados';
import { ListaApi } from '@/components/ListaApi';
import { ScreenBody } from '@/components/ScreenBody';
import { colors } from '@/constants/colors';
import { useCarregar } from '@/hooks/useCarregar';
import { formatarData, formatarHora } from '@/utils/format';

function horaDaUltima(c: ConversaResumo): string {
  if (!c.ultima) return '';
  const d = new Date(c.ultima.criadoEm);
  const hoje = new Date();
  const mesmoDia = d.toDateString() === hoje.toDateString();
  return mesmoDia ? formatarHora(c.ultima.criadoEm) : formatarData(c.ultima.criadoEm);
}

export default function ListaConversas() {
  const router = useRouter();
  const { dados, carregando, erro, atualizando, atualizar } = useCarregar(listarConversas);

  // Conversas com mensagem mais recente primeiro; sem mensagens ficam no fim
  const ordenadas = dados
    ? [...dados].sort((a, b) => (b.ultima?.criadoEm ?? '').localeCompare(a.ultima?.criadoEm ?? ''))
    : null;

  return (
    <ScreenBody title="Conversas com clientes">
      <ListaApi<ConversaResumo>
        dados={ordenadas}
        carregando={carregando}
        erro={erro}
        atualizando={atualizando}
        onAtualizar={atualizar}
        textoVazio="Nenhuma conversa ainda. Elas aparecem quando um cliente abre o chat."
        keyExtractor={(item) => String(item.id)}
        renderItem={(item) => (
          <Pressable
            style={styles.card}
            onPress={() => router.push({ pathname: '/conversa/[id]', params: { id: String(item.id), nome: item.cliente } })}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarTexto}>{item.cliente.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.nome}>{item.cliente}</Text>
              <Text style={styles.ultima} numberOfLines={1}>
                {item.ultima?.texto ?? 'Sem mensagens'}
              </Text>
            </View>
            <Text style={styles.hora}>{horaDaUltima(item)}</Text>
          </Pressable>
        )}
      />
    </ScreenBody>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.table,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarTexto: { fontSize: 16, fontWeight: '800', color: '#000' },
  info: { flex: 1 },
  nome: { fontSize: 15, fontWeight: '700', color: colors.white },
  ultima: { fontSize: 13, color: colors.muted, marginTop: 2 },
  hora: { fontSize: 12, color: colors.muted },
});
