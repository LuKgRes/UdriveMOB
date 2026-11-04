import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/colors';

type Props = { title: string; children: ReactNode };

export function ScreenBody({ title, children }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 16, paddingTop: 16 },
  title: { fontSize: 24, fontWeight: '700', color: colors.white, marginBottom: 12 },
});
