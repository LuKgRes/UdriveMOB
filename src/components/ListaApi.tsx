import { ReactElement } from 'react';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/colors';

type Props<T> = {
  dados: T[] | null;
  carregando: boolean;
  erro: string;
  atualizando: boolean;
  onAtualizar: () => void;
  textoVazio: string;
  keyExtractor: (item: T) => string;
  renderItem: (item: T) => ReactElement;
};

/** FlatList com carregamento, erro (com "tentar de novo"), lista vazia e puxar para atualizar */
export function ListaApi<T>({
  dados,
  carregando,
  erro,
  atualizando,
  onAtualizar,
  textoVazio,
  keyExtractor,
  renderItem,
}: Props<T>) {
  if (carregando && !dados) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color={colors.white} />
      </View>
    );
  }

  if (erro && !dados) {
    return (
      <View style={styles.centro}>
        <Text style={styles.textoErro}>{erro}</Text>
        <Pressable style={styles.botao} onPress={onAtualizar}>
          <Text style={styles.botaoTexto}>Tentar de novo</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <FlatList
      data={dados ?? []}
      keyExtractor={keyExtractor}
      renderItem={({ item }) => renderItem(item)}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.conteudo}
      refreshControl={<RefreshControl refreshing={atualizando} onRefresh={onAtualizar} tintColor={colors.white} />}
      ListHeaderComponent={
        erro ? (
          <View style={styles.aviso}>
            <Text style={styles.avisoTexto}>{erro}</Text>
          </View>
        ) : null
      }
      ListEmptyComponent={<Text style={styles.vazio}>{textoVazio}</Text>}
    />
  );
}

const styles = StyleSheet.create({
  conteudo: { paddingBottom: 24, flexGrow: 1 },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, paddingBottom: 80 },
  textoErro: { color: colors.white, fontSize: 14, textAlign: 'center', paddingHorizontal: 24 },
  botao: { backgroundColor: colors.dark, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 20 },
  botaoTexto: { color: colors.white, fontSize: 14, fontWeight: '600' },
  aviso: { backgroundColor: '#F8DEDC', borderRadius: 8, padding: 10, marginBottom: 12 },
  avisoTexto: { color: '#B3261E', fontSize: 13 },
  vazio: { color: colors.white, fontSize: 14, textAlign: 'center', marginTop: 48, paddingHorizontal: 24, lineHeight: 20 },
});
