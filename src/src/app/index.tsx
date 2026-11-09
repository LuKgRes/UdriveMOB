import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { ApiError } from '@/api/client';
import { FormField } from '@/components/FormField';
import { colors } from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { LIMITES, validarEmail, validarSenha } from '@/utils/validation';

export default function Login() {
  const router = useRouter();
  const { usuario, signIn } = useAuth();
  const params = useLocalSearchParams<{ cadastrado?: string; email?: string }>();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erroEmail, setErroEmail] = useState('');
  const [erroSenha, setErroSenha] = useState('');
  const [erroGeral, setErroGeral] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [enviando, setEnviando] = useState(false);

  // Quando volta da tela de cadastro, preenche o e-mail e mostra o aviso
  useEffect(() => {
    if (params.cadastrado === '1') {
      setEmail(params.email ?? '');
      setSenha('');
      setSucesso('Cadastro realizado! Entre com seu e-mail e senha.');
    }
  }, [params.cadastrado, params.email]);

  // Já logado (login feito agora ou sessão salva): vai direto para a área do perfil
  if (usuario) {
    return <Redirect href={usuario.perfil === 'mecanico' ? '/(mecanico)/pendentes' : '/(cliente)/agendamentos'} />;
  }

  async function entrar() {
    if (enviando) return;

    const eEmail = validarEmail(email);
    const eSenha = validarSenha(senha);
    setErroEmail(eEmail);
    setErroSenha(eSenha);
    setErroGeral('');
    setSucesso('');
    if (eEmail || eSenha) return;

    setEnviando(true);
    try {
      await signIn(email.trim(), senha);
      // O redirecionamento é feito acima, quando o usuário passa a existir
    } catch (e) {
      setErroGeral(e instanceof ApiError ? e.message : 'Algo deu errado. Tente novamente.');
      setEnviando(false);
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>BEM-VINDO!</Text>
      </View>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
          <Image source={require('../../assets/images/logo.png')} style={styles.logo} resizeMode="contain" />

          <View style={styles.card}>
            {!!sucesso && (
              <View style={[styles.banner, styles.bannerSuccess]}>
                <Text style={styles.bannerSuccessText}>{sucesso}</Text>
              </View>
            )}
            {!!erroGeral && (
              <View style={[styles.banner, styles.bannerError]}>
                <Text style={styles.bannerErrorText}>{erroGeral}</Text>
              </View>
            )}

            <FormField
              label="Email"
              placeholder="inserir endereço e-mail"
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                setErroEmail('');
                setErroGeral('');
              }}
              onBlur={() => setErroEmail(validarEmail(email))}
              error={erroEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={LIMITES.emailMax}
              editable={!enviando}
            />

            <FormField
              label="Senha"
              placeholder="Senha"
              value={senha}
              onChangeText={(t) => {
                setSenha(t);
                setErroSenha('');
                setErroGeral('');
              }}
              onBlur={() => setErroSenha(validarSenha(senha))}
              error={erroSenha}
              secure
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={LIMITES.senhaMax}
              onSubmitEditing={entrar}
              editable={!enviando}
            />

            <Pressable style={[styles.buttonPrimary, enviando && styles.buttonDisabled]} onPress={entrar} disabled={enviando}>
              {enviando ? <ActivityIndicator color={colors.white} /> : <Text style={styles.buttonText}>Entrar</Text>}
            </Pressable>

            <Pressable>
              <Text style={styles.link}>Esqueceu sua senha?</Text>
            </Pressable>

            <Pressable style={styles.buttonSecondary} onPress={() => router.push('/cadastro')} disabled={enviando}>
              <Text style={styles.buttonText}>Cadastrar</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.footer} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, backgroundColor: colors.primary },
  header: { height: 64, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#000' },
  body: {
    flexGrow: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  logo: { width: 180, height: 80, marginBottom: 8 },
  card: { width: '100%', maxWidth: 400, backgroundColor: colors.card, borderRadius: 8, padding: 16 },
  banner: { borderRadius: 6, padding: 10, marginBottom: 14 },
  bannerSuccess: { backgroundColor: '#DFF2E5' },
  bannerSuccessText: { color: '#1E6B3A', fontSize: 13 },
  bannerError: { backgroundColor: '#F8DEDC' },
  bannerErrorText: { color: '#B3261E', fontSize: 13 },
  buttonPrimary: {
    backgroundColor: colors.dark,
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 16,
    minHeight: 40,
    justifyContent: 'center',
  },
  buttonDisabled: { opacity: 0.7 },
  buttonSecondary: {
    backgroundColor: colors.dark,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignSelf: 'center',
    marginTop: 24,
  },
  buttonText: { color: colors.white, fontSize: 14 },
  link: { fontSize: 13, color: colors.text, textDecorationLine: 'underline' },
  footer: { height: 40, backgroundColor: colors.primary },
});
