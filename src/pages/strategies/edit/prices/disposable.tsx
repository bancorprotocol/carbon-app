import { useNavigate, useSearch } from '@tanstack/react-router';
import { useEditStrategyCtx } from 'components/strategies/edit/EditStrategyContext';
import { tokenAmount } from 'utils/helpers';
import { EditStrategyPriceField } from 'components/strategies/edit/EditPriceFields';
import { StrategyDirection, StrategySettings } from 'libs/routing';
import { EditOrderBlock } from 'components/strategies/common/types';
import { useMarketPrice } from 'hooks/useMarketPrice';
import {
  emptyOrder,
  isZero,
  outSideMarketWarning,
  resetPrice,
} from 'components/strategies/common/utils';
import { TabsMenu } from 'components/common/tabs/TabsMenu';
import { TabsMenuButton } from 'components/common/tabs/TabsMenuButton';
import { EditStrategyForm } from 'components/strategies/edit/EditStrategyForm';
import { useSetDisposableOrder } from 'components/strategies/common/useSetOrder';
import { getTotalBudget, getWithdraw } from 'components/strategies/edit/utils';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { StrategyChartSection } from 'components/strategies/common/StrategyChartSection';
import { StrategyChartHistory } from 'components/strategies/common/StrategyChartHistory';
import { OnPriceUpdates } from 'components/simulator/input/d3Chart';
import { useCallback } from 'react';
import { EditStrategyLayout } from 'components/strategies/edit/EditStrategyLayout';
import { SafeDecimal } from 'libs/safedecimal';

export interface EditDisposableStrategySearch {
  editType: 'editPrices' | 'renew';
  min: string;
  max: string;
  settings: StrategySettings;
  direction: StrategyDirection;
  action?: 'deposit' | 'withdraw';
  budget?: string;
}

const url = '/strategies/edit/$strategyId/prices/disposable';

export const EditStrategyDisposablePage = () => {
  const { strategy } = useEditStrategyCtx();
  const { base, quote, order0, order1 } = strategy;
  const search = useSearch({ from: url });
  const navigate = useNavigate({ from: url });

  const { marketPrice } = useMarketPrice({ base, quote });

  const isBuy = search.direction !== 'sell';
  const otherOrder = isBuy ? order1 : order0;
  const { setOrder } = useSetDisposableOrder(url);

  const setSearch = useCallback(
    (next: Partial<EditDisposableStrategySearch>) => {
      navigate({
        params: (params) => params,
        search: (previous) => ({ ...previous, ...next }),
        replace: true,
        resetScroll: false,
      });
    },
    [navigate]
  );

  // TODO: would be better to set default price reactively instead
  const setDirection = (direction: StrategyDirection) => {
    const isLimit = search.settings !== 'range';
    const defaultMin = () => {
      if (isLimit) return marketPrice?.toString();
      const multiplier = isBuy ? 0.9 : 1;
      return new SafeDecimal(marketPrice ?? 0).mul(multiplier).toString();
    };
    const defaultMax = () => {
      if (isLimit) return marketPrice?.toString();
      const multiplier = isBuy ? 1 : 1.1;
      return new SafeDecimal(marketPrice ?? 0).mul(multiplier).toString();
    };
    setSearch({
      direction,
      budget: undefined,
      min: resetPrice(otherOrder?.startRate) || defaultMin(),
      max: resetPrice(otherOrder?.endRate) || defaultMax(),
    });
  };

  const onPriceUpdates: OnPriceUpdates = useCallback(
    ({ buy, sell }) => {
      if (isBuy) setSearch({ min: buy.min, max: buy.max });
      else setSearch({ min: sell.min, max: sell.max });
    },
    [setSearch, isBuy]
  );

  const initialBudget = isBuy ? order0.balance : order1.balance;
  const totalBudget = getTotalBudget(
    search.action ?? 'deposit',
    initialBudget,
    search.budget
  );
  // TODO: initialize min/max with existing strategy instead of forcing in search
  const order: EditOrderBlock = {
    min: search.min ?? '',
    max: search.max ?? '',
    budget: totalBudget,
    settings: search.settings ?? 'limit',
    action: search.action ?? 'deposit',
  };
  const orders = {
    buy: isBuy ? order : emptyOrder(),
    sell: isBuy ? emptyOrder() : order,
  };
  const isLimit = {
    buy: order.settings !== 'range',
    sell: order.settings !== 'range',
  };

  const hasChanged = (() => {
    if (orders.buy.min !== order0.startRate) return true;
    if (orders.buy.max !== order0.endRate) return true;
    if (orders.sell.min !== order1.startRate) return true;
    if (orders.sell.max !== order1.endRate) return true;
    if (!isZero(search.budget)) return true;
    return false;
  })();

  // Warnings
  const outSideMarket = outSideMarketWarning({
    base,
    marketPrice,
    min: search.min,
    max: search.max,
    buy: isBuy,
  });

  // Check if inactive budget changed
  const buyBudgetChanges = !isBuy && orders.buy.budget !== order0.balance;
  const buyWithdraw = getWithdraw(order0.balance, orders.buy.budget);
  const sellBudgetChanges = isBuy && orders.sell.budget !== order1.balance;
  const sellWithdraw = getWithdraw(order1.balance, orders.sell.budget);

  return (
    <EditStrategyLayout editType={search.editType}>
      <EditStrategyForm
        strategyType="disposable"
        editType={search.editType}
        orders={orders}
        hasChanged={hasChanged}
      >
        <EditStrategyPriceField
          order={order}
          budget={search.budget ?? ''}
          initialBudget={initialBudget}
          setOrder={setOrder}
          warnings={[outSideMarket]}
          buy={isBuy}
          settings={
            <TabsMenu>
              <TabsMenuButton
                onClick={() => setDirection('buy')}
                variant={isBuy ? 'buy' : 'black'}
                data-testid="tab-buy"
              >
                Buy
              </TabsMenuButton>
              <TabsMenuButton
                onClick={() => setDirection('sell')}
                variant={!isBuy ? 'sell' : 'black'}
                data-testid="tab-sell"
              >
                Sell
              </TabsMenuButton>
            </TabsMenu>
          }
        />
        {(buyBudgetChanges || sellBudgetChanges) && (
          <article
            id="budget-changed"
            className="warning-message border-warning/40 rounded-10 bg-background-900 flex w-full flex-col gap-12 border p-20"
          >
            <h3 className="text-16 text-warning font-weight-500 flex items-center gap-8">
              <IconWarning className="size-16" />
              Notice
            </h3>
            {buyBudgetChanges && (
              <p className="text-14 text-white/80">
                You will withdraw&nbsp;
                {tokenAmount(buyWithdraw, quote)} from the inactive buy order to
                your wallet.
              </p>
            )}
            {sellBudgetChanges && (
              <p className="text-14 text-white/80">
                You will withdraw&nbsp;
                {tokenAmount(sellWithdraw, base)} from the inactive sell order
                to your wallet.
              </p>
            )}
          </article>
        )}
      </EditStrategyForm>
      <StrategyChartSection>
        <StrategyChartHistory
          type="disposable"
          base={base}
          quote={quote}
          order0={orders.buy}
          order1={orders.sell}
          isLimit={isLimit}
          direction={search.direction ?? 'sell'}
          onPriceUpdates={onPriceUpdates}
        />
      </StrategyChartSection>
    </EditStrategyLayout>
  );
};
