import { useQuery } from '@tanstack/react-query';
import { useVoucher } from 'hooks/useContract';
import { QueryKey } from 'libs/queries/queryKey';
import { ONE_DAY_IN_MS } from 'utils/time';

export const useGetVoucherOwner = (id?: string) => {
  const { data: contract, isPending } = useVoucher();

  return useQuery({
    queryKey: QueryKey.voucherOwner(id),
    queryFn: () => contract?.read.ownerOf(id ?? ''),
    enabled: !!id && !isPending,
    retry: 1,
    staleTime: ONE_DAY_IN_MS,
  });
};
