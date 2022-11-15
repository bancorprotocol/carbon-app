import { useOrder } from './useOrder';
import { useCreateStrategy } from 'queries';
import { useState } from 'react';

export const useCreate = () => {
  const source = useOrder();
  const target = useOrder();
  const [txBusy, setTxBusy] = useState(false);
  const mutation = useCreateStrategy();

  const create = async () => {
    setTxBusy(true);
    mutation.mutate(
      { source, target },
      {
        onSuccess: async (tx) => {
          console.log('tx hash', tx.hash);
          await tx.wait();
          setTxBusy(false);
        },
        onError: () => {
          setTxBusy(false);
        },
      }
    );
  };

  return { source, target, create, txBusy };
};
