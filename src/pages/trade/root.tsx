import { Outlet } from '@tanstack/react-router';
import { NotFound } from 'components/common/NotFound';
import { TradeProvider } from 'components/trade/TradeContext';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useToken } from 'hooks/useTokens';
import { getLastVisitedPair } from 'libs/routing/utils';
import { useEffect, useMemo } from 'react';
import { lsService } from 'services/localeStorage';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';

const usePersistLastPair = () => {
  const search = useSearch({ from: '/trade' });
  const defaultPair = useMemo(() => getLastVisitedPair(), []);
  const base = useToken(search.base ?? defaultPair.base);
  const quote = useToken(search.quote ?? defaultPair.quote);

  useEffect(() => {
    if (!base.token || !quote.token) return;
    lsService.setItem('tradePair', [base.token.address, quote.token.address]);
  }, [base.token, quote.token]);

  const navigate = useNavigate({ from: '/trade' });
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

export const TradeRoot = () => {
  const { base, quote, isPending } = usePersistLastPair();

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
      <div className="mx-auto flex w-full max-w-[1920px] flex-col-reverse content-start gap-16 p-16 md:grid md:grid-cols-[auto_450px]">
        <Outlet />
      </div>
    </TradeProvider>
  );
};
