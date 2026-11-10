import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { concluirAgendamento, listarPendentes, Pendente } from '@/api/dados';
import { ApiError } from '@/api/client';
import { InfoCard } from '@/components/InfoCard';
import { ListaApi } from '@/components/ListaApi';
import { ScreenBody } from '@/components/ScreenBody';
import { statusColors } from '@/constants/colors';
import { useCarregar } from '@/hooks/useCarregar';
import { confirmar } from '@/utils/confirmar';
import { formatarDataHora } from '@/utils/format';

export default function Pendentes() {
  const { dados, carregando, erro, atualizando, atualizar } = useCarregar(listarPendentes);
  const [concluindo, setConcluindo] = useState<number | null>(null);
  const [erroAcao, setErroAcao] = useState('');

  async function concluir(item: Pendente) {
    if (concluindo !== null) return;

    const ok = await confirmar(
      'Concluir serviço',
      `Marcar “${item.servico}” de ${item.cliente} como concluído?`,
      'Concluir',
    );
    if (!ok) return;

    setConcluindo(item.id);
    setErroAcao('');
    try {
      await concluirAgendamento(item.id);
    } catch (e) {
      setErroAcao(e instanceof ApiError ? e.message : 'Não foi possível concluir o serviço. Tente de novo.');
    }
    await atualizar(); // o serviço concluído sai da lista (ou a lista se corrige, se algo mudou)
    setConcluindo(null);
  }

  return (
    <ScreenBody title="Serviços pendentes">
      {!!erroAcao && (
        <View style={styles.aviso}>
          <Text style={styles.avisoTexto}>{erroAcao}</Text>
        </View>
      )}

      <ListaApi<Pendente>
        dados={dados}
        carregando={carregando}
        erro={erro}
        atualizando={atualizando}
        onAtualizar={atualizar}
        textoVazio="Nenhum serviço pendente no momento."
        keyExtractor={(item) => String(item.id)}
        renderItem={(item) => (
          <InfoCard
            badge={item.estado}
            rows={[
              { label: 'Cliente', value: item.cliente },
              { label: 'Veículo', value: item.veiculo },
              { label: 'Serviço', value: item.servico },
              { label: 'Data', value: formatarDataHora(item.dataHora) },
            ]}
          >
            <Pressable
              style={[styles.botao, concluindo !== null && styles.botaoDesativado]}
              onPress={() => concluir(item)}
              disabled={concluindo !== null}
            >
              {concluindo === item.id ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.botaoTexto}>Marcar como concluído</Text>
              )}
            </Pressable>
          </InfoCard>
        )}
      />
    </ScreenBody>
  );
}

const styles = StyleSheet.create({
  aviso: { backgroundColor: '#F8DEDC', borderRadius: 8, padding: 10, marginBottom: 12 },
  avisoTexto: { color: '#B3261E', fontSize: 13 },
  botao: {
    backgroundColor: statusColors['Concluído'],
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
    marginTop: 4,
  },
  botaoDesativado: { opacity: 0.6 },
  botaoTexto: { color: '#000', fontSize: 14, fontWeight: '700' },
});
