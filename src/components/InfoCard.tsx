import { StyleSheet, Text, View } from 'react-native';
import { colors, statusColors } from '@/constants/colors';

type Props = {
  rows: { label: string; value: string }[];
  badge?: string;
};

export function InfoCard({ rows, badge }: Props) {
  return (
    <View style={styles.card}>
      {badge && (
        <View style={[styles.badge, { backgroundColor: statusColors[badge] ?? colors.primary }]}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
      {rows.map((row) => (
        <View key={row.label} style={styles.row}>
          <Text style={styles.label}>{row.label}</Text>
          <Text style={styles.value}>{row.value}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.table,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  row: { marginBottom: 8 },
  label: { fontSize: 12, fontWeight: '700', color: colors.muted, marginBottom: 2 },
  value: { fontSize: 15, color: colors.white },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 12,
  },
  badgeText: { fontSize: 12, fontWeight: '700', color: '#000' },
});
