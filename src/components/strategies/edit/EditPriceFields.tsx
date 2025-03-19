import { FC, ReactNode, useId } from 'react';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { LogoImager } from 'components/common/imager/Imager';
import { FullOutcome } from 'components/strategies/FullOutcome';
import { OrderHeader } from 'components/strategies/common/OrderHeader';
import { InputRange } from 'components/strategies/common/InputRange';
import { InputLimit } from 'components/strategies/common/InputLimit';
import { EditOrderBlock } from 'components/strategies/common/types';
import { useEditStrategyCtx } from './EditStrategyContext';
import { BudgetDistribution } from '../common/BudgetDistribution';
import { getDeposit, getWithdraw } from './utils';
import { Order, useGetTokenBalance } from 'libs/queries';
import { StrategySettings } from 'libs/routing';
import { OverlappingAction } from '../overlapping/OverlappingAction';
import { EditBudgetDistribution } from './EditStrategyAllocatedBudget';
import { isZero } from '../common/utils';
import { SafeDecimal } from 'libs/safedecimal';
import style from 'components/strategies/common/order.module.css';
import { cn } from 'utils/helpers';

interface Props {
  order: EditOrderBlock;
  buy?: boolean;
  initialOrder: Order;
  budget: string;
  action?: 'deposit' | 'withdraw';
  hasPriceChanged: boolean;
  setOrder: (order: Partial<EditOrderBlock>) => void;
  settings?: ReactNode;
  warnings?: (string | undefined)[];
  error?: string;
}

export const EditStrategyPriceField: FC<Props> = ({
  order,
  initialOrder,
  budget,
  hasPriceChanged,
  setOrder,
  buy = false,
  settings,
  error,
  warnings,
}) => {
  const { strategy } = useEditStrategyCtx();
  const { base, quote } = strategy;
  const token = buy ? quote : base;
  const balance = useGetTokenBalance(token);
  const initialBudget = initialOrder.balance;
  const titleId = useId();
  const tooltipText = `This section will define the order details in which you are willing to ${
    buy ? 'buy' : 'sell'
  } ${base.symbol} at.`;

  const inputTitle = (
    <>
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-black text-[10px] text-white/60">
        1
      </span>
      <Tooltip
        element={`Define the price you are willing to ${buy ? 'buy' : 'sell'} ${
          base.symbol
        } at. Make sure the price is in ${quote.symbol} tokens.`}
      >
        <p>
          <span className="text-white/80">
            Set {buy ? 'Buy' : 'Sell'} Price&nbsp;
          </span>
          <span className="text-white/60">
            ({quote.symbol} per 1 {base.symbol})
          </span>
        </p>
      </Tooltip>
    </>
  );
  const setPrice = (price: string) => setOrder({ min: price, max: price });
  const setMin = (min: string) => setOrder({ min, marginalPrice: undefined });
  const setMax = (max: string) => setOrder({ max, marginalPrice: undefined });
  const setBudget = (budget: string) => setOrder({ budget });
  const setMarginalPrice = (marginalPrice: string) => {
    setOrder({ marginalPrice });
  };
  const setAction = (action: 'deposit' | 'withdraw') => {
    setOrder({ action, budget: undefined, marginalPrice: undefined });
  };
  const setSettings = (settings: StrategySettings) => {
    setOrder({
      settings,
      min: undefined,
      max: undefined,
      marginalPrice: undefined,
    });
  };

  const showDistribution = () => {
    if (hasPriceChanged) return false;
    if (order.min === order.max) return false;
    if (isZero(budget)) return false;
    if (isZero(initialBudget)) return false;
    if (new SafeDecimal(order.budget).lte(0)) return false;
    if (!balance.data || new SafeDecimal(budget).gt(balance.data)) return false;
    if (buy && initialOrder.marginalRate === order.max) return false;
    if (!buy && initialOrder.marginalRate === order.min) return false;
    return true;
  };

  const headerProps = { titleId, order, base, buy, setSettings };

  return (
    <article
      aria-labelledby={titleId}
      className="bg-background-900 grid text-left"
      data-testid={`${buy ? 'buy' : 'sell'}-section`}
    >
      {settings}
      <div
        className={cn(style.order, 'grid gap-16 p-16')}
        data-direction={buy ? 'buy' : 'sell'}
      >
        <OrderHeader {...headerProps}>
          <h2 className="text-16 flex items-center gap-8" id={titleId}>
            <Tooltip element={tooltipText}>
              <span>{buy ? 'Buy Low' : 'Sell High'}</span>
            </Tooltip>
            <LogoImager alt="Token" src={base.logoURI} className="size-18" />
            <span>{base.symbol}</span>
          </h2>
        </OrderHeader>
        <fieldset className="flex flex-col gap-8">
          <legend className="text-14 font-weight-500 mb-11 flex items-center gap-6">
            {inputTitle}
          </legend>
          {order.settings === 'range' ? (
            <InputRange
              base={base}
              quote={quote}
              min={order.min}
              setMin={setMin}
              max={order.max}
              setMax={setMax}
              buy={buy}
              error={error}
              warnings={warnings}
              required
            />
          ) : (
            <InputLimit
              base={base}
              quote={quote}
              price={order.min}
              setPrice={setPrice}
              buy={buy}
              error={error}
              warnings={warnings}
              required
            />
          )}
        </fieldset>
        <OverlappingAction
          base={base}
          quote={quote}
          anchor={buy ? 'buy' : 'sell'}
          action={order.action}
          setAction={setAction}
          budget={budget}
          setBudget={setBudget}
          buyBudget={strategy.order0.balance}
          sellBudget={strategy.order1.balance}
        >
          {showDistribution() && (
            <div
              role="table"
              className="rounded-8 p-15 text-12 font-weight-500 mt-8 flex flex-col gap-10 border-2 border-white/10 text-left"
            >
              <EditBudgetDistribution
                marginalPrice={order.marginalPrice}
                onChange={setMarginalPrice}
              />
            </div>
          )}
        </OverlappingAction>
        <BudgetDistribution
          token={token}
          initialBudget={initialBudget}
          withdraw={getWithdraw(initialBudget, order.budget)}
          deposit={getDeposit(initialBudget, order.budget)}
          balance={balance.data}
          buy={buy}
        />
        <FullOutcome
          min={order.min}
          max={order.max}
          budget={order.budget}
          buy={buy}
          base={base}
          quote={quote}
        />
      </div>
    </article>
  );
};
