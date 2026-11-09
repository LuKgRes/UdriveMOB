import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Agendamento, listarAgendamentos } from '@/api/dados';
import { InfoCard } from '@/components/InfoCard';
import { ListaApi } from '@/components/ListaApi';
import { ScreenBody } from '@/components/ScreenBody';
import { colors } from '@/constants/colors';
import { useCarregar } from '@/hooks/useCarregar';
import { formatarDataHora } from '@/utils/format';

export default function Agendamentos() {
  const router = useRouter();
  const { dados, carregando, erro, atualizando, atualizar } = useCarregar(listarAgendamentos);

  return (
    <ScreenBody title="Meus agendamentos">
      <View style={styles.acoes}>
        <Pressable style={styles.botao} onPress={() => router.push('/novo-agendamento')}>
          <Text style={styles.botaoTexto}>Agendar serviço</Text>
        </Pressable>
        <Pressable style={styles.botao} onPress={() => router.push('/novo-agendamento?tipo=personalizado')}>
          <Text style={styles.botaoTexto}>Serviço personalizado</Text>
        </Pressable>
      </View>

      <ListaApi<Agendamento>
        dados={dados}
        carregando={carregando}
        erro={erro}
        atualizando={atualizando}
        onAtualizar={atualizar}
        textoVazio="Você ainda não tem agendamentos. Toque em “Agendar serviço” para marcar o primeiro."
        keyExtractor={(item) => String(item.id)}
        renderItem={(item) => (
          <InfoCard
            badge={item.estado}
            rows={[
              { label: 'Serviço', value: item.servico },
              { label: 'Veículo', value: item.veiculo },
              { label: 'Data', value: formatarDataHora(item.dataHora) },
            ]}
          />
        )}
      />
    </ScreenBody>
  );
}

const styles = StyleSheet.create({
  acoes: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  botao: { backgroundColor: colors.dark, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 16 },
  botaoTexto: { color: colors.white, fontSize: 14, fontWeight: '600' },
});
