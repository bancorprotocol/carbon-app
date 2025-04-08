import { FC, ReactNode, useCallback } from 'react';
import { useRouter } from '@tanstack/react-router';
import { EditTypes } from 'libs/routing/routes/strategyEdit';
import { BackButton } from 'components/common/BackButton';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { InitMarketPrice } from '../common/InitMarketPrice';
import { useTradeCtx } from 'components/trade/TradeContext';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useMarketPrice } from 'hooks/useMarketPrice';

interface Props {
  editType: EditTypes;
  graph?: ReactNode;
  children: ReactNode;
}

const titleByType: Record<EditTypes, string> = {
  renew: 'Renew Strategy',
  editPrices: 'Edit Prices',
  deposit: 'Deposit Budgets',
  withdraw: 'Withdraw Budgets',
};

export const EditStrategyLayout: FC<Props> = (props) => {
  const { editType, children } = props;
  const { history } = useRouter();

  return (
    <div className="mx-auto flex w-full max-w-[1920px] flex-col gap-20 p-20">
      <header className="flex items-center gap-16">
        <BackButton onClick={() => history.back()} />
        <h1 className="text-24 font-weight-500 flex-1">
          {titleByType[editType]}
        </h1>
      </header>

      <div className="flex flex-col gap-20 md:grid md:grid-cols-[450px_auto]">
        {children}
      </div>
    </div>
  );
};

export const EditPriceLayout: FC<Props> = (props) => {
  const { base, quote } = useTradeCtx();
  const search = useSearch({ from: '/strategies/edit/$strategyId/prices' });
  const navigate = useNavigate({ from: '/strategies/edit/$strategyId/prices' });
  const marketQuery = useMarketPrice({ base, quote });
  const marketPrice = search.marketPrice ?? marketQuery.marketPrice?.toString();
  const setMarketPrice = useCallback(
    (marketPrice: string) => {
      navigate({
        search: (previous) => ({ ...previous, marketPrice }),
        replace: true,
        resetScroll: false,
      });
    },
    [navigate]
  );

  console.log(marketPrice, marketQuery);

  if (!marketPrice && marketQuery.isPending) {
    return (
      <EditStrategyLayout {...props}>
        <CarbonLogoLoading className="h-[80px] place-self-center" />
      </EditStrategyLayout>
    );
  }

  if (!marketPrice) {
    return (
      <EditStrategyLayout {...props}>
        <article
          key="marketPrice"
          className="bg-background-900 rounded-ee rounded-es"
        >
          <InitMarketPrice
            base={base}
            quote={quote}
            setMarketPrice={(price) => setMarketPrice(price)}
          />
        </article>
      </EditStrategyLayout>
    );
  }
  return <EditStrategyLayout {...props} />;
};
