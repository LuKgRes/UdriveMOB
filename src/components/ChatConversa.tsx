import { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { enviarMensagem, listarMensagens, MensagemApi } from '@/api/dados';
import { ApiError } from '@/api/client';
import { colors } from '@/constants/colors';
import { formatarHora } from '@/utils/format';

const INTERVALO_MS = 4000;

function mesclar(anteriores: MensagemApi[], novas: MensagemApi[]): MensagemApi[] {
  const ids = new Set(anteriores.map((m) => m.id));
  const adicionar = novas.filter((m) => !ids.has(m.id));
  return adicionar.length ? [...anteriores, ...adicionar].sort((a, b) => a.id - b.id) : anteriores;
}

/** Conversa ligada à API. Busca mensagens novas a cada poucos segundos enquanto a tela está aberta. */
export function ChatConversa({ conversaId }: { conversaId: number }) {
  const [mensagens, setMensagens] = useState<MensagemApi[]>([]);
  const [entrada, setEntrada] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [erroConexao, setErroConexao] = useState('');
  const [erroEnvio, setErroEnvio] = useState('');

  const ultimoId = useRef(0);
  const listaRef = useRef<FlatList<MensagemApi>>(null);

  const buscarNovas = useCallback(async () => {
    try {
      const novas = await listarMensagens(conversaId, ultimoId.current);
      if (novas.length) {
        ultimoId.current = novas[novas.length - 1].id;
        setMensagens((prev) => mesclar(prev, novas));
      }
      setErroConexao('');
    } catch (e) {
      setErroConexao(e instanceof ApiError ? e.message : 'Sem conexão. Tentando de novo...');
    } finally {
      setCarregando(false);
    }
  }, [conversaId]);

  // Só consulta enquanto a tela está em foco
  useFocusEffect(
    useCallback(() => {
      buscarNovas();
      const timer = setInterval(buscarNovas, INTERVALO_MS);
      return () => clearInterval(timer);
    }, [buscarNovas]),
  );

  async function enviar() {
    const texto = entrada.trim();
    if (!texto || enviando) return;

    setEnviando(true);
    setErroEnvio('');
    try {
      const enviada = await enviarMensagem(conversaId, texto);
      setMensagens((prev) => mesclar(prev, [enviada]));
      setEntrada('');
    } catch (e) {
      setErroEnvio(e instanceof ApiError ? e.message : 'Não foi possível enviar. Tente de novo.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {!!erroConexao && (
        <View style={styles.aviso}>
          <Text style={styles.avisoTexto}>{erroConexao}</Text>
        </View>
      )}

      {carregando && mensagens.length === 0 ? (
        <View style={styles.centro}>
          <ActivityIndicator size="large" color={colors.white} />
        </View>
      ) : (
        <FlatList
          ref={listaRef}
          data={mensagens}
          keyExtractor={(m) => String(m.id)}
          contentContainerStyle={styles.lista}
          onContentSizeChange={() => listaRef.current?.scrollToEnd({ animated: true })}
          ListEmptyComponent={<Text style={styles.vazio}>Nenhuma mensagem ainda. Escreva a primeira.</Text>}
          renderItem={({ item }) => (
            <View style={[styles.balao, item.minha ? styles.minha : styles.outra]}>
              <Text style={styles.texto}>{item.texto}</Text>
              <Text style={styles.hora}>{formatarHora(item.criadoEm)}</Text>
            </View>
          )}
        />
      )}

      {!!erroEnvio && (
        <View style={styles.aviso}>
          <Text style={styles.avisoTexto}>{erroEnvio}</Text>
        </View>
      )}

      <View style={styles.barra}>
        <TextInput
          style={styles.input}
          value={entrada}
          onChangeText={setEntrada}
          placeholder="Digite uma mensagem"
          placeholderTextColor={colors.placeholder}
          multiline
          maxLength={2000}
        />
        <Pressable style={[styles.enviar, enviando && styles.enviarDesativado]} onPress={enviar} disabled={enviando}>
          {enviando ? <ActivityIndicator size="small" color={colors.white} /> : <Ionicons name="send" size={18} color={colors.white} />}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  lista: { padding: 16, gap: 8, flexGrow: 1 },
  vazio: { color: colors.white, textAlign: 'center', marginTop: 48, fontSize: 14 },
  aviso: { backgroundColor: '#F8DEDC', paddingHorizontal: 16, paddingVertical: 8 },
  avisoTexto: { color: '#B3261E', fontSize: 13 },
  balao: { maxWidth: '80%', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8 },
  minha: { alignSelf: 'flex-end', backgroundColor: colors.primary, borderBottomRightRadius: 2 },
  outra: { alignSelf: 'flex-start', backgroundColor: colors.card, borderBottomLeftRadius: 2 },
  texto: { fontSize: 15, color: colors.text },
  hora: { fontSize: 11, color: '#555', alignSelf: 'flex-end', marginTop: 2 },
  barra: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, padding: 12, backgroundColor: colors.card },
  input: {
    flex: 1,
    maxHeight: 100,
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  enviar: {
    backgroundColor: colors.dark,
    borderRadius: 8,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  enviarDesativado: { opacity: 0.7 },
});
