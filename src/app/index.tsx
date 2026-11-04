import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';

export default function Login() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>BEM-VINDO!</Text>
      </View>

      <View style={styles.body}>
        <Image source={require('../../assets/images/logo.png')} style={styles.logo} resizeMode="contain" />

        <View style={styles.card}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="inserir endereço e-mail"
            placeholderTextColor={colors.placeholder}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Senha</Text>
          <TextInput style={styles.input} placeholder="Senha" placeholderTextColor={colors.placeholder} secureTextEntry />

          {/* Provisório: sem login real ainda, só navega para a visão do cliente */}
          <Pressable style={styles.buttonPrimary} onPress={() => router.replace('/(cliente)/agendamentos')}>
            <Text style={styles.buttonText}>Entrar</Text>
          </Pressable>

          <Pressable>
            <Text style={styles.link}>Esqueceu sua senha?</Text>
          </Pressable>

          <Pressable style={styles.buttonSecondary}>
            <Text style={styles.buttonText}>Cadastrar</Text>
          </Pressable>
        </View>

        {/* Provisório: atalho para testar a visão do mecânico. Remover quando houver login real */}
        <Pressable onPress={() => router.replace('/(mecanico)/pendentes')} style={styles.testLink}>
          <Text style={styles.testLinkText}>Entrar como mecânico (teste)</Text>
        </Pressable>
      </View>

      <View style={styles.footer} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary },
  header: { height: 64, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#000' },
  body: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logo: { width: 180, height: 80, marginBottom: 8 },
  card: { width: '100%', maxWidth: 400, backgroundColor: colors.card, borderRadius: 8, padding: 16 },
  label: { fontSize: 13, color: colors.text, marginBottom: 6 },
  input: {
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 16,
  },
  buttonPrimary: { backgroundColor: colors.dark, borderRadius: 6, paddingVertical: 10, alignItems: 'center', marginBottom: 16 },
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
  testLink: { marginTop: 16 },
  testLinkText: { color: colors.white, textDecorationLine: 'underline', fontSize: 13 },
  footer: { height: 40, backgroundColor: colors.primary },
});
