import { useQuery } from '@tanstack/react-query';
import { useContract } from 'hooks/useContract';
import { QueryKey } from 'libs/queries/queryKey';
import { ONE_DAY_IN_MS } from 'utils/time';

export const useGetVoucherOwner = (id?: string) => {
  const { Voucher } = useContract();

  return useQuery({
    queryKey: QueryKey.voucherOwner(id),
    queryFn: () => Voucher.read.ownerOf(id ?? ''),
    enabled: !!id,
    retry: 1,
    staleTime: ONE_DAY_IN_MS,
  });
};
