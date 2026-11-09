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
import { useRouter } from 'expo-router';
import { cadastrar as cadastrarNaApi } from '@/api/auth';
import { ApiError } from '@/api/client';
import { FormField } from '@/components/FormField';
import { colors } from '@/constants/colors';
import {
  LIMITES,
  formatarTelefone,
  validarConfirmacao,
  validarEmail,
  validarNome,
  validarSenha,
  validarTelefone,
} from '@/utils/validation';

type Campo = 'nome' | 'email' | 'telefone' | 'senha' | 'confirmacao';
type Valores = Record<Campo, string>;

const vazio: Valores = { nome: '', email: '', telefone: '', senha: '', confirmacao: '' };
const CAMPOS: Campo[] = ['nome', 'email', 'telefone', 'senha', 'confirmacao'];

export default function Cadastro() {
  const router = useRouter();
  const [valores, setValores] = useState<Valores>(vazio);
  const [erros, setErros] = useState<Valores>(vazio);
  const [erroGeral, setErroGeral] = useState('');
  const [enviando, setEnviando] = useState(false);

  function validarCampo(campo: Campo): string {
    switch (campo) {
      case 'nome':
        return validarNome(valores.nome);
      case 'email':
        return validarEmail(valores.email);
      case 'telefone':
        return validarTelefone(valores.telefone);
      case 'senha':
        return validarSenha(valores.senha);
      case 'confirmacao':
        return validarConfirmacao(valores.senha, valores.confirmacao);
      default:
        return '';
    }
  }

  function alterar(campo: Campo, texto: string) {
    const valor = campo === 'telefone' ? formatarTelefone(texto) : texto;
    setValores((prev) => ({ ...prev, [campo]: valor }));
    if (erros[campo]) setErros((prev) => ({ ...prev, [campo]: '' }));
    setErroGeral('');
  }

  function aoSair(campo: Campo) {
    setErros((prev) => ({ ...prev, [campo]: validarCampo(campo) }));
  }

  async function cadastrar() {
    if (enviando) return;

    const novosErros: Valores = {
      nome: validarCampo('nome'),
      email: validarCampo('email'),
      telefone: validarCampo('telefone'),
      senha: validarCampo('senha'),
      confirmacao: validarCampo('confirmacao'),
    };
    setErros(novosErros);
    setErroGeral('');
    if (Object.values(novosErros).some(Boolean)) return;

    setEnviando(true);
    try {
      await cadastrarNaApi({
        nome: valores.nome.trim(),
        email: valores.email.trim(),
        telefone: valores.telefone,
        senha: valores.senha,
      });

      router.navigate({
        pathname: '/',
        params: { cadastrado: '1', email: valores.email.trim().toLowerCase() },
      });
    } catch (e) {
      if (e instanceof ApiError && e.status === 409) {
        setErros((prev) => ({ ...prev, email: e.message }));
      } else if (e instanceof ApiError && e.status === 400 && e.campos) {
        const doServidor = { ...vazio };
        for (const campo of CAMPOS) {
          const msg = e.campos[campo]?.[0];
          if (msg) doServidor[campo] = msg;
        }
        setErros(doServidor);
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

          <FormField
            label="Nome completo"
            placeholder="Nome e sobrenome"
            value={valores.nome}
            onChangeText={(t) => alterar('nome', t)}
            onBlur={() => aoSair('nome')}
            error={erros.nome}
            autoCapitalize="words"
            maxLength={LIMITES.nomeMax}
            editable={!enviando}
          />

          <FormField
            label="Email"
            placeholder="inserir endereço e-mail"
            value={valores.email}
            onChangeText={(t) => alterar('email', t)}
            onBlur={() => aoSair('email')}
            error={erros.email}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={LIMITES.emailMax}
            editable={!enviando}
          />

          <FormField
            label="Telefone"
            placeholder="(00) 00000-0000"
            value={valores.telefone}
            onChangeText={(t) => alterar('telefone', t)}
            onBlur={() => aoSair('telefone')}
            error={erros.telefone}
            keyboardType="phone-pad"
            maxLength={15}
            editable={!enviando}
          />

          <FormField
            label="Senha"
            placeholder={`Mínimo de ${LIMITES.senhaMin} caracteres`}
            value={valores.senha}
            onChangeText={(t) => alterar('senha', t)}
            onBlur={() => aoSair('senha')}
            error={erros.senha}
            secure
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={LIMITES.senhaMax}
            editable={!enviando}
          />

          <FormField
            label="Confirmar senha"
            placeholder="Repita a senha"
            value={valores.confirmacao}
            onChangeText={(t) => alterar('confirmacao', t)}
            onBlur={() => aoSair('confirmacao')}
            error={erros.confirmacao}
            secure
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={LIMITES.senhaMax}
            onSubmitEditing={cadastrar}
            editable={!enviando}
          />

          <Pressable style={[styles.buttonPrimary, enviando && styles.buttonDisabled]} onPress={cadastrar} disabled={enviando}>
            {enviando ? <ActivityIndicator color={colors.white} /> : <Text style={styles.buttonText}>Criar conta</Text>}
          </Pressable>

          <Pressable onPress={() => router.back()} disabled={enviando}>
            <Text style={styles.link}>Já tem conta? Entrar</Text>
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
  buttonPrimary: {
    backgroundColor: colors.dark,
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 16,
    minHeight: 44,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: colors.white, fontSize: 14 },
  link: { fontSize: 13, color: colors.text, textDecorationLine: 'underline', alignSelf: 'center' },
});
