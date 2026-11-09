import { listarPendentes, Pendente } from '@/api/dados';
import { InfoCard } from '@/components/InfoCard';
import { ListaApi } from '@/components/ListaApi';
import { ScreenBody } from '@/components/ScreenBody';
import { useCarregar } from '@/hooks/useCarregar';
import { formatarDataHora } from '@/utils/format';

export default function Pendentes() {
  const { dados, carregando, erro, atualizando, atualizar } = useCarregar(listarPendentes);

  return (
    <ScreenBody title="Serviços pendentes">
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
            rows={[
              { label: 'Cliente', value: item.cliente },
              { label: 'Veículo', value: item.veiculo },
              { label: 'Serviço', value: item.servico },
              { label: 'Data', value: formatarDataHora(item.dataHora) },
            ]}
          />
        )}
      />
    </ScreenBody>
  );
}
