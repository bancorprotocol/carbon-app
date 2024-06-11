import { useSearch } from '@tanstack/react-router';
import { useEditStrategyCtx } from 'components/strategies/edit/EditStrategyContext';
import { roundSearchParam } from 'utils/helpers';
import { EditStrategyPriceField } from 'components/strategies/edit/EditPriceFields';
import { StrategySettings } from 'libs/routing';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { EditStrategyForm } from 'components/strategies/edit/EditStrategyForm';
import { outSideMarketWarning } from 'components/strategies/common/utils';
import { useSetRecurringOrder } from 'components/strategies/common/useSetOrder';

export interface EditRecurringStrategySearch {
  editType: 'editPrices' | 'renew';
  buyMin: string;
  buyMax: string;
  buySettings: StrategySettings;
  sellMin: string;
  sellMax: string;
  sellSettings: StrategySettings;
}

type Search = EditRecurringStrategySearch;

const getWarning = (search: EditRecurringStrategySearch) => {
  const { buyMin, buyMax, sellMin, sellMax } = search;
  const sellMinInRange =
    buyMin && buyMax && sellMin && +sellMin >= +buyMin && +sellMin < +buyMax;
  const buyMaxInRange =
    sellMin && sellMax && buyMax && +buyMax >= +sellMin && +buyMax < +sellMax;
  if (sellMinInRange || buyMaxInRange) {
    return 'Notice: your Buy and Sell orders overlap';
  }
};

const getError = (search: EditRecurringStrategySearch) => {
  const { buyMin, buyMax, sellMin, sellMax } = search;
  const minReversed = buyMin && sellMin && +buyMin > +sellMin;
  const maxReversed = buyMax && sellMax && +buyMax > +sellMax;
  if (minReversed || maxReversed) {
    return 'Orders are reversed. This strategy is currently set to Buy High and Sell Low. Please adjust your prices to avoid an immediate loss of funds upon creation.';
  }
};

const url = '/strategies/edit/$strategyId/prices/recurring';

export const EditStrategyRecurringPage = () => {
  const { strategy } = useEditStrategyCtx();
  const { base, quote, order0, order1 } = strategy;
  const search = useSearch({ from: url });
  const marketPrice = useMarketPrice({ base, quote });
  const { setSellOrder, setBuyOrder } = useSetRecurringOrder<Search>(url);

  const orders = {
    buy: {
      min: search.buyMin,
      max: search.buyMax,
      budget: order0.balance,
      settings: search.buySettings,
    },
    sell: {
      min: search.sellMin,
      max: search.sellMax,
      budget: order1.balance,
      settings: search.sellSettings,
    },
  };

  const hasChanged = (() => {
    const { order0, order1 } = strategy;
    if (search.buyMin !== roundSearchParam(order0.startRate)) return true;
    if (search.buyMax !== roundSearchParam(order0.endRate)) return true;
    if (search.sellMin !== roundSearchParam(order1.startRate)) return true;
    if (search.sellMax !== roundSearchParam(order1.endRate)) return true;
    return false;
  })();

  // Warnings
  const sellOutsideMarket = outSideMarketWarning({
    base,
    marketPrice,
    min: search.sellMin,
    max: search.sellMax,
    buy: false,
  });
  const buyOutsideMarket = outSideMarketWarning({
    base,
    marketPrice,
    min: search.buyMin,
    max: search.buyMax,
    buy: true,
  });

  const error = getError(search);

  return (
    <EditStrategyForm
      strategyType="recurring"
      editType={search.editType}
      orders={orders}
      hasChanged={hasChanged}
    >
      <EditStrategyPriceField
        order={orders.sell}
        initialBudget={order1.balance}
        setOrder={setSellOrder}
        warnings={[sellOutsideMarket, getWarning(search)]}
        error={error}
      />
      <EditStrategyPriceField
        order={orders.buy}
        initialBudget={order0.balance}
        setOrder={setBuyOrder}
        warnings={[buyOutsideMarket, getWarning(search)]}
        error={error}
        buy
      />
    </EditStrategyForm>
  );
};
