import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { InfoCard } from '@/components/InfoCard';
import { ScreenBody } from '@/components/ScreenBody';
import { colors } from '@/constants/colors';
import { agendamentos } from '@/data/mock';

export default function Agendamentos() {
  return (
    <ScreenBody title="Meus agendamentos">
      <View style={styles.actions}>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Agendar serviço</Text>
        </Pressable>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Serviço personalizado</Text>
        </Pressable>
      </View>

      <FlatList
        data={agendamentos}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <InfoCard
            badge={item.estado}
            rows={[
              { label: 'Serviço', value: item.servico },
              { label: 'Veículo', value: item.veiculo },
              { label: 'Data', value: item.data },
            ]}
          />
        )}
      />
    </ScreenBody>
  );
}

const styles = StyleSheet.create({
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  button: { backgroundColor: colors.dark, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 16 },
  buttonText: { color: colors.white, fontSize: 14, fontWeight: '600' },
});
