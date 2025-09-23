import { Outlet } from '@tanstack/react-router';
import { NotFound } from 'components/common/NotFound';
import { TradeProvider } from 'components/trade/TradeContext';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useToken } from 'hooks/useTokens';
import { TradeSearch } from 'libs/routing';
import { getLastVisitedPair } from 'libs/routing/utils';
import { useEffect } from 'react';
import { lsService } from 'services/localeStorage';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { TokenSelection } from 'components/strategies/common/TokenSelection';
import { TradeNav } from 'components/trade/TradeNav';

const usePersistLastPair = (from: '/trade') => {
  const search = useSearch({ strict: false }) as TradeSearch;
  const defaultPair = getLastVisitedPair();
  const base = useToken(search.base ?? defaultPair.base);
  const quote = useToken(search.quote ?? defaultPair.quote);

  useEffect(() => {
    if (!base.token || !quote.token) return;
    lsService.setItem('tradePair', [base.token.address, quote.token.address]);
  }, [base.token, quote.token]);

  const navigate = useNavigate({ from });
  useEffect(() => {
    if (search.base && search.quote) return;
    navigate({
      search: { ...search, ...getLastVisitedPair() },
      params: {},
      replace: true,
    });
  }, [search, navigate]);

  return {
    base: base.token,
    quote: quote.token,
    isPending: base.isPending || quote.isPending,
  };
};

const url = '/trade';
export const TradeRoot = () => {
  const { base, quote, isPending } = usePersistLastPair(url);

  if (isPending) {
    return <CarbonLogoLoading className="h-80 place-self-center" />;
  }
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
      <div className="mx-auto grid w-full content-start md:justify-center gap-16 p-16 2xl:grid-cols-[350px_1fr] max-w-[1920px]">
        <div className="2xl:grid xl:flex grid gap-8 content-start">
          <TokenSelection />
          <TradeNav />
        </div>
        <div className="xl:grid xl:grid-cols-[auto_450px] gap-16 flex flex-col-reverse">
          <Outlet />
        </div>
      </div>
    </TradeProvider>
  );
};
