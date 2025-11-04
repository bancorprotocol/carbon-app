import { useNavigate, useSearch } from '@tanstack/react-router';
import { getLastVisitedPair } from 'libs/routing';
import { useEffect, useMemo } from 'react';
import { useToken } from './useTokens';
import { lsService } from 'services/localeStorage';
import { isAddress } from 'ethers';

export const usePersistLastPair = ({
  from,
}: {
  from: '/simulate' | '/trade';
}) => {
  const search = useSearch({ from });
  const navigate = useNavigate({ from });
  const defaultPair = useMemo(() => getLastVisitedPair(), []);

  const baseAddress = isAddress(search.base) ? search.base : defaultPair.base;
  const quoteAddress = isAddress(search.quote)
    ? search.quote
    : defaultPair.quote;

  const base = useToken(baseAddress);
  const quote = useToken(quoteAddress);
  const isPending = base.isPending || quote.isPending;

  useEffect(() => {
    if (!base.token || !quote.token) return;
    lsService.setItem('tradePair', [base.token.address, quote.token.address]);
  }, [base.token, quote.token, search.base, search.quote]);

  useEffect(() => {
    if (base.token && quote.token) return;
    navigate({
      search: {
        ...search,
        base: base.token?.address || defaultPair.base,
        quote: quote.token?.address || defaultPair.quote,
      },
      replace: true,
    });
  }, [
    search,
    navigate,
    defaultPair.base,
    defaultPair.quote,
    base.token,
    quote.token,
    base,
    quote,
  ]);

  return {
    base: base.token,
    quote: quote.token,
    isPending,
  };
};
