import { FlatList } from 'react-native';
import { InfoCard } from '@/components/InfoCard';
import { ScreenBody } from '@/components/ScreenBody';
import { ordens } from '@/data/mock';

export default function Ordens() {
  return (
    <ScreenBody title="Ordens de serviço">
      <FlatList
        data={ordens}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <InfoCard
            badge={item.status}
            rows={[
              { label: 'Ordem', value: item.numero },
              { label: 'Serviço', value: item.servico },
              { label: 'Veículo', value: item.veiculo },
              { label: 'Data', value: item.data },
              { label: 'Valor', value: item.valor },
            ]}
          />
        )}
      />
    </ScreenBody>
  );
}
