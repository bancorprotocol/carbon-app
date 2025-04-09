import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { TradeLayout } from 'components/trade/TradeLayout';
import { FC, ReactNode } from 'react';
import { InitMarketPrice } from '../common/InitMarketPrice';
import { useTradeCtx } from 'components/trade/TradeContext';
import { useSearch } from '@tanstack/react-router';
import { useMarketPrice } from 'hooks/useMarketPrice';

interface Props {
  url: '/trade/disposable' | '/trade/recurring' | '/trade/overlapping';
  children: ReactNode;
}

export const CreateLayout: FC<Props> = ({ children, url }) => {
  const { base, quote } = useTradeCtx();
  const search = useSearch({ from: url });
  const marketQuery = useMarketPrice({ base, quote });
  const marketPrice = search.marketPrice ?? marketQuery.marketPrice?.toString();

  if (!marketPrice && marketQuery.isPending) {
    return (
      <TradeLayout>
        <CarbonLogoLoading className="h-[80px] place-self-center" />
      </TradeLayout>
    );
  }

  if (!marketPrice) {
    return (
      <TradeLayout>
        <article
          key="marketPrice"
          className="bg-background-900 rounded-ee rounded-es"
        >
          <InitMarketPrice base={base} quote={quote} />
        </article>
      </TradeLayout>
    );
  }
  return <TradeLayout>{children}</TradeLayout>;
};
