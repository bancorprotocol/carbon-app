import { useSearch } from '@tanstack/react-router';
import { useEditStrategyCtx } from 'components/strategies/edit/EditStrategyContext';
import { roundSearchParam, tokenAmount } from 'utils/helpers';
import { EditStrategyPriceField } from 'components/strategies/edit/EditPriceFields';
import { StrategyDirection, StrategySettings } from 'libs/routing';
import { EditOrderBlock } from 'components/strategies/common/types';
import { useMarketPrice } from 'hooks/useMarketPrice';
import {
  emptyOrder,
  isZero,
  outSideMarketWarning,
} from 'components/strategies/common/utils';
import { TabsMenu } from 'components/common/tabs/TabsMenu';
import { TabsMenuButton } from 'components/common/tabs/TabsMenuButton';
import { EditStrategyForm } from 'components/strategies/edit/EditStrategyForm';
import { useSetDisposableOrder } from 'components/strategies/common/useSetOrder';
import { getTotalBudget, getWithdraw } from 'components/strategies/edit/utils';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';

export interface EditDisposableStrategySearch {
  editType: 'editPrices' | 'renew';
  min: string;
  max: string;
  settings: StrategySettings;
  direction: StrategyDirection;
  action?: 'deposit' | 'withdraw';
  budget?: string;
}

const isDifferent = (next: string, previous: string) => {
  return next !== (roundSearchParam(previous) || '0');
};

const url = '/strategies/edit/$strategyId/prices/disposable';

export const EditStrategyDisposablePage = () => {
  const { strategy } = useEditStrategyCtx();
  const { base, quote, order0, order1 } = strategy;
  const search = useSearch({ from: url });
  const { marketPrice } = useMarketPrice({ base, quote });

  const isBuy = search.direction !== 'sell';
  const otherOrder = isBuy ? order1 : order0;
  const { setOrder, setDirection } = useSetDisposableOrder(url, otherOrder);

  const initialBudget = isBuy ? order0.balance : order1.balance;
  const totalBudget = getTotalBudget(
    search.action ?? 'deposit',
    initialBudget,
    search.budget
  );
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

  const hasChanged = (() => {
    if (isDifferent(orders.buy.min, order0.startRate)) return true;
    if (isDifferent(orders.buy.max, order0.endRate)) return true;
    if (isDifferent(orders.sell.min, order1.startRate)) return true;
    if (isDifferent(orders.sell.max, order1.endRate)) return true;
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

  const buyBudgetChanges = orders.buy.budget !== order0.balance;
  const buyWithdraw = getWithdraw(order0.balance, orders.buy.budget);
  const sellBudgetChanges = orders.sell.budget !== order1.balance;
  const sellWithdraw = getWithdraw(order1.balance, orders.sell.budget);

  return (
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
              isActive={isBuy}
              data-testid="tab-buy"
            >
              Buy
            </TabsMenuButton>
            <TabsMenuButton
              onClick={() => setDirection('sell')}
              isActive={!isBuy}
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
            <IconWarning className="size-20" />
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
              {tokenAmount(sellWithdraw, base)} from the inactive sell order to
              your wallet.
            </p>
          )}
        </article>
      )}
    </EditStrategyForm>
  );
};
