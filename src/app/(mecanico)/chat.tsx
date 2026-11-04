import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenBody } from '@/components/ScreenBody';
import { colors } from '@/constants/colors';
import { conversas } from '@/data/mock';

export default function ListaConversas() {
  const router = useRouter();

  return (
    <ScreenBody title="Conversas com clientes">
      <FlatList
        data={conversas}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => router.push(`/conversa/${item.id}`)}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.cliente.charAt(0)}</Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.name}>{item.cliente}</Text>
              <Text style={styles.last} numberOfLines={1}>{item.ultima}</Text>
            </View>
            <Text style={styles.hour}>{item.hora}</Text>
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
  avatarText: { fontSize: 16, fontWeight: '800', color: '#000' },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: '700', color: colors.white },
  last: { fontSize: 13, color: colors.muted, marginTop: 2 },
  hour: { fontSize: 12, color: colors.muted },
});
