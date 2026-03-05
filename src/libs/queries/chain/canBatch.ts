import { useQuery } from '@tanstack/react-query';
import { useWagmi } from 'libs/wagmi';
import { useBatchTransaction } from 'libs/wagmi/batch-transaction';
import { QueryKey } from '../queryKey';

export const useCanBatchTransactions = () => {
  const { walletAccount } = useWagmi();
  const { canBatchTransactions } = useBatchTransaction();
  return useQuery({
    queryKey: QueryKey.canBatch(walletAccount),
    queryFn: () => canBatchTransactions(walletAccount),
  });
};
