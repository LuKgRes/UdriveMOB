import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Login() {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
     
      <View style={styles.header}>
        <Text style={styles.headerTitle}>BEM-VINDO!</Text>
      </View>

    
      <View style={styles.body}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <View style={styles.card}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="inserir endereço e-mail"
            placeholderTextColor="#B0B0B0"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor="#B0B0B0"
            secureTextEntry
          />

          <Pressable style={styles.buttonPrimary}>
            <Text style={styles.buttonText}>Entrar</Text>
          </Pressable>

          <Pressable>
            <Text style={styles.link}>Esqueceu sua senha?</Text>
          </Pressable>

          <Pressable style={styles.buttonSecondary}>
            <Text style={styles.buttonText}>Cadastrar</Text>
          </Pressable>
        </View>
      </View>


      <View style={styles.footer} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5FB4CD',
  },
  header: {
    height: 64,
    backgroundColor: '#5FB4CD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#000',
  },
  body: {
    flex: 1,
    backgroundColor: '#858585',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logo: {
    width: 230,
    height: 130,
    marginBottom: 8,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#E8E8E8',
    borderRadius: 8,
    padding: 16,
  },
  label: {
    fontSize: 13,
    color: '#222',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 16,
  },
  buttonPrimary: {
    backgroundColor: '#2B2B2B',
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonSecondary: {
    backgroundColor: '#2B2B2B',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignSelf: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
  link: {
    fontSize: 13,
    color: '#222',
    textDecorationLine: 'underline',
  },
  footer: {
    height: 40,
    backgroundColor: '#5FB4CD',
  },
});