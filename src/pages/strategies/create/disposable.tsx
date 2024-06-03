import { useCallback } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useTokens } from 'hooks/useTokens';
import { StrategyDirection, StrategySettings } from 'libs/routing';
import { OrderFields } from 'components/strategies/create/Order/OrderFields';
import { TabsMenu } from 'components/common/tabs/TabsMenu';
import { TabsMenuButton } from 'components/common/tabs/TabsMenuButton';
import { formatNumber } from 'utils/helpers';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { SafeDecimal } from 'libs/safedecimal';
import { CreateLayout } from 'components/strategies/create/CreateLayout';
import { CreateForm } from 'components/strategies/create/CreateForm';
import { OrderBlock } from 'components/strategies/create/types';

export interface CreateDisposableStrategySearch {
  base: string;
  quote: string;
  direction: StrategyDirection;
  settings: StrategySettings;
  min?: string;
  max?: string;
  budget?: string;
}

const emptyOrder = (): OrderBlock => ({
  min: '0',
  max: '0',
  budget: '0',
  marginalPrice: '',
  settings: 'limit' as const,
});

export const CreateDisposableStrategyPage = () => {
  const { getTokenById } = useTokens();
  const navigate = useNavigate({ from: '/strategies/create/disposable' });
  const search = useSearch({ from: '/strategies/create/disposable' });
  const base = getTokenById(search.base);
  const quote = getTokenById(search.quote);
  const marketPrice = useMarketPrice({ base, quote });

  const buy = search.direction !== 'sell';
  const order: OrderBlock = {
    min: search.min ?? '',
    max: search.max ?? '',
    budget: search.budget ?? '',
    marginalPrice: '',
    settings: search.settings ?? 'limit',
  };

  const setDirection = (direction: StrategyDirection) => {
    navigate({
      search: (previous) => ({
        ...previous,
        direction,
        min: '',
        max: '',
        budget: '',
      }),
      replace: true,
      resetScroll: false,
    });
  };

  const setOrder = useCallback(
    (order: Partial<OrderBlock>) => {
      navigate({
        search: (previous) => ({ ...previous, ...order }),
        replace: true,
        resetScroll: false,
      });
    },
    [navigate]
  );

  // Warnings
  const outSideMarket = (() => {
    if (!marketPrice || !search.min || !+formatNumber(search.min)) return;
    if (buy) {
      if (new SafeDecimal(search.min).gt(marketPrice)) {
        return `Notice: you offer to buy ${base?.symbol} above current market price`;
      }
    } else {
      if (new SafeDecimal(search.min).lt(marketPrice)) {
        return `Notice: you offer to sell ${base?.symbol} below current market price`;
      }
    }
  })();

  return (
    <CreateLayout base={base} quote={quote}>
      <CreateForm
        type="disposable"
        base={base!}
        quote={quote!}
        order0={buy ? order : emptyOrder()}
        order1={buy ? emptyOrder() : order}
      >
        <OrderFields
          base={base!}
          quote={quote!}
          buy={buy}
          order={order}
          setOrder={setOrder}
          warning={outSideMarket}
          settings={
            <TabsMenu>
              <TabsMenuButton
                onClick={() => setDirection('buy')}
                isActive={buy}
                data-testid="tab-buy"
              >
                Buy
              </TabsMenuButton>
              <TabsMenuButton
                onClick={() => setDirection('sell')}
                isActive={!buy}
                data-testid="tab-sell"
              >
                Sell
              </TabsMenuButton>
            </TabsMenu>
          }
        />
      </CreateForm>
    </CreateLayout>
  );
};
