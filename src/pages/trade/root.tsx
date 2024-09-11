import { Outlet } from '@tanstack/react-router';
import { NotFound } from 'components/common/NotFound';
import { TradeProvider } from 'components/trade/TradeContext';
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

const url = '/trade';
export const TradeRoot = () => {
  const { base, quote } = usePersistLastPair(url);
  if (!base || !quote) {
    return (
      <NotFound
        variant="error"
        title="Token not found"
        text="Could not found base or quote token"
      />
    );
  }
  return (
    <TradeProvider base={base} quote={quote}>
      <div className="m-auto flex w-[1620px] max-w-[100vw] flex-col gap-20 p-20 md:grid md:grid-cols-[450px_auto]">
        <Outlet />
      </div>
    </TradeProvider>
  );
};
