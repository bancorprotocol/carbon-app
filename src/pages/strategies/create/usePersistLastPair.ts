import { useNavigate, useSearch } from '@tanstack/react-router';
import { useTokens } from 'hooks/useTokens';
import { TradeSearch } from 'libs/routing';
import { getLastVisitedPair } from 'libs/routing/utils';
import { useEffect } from 'react';
import { lsService } from 'services/localeStorage';

export const usePersistLastPair = (from: '/trade') => {
  const { getTokenById } = useTokens();
  const search = useSearch({ strict: false }) as TradeSearch;
  const defaultPair = getLastVisitedPair();
  const base = getTokenById(search.base ?? defaultPair.base);
  const quote = getTokenById(search.quote ?? defaultPair.quote);

  useEffect(() => {
    if (!base || !quote) return;
    lsService.setItem('tradePair', [base.address, quote.address]);
  }, [base, quote]);

  const navigate = useNavigate({ from });
  useEffect(() => {
    if (search.base && search.quote) return;
    navigate({
      search: { ...search, ...getLastVisitedPair() },
      params: {},
      replace: true,
    });
  }, [search, navigate]);

  return { base, quote };
};
