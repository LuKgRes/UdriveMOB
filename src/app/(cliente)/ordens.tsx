import { listarOrdens, Ordem } from '@/api/dados';
import { InfoCard } from '@/components/InfoCard';
import { ListaApi } from '@/components/ListaApi';
import { ScreenBody } from '@/components/ScreenBody';
import { useCarregar } from '@/hooks/useCarregar';
import { formatarData, formatarValor } from '@/utils/format';

export default function Ordens() {
  const { dados, carregando, erro, atualizando, atualizar } = useCarregar(listarOrdens);

  return (
    <ScreenBody title="Ordens de serviço">
      <ListaApi<Ordem>
        dados={dados}
        carregando={carregando}
        erro={erro}
        atualizando={atualizando}
        onAtualizar={atualizar}
        textoVazio="Você ainda não tem ordens de serviço. Elas aparecem aqui quando a oficina abrir uma para o seu veículo."
        keyExtractor={(item) => String(item.id)}
        renderItem={(item) => (
          <InfoCard
            badge={item.status}
            rows={[
              { label: 'Ordem', value: item.numero },
              { label: 'Serviço', value: item.servico },
              { label: 'Veículo', value: item.veiculo },
              { label: 'Data', value: formatarData(item.criadoEm) },
              { label: 'Valor', value: formatarValor(item.valorCentavos) },
            ]}
          />
        )}
      />
    </ScreenBody>
  );
}
