import { useSearch } from '@tanstack/react-router';
import { useEditStrategyCtx } from 'components/strategies/edit/EditStrategyContext';
import { roundSearchParam } from 'utils/helpers';
import { EditStrategyPriceField } from 'components/strategies/edit/EditPriceFields';
import { StrategyDirection, StrategySettings } from 'libs/routing';
import { OrderBlock } from 'components/strategies/common/types';
import { useMarketPrice } from 'hooks/useMarketPrice';
import {
  emptyOrder,
  isZero,
  outSideMarketWarning,
} from 'components/strategies/common/utils';
import { TabsMenu } from 'components/common/tabs/TabsMenu';
import { TabsMenuButton } from 'components/common/tabs/TabsMenuButton';
import { WarningMessageWithIcon } from 'components/common/WarningMessageWithIcon';
import { EditStrategyForm } from 'components/strategies/edit/EditStrategyForm';
import { useSetDisposableOrder } from 'components/strategies/common/useSetOrder';
import {
  OverlappingBudgetDescription,
  OverlappingBudgetDistribution,
} from 'components/strategies/overlapping/OverlappingBudgetDistribution';
import { getDeposit, getWithdraw } from 'components/strategies/edit/utils';
import { useGetTokenBalance } from 'libs/queries';

export interface EditDisposableStrategySearch {
  editType: 'editPrices' | 'renew';
  min: string;
  max: string;
  settings: StrategySettings;
  direction: StrategyDirection;
}

const url = '/strategies/edit/$strategyId/prices/disposable';

export const EditStrategyDisposablePage = () => {
  const { strategy } = useEditStrategyCtx();
  const { base, quote, order0, order1 } = strategy;
  const search = useSearch({ from: url });
  const marketPrice = useMarketPrice({ base, quote });

  const buy = search.direction !== 'sell';
  const otherOrder = buy ? order1 : order0;
  const { setOrder, setDirection } = useSetDisposableOrder(url, otherOrder);

  const baseBalance = useGetTokenBalance(base);
  const quoteBalance = useGetTokenBalance(quote);

  const initialBudget = buy ? order0.balance : order1.balance;
  const order: OrderBlock = {
    min: search.min ?? '',
    max: search.max ?? '',
    budget: initialBudget,
    settings: search.settings ?? 'limit',
  };
  const orders = {
    buy: buy ? order : emptyOrder(),
    sell: buy ? emptyOrder() : order,
  };

  const hasChanged = (() => {
    const { order0, order1 } = strategy;
    if (orders.buy.min !== roundSearchParam(order0.startRate)) return true;
    if (orders.buy.max !== roundSearchParam(order0.endRate)) return true;
    if (orders.sell.min !== roundSearchParam(order1.startRate)) return true;
    if (orders.sell.max !== roundSearchParam(order1.endRate)) return true;
    return false;
  })();

  // Warnings
  const outSideMarket = outSideMarketWarning({
    base,
    marketPrice,
    min: search.min,
    max: search.max,
    buy: search.direction !== 'sell',
  });

  const fromRecurring = !isZero(order0.startRate) && !isZero(order1.startRate);
  const buyBudgetChanges = order0.balance !== orders.buy.budget;
  const sellBudgetChanges = order1.balance !== orders.sell.budget;

  return (
    <EditStrategyForm
      strategyType="disposable"
      editType={search.editType}
      orders={orders}
      hasChanged={hasChanged}
    >
      <EditStrategyPriceField
        order={order}
        initialBudget={initialBudget}
        setOrder={setOrder}
        warnings={[outSideMarket]}
        buy={buy}
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
      {(buyBudgetChanges || sellBudgetChanges) && (
        <article
          id="budget-changed"
          className="rounded-10 bg-background-900 flex w-full flex-col gap-16 p-20"
        >
          <hgroup>
            <h3 className="text-16 font-weight-500 flex items-center gap-8">
              Budget Changes
            </h3>
            <p className="text-14 text-white/80">
              These are the changes in budget allocation
            </p>
          </hgroup>
          {sellBudgetChanges && (
            <>
              <OverlappingBudgetDistribution
                title="Sell Budget"
                token={base}
                initialBudget={order1.balance}
                withdraw={getWithdraw(order1.balance, orders.sell.budget)}
                deposit={getDeposit(order1.balance, orders.sell.budget)}
                balance={baseBalance.data ?? '0'}
              />
              <OverlappingBudgetDescription
                token={base}
                initialBudget={order1.balance}
                withdraw={getWithdraw(order1.balance, orders.sell.budget)}
                deposit={getDeposit(order1.balance, orders.sell.budget)}
                balance={baseBalance.data ?? '0'}
              />
            </>
          )}
          {buyBudgetChanges && (
            <>
              <OverlappingBudgetDistribution
                title="Buy Budget"
                token={quote}
                initialBudget={order0.balance}
                withdraw={getWithdraw(order0.balance, orders.buy.budget)}
                deposit={getDeposit(order0.balance, orders.buy.budget)}
                balance={quoteBalance.data ?? '0'}
                buy
              />
              <OverlappingBudgetDescription
                token={quote}
                initialBudget={order0.balance}
                withdraw={getWithdraw(order0.balance, orders.buy.budget)}
                deposit={getDeposit(order0.balance, orders.buy.budget)}
                balance={quoteBalance.data ?? '0'}
              />
            </>
          )}
        </article>
      )}
      {fromRecurring && (
        <WarningMessageWithIcon>
          {buy ? 'Sell High' : 'Buy Low'} order will be removed
        </WarningMessageWithIcon>
      )}
    </EditStrategyForm>
  );
};
