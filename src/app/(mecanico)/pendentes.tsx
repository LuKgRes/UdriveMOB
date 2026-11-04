import { FlatList } from 'react-native';
import { InfoCard } from '@/components/InfoCard';
import { ScreenBody } from '@/components/ScreenBody';
import { pendentes } from '@/data/mock';

export default function Pendentes() {
  return (
    <ScreenBody title="Serviços pendentes">
      <FlatList
        data={pendentes}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <InfoCard
            rows={[
              { label: 'Cliente', value: item.cliente },
              { label: 'Veículo', value: item.veiculo },
              { label: 'Serviço', value: item.servico },
              { label: 'Data', value: item.data },
            ]}
          />
        )}
      />
    </ScreenBody>
  );
}
