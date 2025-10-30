import { useNavigate, useSearch } from '@tanstack/react-router';
import { getLastVisitedPair } from 'libs/routing';
import { useEffect, useMemo } from 'react';
import { useToken } from './useTokens';
import { lsService } from 'services/localeStorage';

export const usePersistLastPair = ({
  from,
}: {
  from: '/simulate' | '/trade';
}) => {
  const search = useSearch({ from });
  const defaultPair = useMemo(() => getLastVisitedPair(), []);
  const base = useToken(search.base ?? defaultPair.base);
  const quote = useToken(search.quote ?? defaultPair.quote);

  useEffect(() => {
    if (!search.base || !search.quote) return;
    lsService.setItem('tradePair', [search.base, search.quote]);
  }, [search.base, search.quote]);

  const navigate = useNavigate({ from });
  useEffect(() => {
    if (search.base && search.quote) return;
    navigate({
      search: {
        ...search,
        base: defaultPair.base,
        quote: defaultPair.quote,
      },
      replace: true,
    });
  }, [search, navigate, defaultPair.base, defaultPair.quote]);

  return {
    base: base.token,
    quote: quote.token,
    isPending: base.isPending || quote.isPending,
  };
};
