import { useQuery } from '@tanstack/react-query';
import { QueryKey } from 'libs/queries/queryKey';
import { ONE_HOUR_IN_MS } from 'utils/time';
import { useGetAllStrategies } from './strategy';
import { Token } from 'libs/tokens';

export const useGetAllPairs = () => {
  const { data: strategies } = useGetAllStrategies({ enabled: true });
  return useQuery({
    queryKey: QueryKey.pairs(),
    queryFn: () => {
      const map = new Map<string, [Token, Token]>();
      for (const s of strategies ?? []) {
        const key = `${s.base.address}_${s.quote.address}`;
        map.set(key, [s.base, s.quote]);
      }
      return Array.from(map.values());
    },
    enabled: !!strategies,
    staleTime: ONE_HOUR_IN_MS,
    refetchOnWindowFocus: false,
  });
};
