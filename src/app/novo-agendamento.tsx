import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { criarAgendamento } from '@/api/dados';
import { ApiError } from '@/api/client';
import { FormField } from '@/components/FormField';
import { colors } from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import {
  formatarDataDigitando,
  formatarHoraDigitando,
  montarDataHora,
  validarData,
  validarFuturo,
  validarHora,
} from '@/utils/agendamento';

const SUGESTOES = ['Troca de óleo', 'Revisão geral', 'Freios', 'Alinhamento e balanceamento', 'Suspensão', 'Bateria'];

type Campo = 'servico' | 'veiculo' | 'data' | 'hora';
type Valores = Record<Campo, string>;
const vazio: Valores = { servico: '', veiculo: '', data: '', hora: '' };

export default function NovoAgendamento() {
  const router = useRouter();
  const { usuario } = useAuth();
  const { tipo } = useLocalSearchParams<{ tipo?: string }>();
  const personalizado = tipo === 'personalizado';

  const [valores, setValores] = useState<Valores>(vazio);
  const [erros, setErros] = useState<Valores>(vazio);
  const [erroGeral, setErroGeral] = useState('');
  const [enviando, setEnviando] = useState(false);

  if (!usuario) return <Redirect href="/" />;

  function validarCampo(campo: Campo): string {
    const v = valores[campo].trim();
    switch (campo) {
      case 'servico':
        if (!v) return personalizado ? 'Descreva o serviço.' : 'Informe o serviço.';
        if (v.length < 3) return 'Escreva pelo menos 3 caracteres.';
        return '';
      case 'veiculo':
        if (!v) return 'Informe o veículo.';
        if (v.length < 2) return 'Escreva pelo menos 2 caracteres.';
        return '';
      case 'data':
        return validarData(valores.data);
      case 'hora':
        return validarHora(valores.hora);
      default:
        return '';
    }
  }

  function alterar(campo: Campo, texto: string) {
    let valor = texto;
    if (campo === 'data') valor = formatarDataDigitando(texto);
    if (campo === 'hora') valor = formatarHoraDigitando(texto);
    setValores((prev) => ({ ...prev, [campo]: valor }));
    if (erros[campo]) setErros((prev) => ({ ...prev, [campo]: '' }));
    setErroGeral('');
  }

  function aoSair(campo: Campo) {
    setErros((prev) => ({ ...prev, [campo]: validarCampo(campo) }));
  }

  async function agendar() {
    if (enviando) return;

    const novos: Valores = {
      servico: validarCampo('servico'),
      veiculo: validarCampo('veiculo'),
      data: validarCampo('data'),
      hora: validarCampo('hora'),
    };
    if (!novos.data && !novos.hora) novos.data = validarFuturo(valores.data, valores.hora);
    setErros(novos);
    setErroGeral('');
    if (Object.values(novos).some(Boolean)) return;

    const dataHora = montarDataHora(valores.data, valores.hora);
    if (!dataHora) return;

    const descricao = valores.servico.trim();
    setEnviando(true);
    try {
      await criarAgendamento({
        servico: personalizado ? `Personalizado - ${descricao}` : descricao,
        veiculo: valores.veiculo.trim(),
        dataHora: dataHora.toISOString(),
      });
      router.back(); // a lista recarrega sozinha ao ganhar foco
    } catch (e) {
      if (e instanceof ApiError && e.status === 400 && e.campos) {
        setErros({
          servico: e.campos.servico?.[0] ?? '',
          veiculo: e.campos.veiculo?.[0] ?? '',
          data: e.campos.dataHora?.[0] ?? '',
          hora: '',
        });
      } else {
        setErroGeral(e instanceof ApiError ? e.message : 'Algo deu errado. Tente novamente.');
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          {!!erroGeral && (
            <View style={styles.bannerError}>
              <Text style={styles.bannerErrorText}>{erroGeral}</Text>
            </View>
          )}

          {!personalizado && (
            <View style={styles.sugestoes}>
              {SUGESTOES.map((s) => {
                const ativo = valores.servico === s;
                return (
                  <Pressable
                    key={s}
                    onPress={() => alterar('servico', s)}
                    style={[styles.chip, ativo && styles.chipAtivo]}
                    disabled={enviando}
                  >
                    <Text style={[styles.chipTexto, ativo && styles.chipTextoAtivo]}>{s}</Text>
                  </Pressable>
                );
              })}
            </View>
          )}

          <FormField
            label={personalizado ? 'Descreva o serviço' : 'Serviço'}
            placeholder={personalizado ? 'Ex.: barulho na suspensão ao frear' : 'Escolha acima ou digite'}
            value={valores.servico}
            onChangeText={(t) => alterar('servico', t)}
            onBlur={() => aoSair('servico')}
            error={erros.servico}
            maxLength={80}
            editable={!enviando}
          />

          <FormField
            label="Veículo"
            placeholder="Ex.: Uno - ABC1D23"
            value={valores.veiculo}
            onChangeText={(t) => alterar('veiculo', t)}
            onBlur={() => aoSair('veiculo')}
            error={erros.veiculo}
            maxLength={60}
            editable={!enviando}
          />

          <View style={styles.linha}>
            <View style={styles.metade}>
              <FormField
                label="Data"
                placeholder="DD/MM/AAAA"
                value={valores.data}
                onChangeText={(t) => alterar('data', t)}
                onBlur={() => aoSair('data')}
                error={erros.data}
                keyboardType="number-pad"
                maxLength={10}
                editable={!enviando}
              />
            </View>
            <View style={styles.metade}>
              <FormField
                label="Horário"
                placeholder="HH:MM"
                value={valores.hora}
                onChangeText={(t) => alterar('hora', t)}
                onBlur={() => aoSair('hora')}
                error={erros.hora}
                keyboardType="number-pad"
                maxLength={5}
                editable={!enviando}
              />
            </View>
          </View>

          <Pressable style={[styles.botao, enviando && styles.botaoDesativado]} onPress={agendar} disabled={enviando}>
            {enviando ? <ActivityIndicator color={colors.white} /> : <Text style={styles.botaoTexto}>Agendar</Text>}
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  body: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  card: { width: '100%', maxWidth: 400, backgroundColor: colors.card, borderRadius: 8, padding: 16 },
  bannerError: { backgroundColor: '#F8DEDC', borderRadius: 6, padding: 10, marginBottom: 14 },
  bannerErrorText: { color: '#B3261E', fontSize: 13 },
  sugestoes: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  chip: { borderWidth: 1, borderColor: '#999', borderRadius: 999, paddingVertical: 6, paddingHorizontal: 12 },
  chipAtivo: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipTexto: { fontSize: 13, color: colors.text },
  chipTextoAtivo: { fontWeight: '700', color: '#000' },
  linha: { flexDirection: 'row', gap: 12 },
  metade: { flex: 1 },
  botao: {
    backgroundColor: colors.dark,
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    marginTop: 4,
  },
  botaoDesativado: { opacity: 0.7 },
  botaoTexto: { color: colors.white, fontSize: 14 },
});
