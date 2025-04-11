import { Outlet } from '@tanstack/react-router';
import { NotFound } from 'components/common/NotFound';
import { TradeProvider } from 'components/trade/TradeContext';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useToken } from 'hooks/useTokens';
import { TradeSearch } from 'libs/routing';
import { getLastVisitedPair } from 'libs/routing/utils';
import { useEffect } from 'react';
import { lsService } from 'services/localeStorage';

export const usePersistLastPair = (from: '/trade') => {
  const search = useSearch({ strict: false }) as TradeSearch;
  const defaultPair = getLastVisitedPair();
  const base = useToken(search.base ?? defaultPair.base);
  const quote = useToken(search.quote ?? defaultPair.quote);

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
      <div className="mx-auto flex w-full max-w-[1920px] flex-col content-start gap-16 p-16 md:grid md:grid-cols-[450px_auto]">
        <Outlet />
      </div>
    </TradeProvider>
  );
};
