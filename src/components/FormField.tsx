import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';

const ERROR_COLOR = '#B3261E';

type Props = TextInputProps & {
  label: string;
  error?: string;
  /** Campo de senha, com botão de mostrar/ocultar */
  secure?: boolean;
};

export function FormField({ label, error, secure, ...inputProps }: Props) {
  const [hidden, setHidden] = useState(!!secure);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputBox, !!error && styles.inputBoxError]}>
        <TextInput
          {...inputProps}
          style={styles.input}
          secureTextEntry={hidden}
          placeholderTextColor={colors.placeholder}
        />
        {secure && (
          <Pressable onPress={() => setHidden((h) => !h)} hitSlop={8}>
            <Ionicons name={hidden ? 'eye-outline' : 'eye-off-outline'} size={20} color="#777" />
          </Pressable>
        )}
      </View>
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 14 },
  label: { fontSize: 13, color: colors.text, marginBottom: 6 },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
  },
  inputBoxError: { borderColor: ERROR_COLOR },
  input: { flex: 1, paddingVertical: 10, fontSize: 14, color: colors.text },
  error: { fontSize: 12, color: ERROR_COLOR, marginTop: 4 },
});
