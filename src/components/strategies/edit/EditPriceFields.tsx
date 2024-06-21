import { FC, ReactNode, useId } from 'react';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { LogoImager } from 'components/common/imager/Imager';
import { FullOutcome } from 'components/strategies/FullOutcome';
import { OrderHeader } from 'components/strategies/common/OrderHeader';
import { InputRange } from 'components/strategies/common/InputRange';
import { InputLimit } from 'components/strategies/common/InputLimit';
import { EditOrderBlock } from 'components/strategies/common/types';
import { useEditStrategyCtx } from './EditStrategyContext';
import {
  BudgetDescription,
  BudgetDistribution,
} from '../common/BudgetDistribution';
import { getDeposit, getWithdraw } from './utils';
import { useGetTokenBalance } from 'libs/queries';
import { StrategySettings } from 'libs/routing';
import { isLimitOrder, resetPrice } from '../common/utils';
import { OverlappingAction } from '../overlapping/OverlappingAction';

interface Props {
  order: EditOrderBlock;
  buy?: boolean;
  initialBudget: string;
  budget: string;
  action?: 'deposit' | 'withdraw';
  setOrder: (order: Partial<EditOrderBlock>) => void;
  settings?: ReactNode;
  warnings?: (string | undefined)[];
  error?: string;
}

export const EditStrategyPriceField: FC<Props> = ({
  order,
  initialBudget,
  budget,
  setOrder,
  buy = false,
  settings,
  error,
  warnings,
}) => {
  const { strategy } = useEditStrategyCtx();
  const { base, quote, order0, order1 } = strategy;
  const token = buy ? quote : base;
  const balance = useGetTokenBalance(token);

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
        sendEventOnMount={{ buy }}
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
  const setMin = (min: string) => setOrder({ min });
  const setMax = (max: string) => setOrder({ max });
  const setBudget = (budget: string) => {
    console.log('set budget', { buy });
    setOrder({ budget });
  };
  const setAction = (action: 'deposit' | 'withdraw') => {
    console.log('set action', { action, buy });
    setOrder({ action, budget: undefined });
  };
  const setSettings = (settings: StrategySettings) => {
    const order = buy ? order0 : order1;
    const initialSettings = isLimitOrder(order) ? 'limit' : 'range';
    setOrder({
      settings,
      min: initialSettings === settings ? resetPrice(order.startRate) : '',
      max: initialSettings === settings ? resetPrice(order.endRate) : '',
    });
  };

  const headerProps = { titleId, order, base, buy, setSettings };

  return (
    <article
      aria-labelledby={titleId}
      className={`rounded-6 bg-background-900 flex flex-col gap-20 border-l-2 p-20 text-left ${
        buy
          ? 'border-buy/50 focus-within:border-buy'
          : 'border-sell/50 focus-within:border-sell'
      }`}
      data-testid={`${buy ? 'buy' : 'sell'}-section`}
    >
      {settings}
      <OrderHeader {...headerProps}>
        <h2 className="text-18 flex items-center gap-8" id={titleId}>
          <Tooltip sendEventOnMount={{ buy }} element={tooltipText}>
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
      />
      <BudgetDistribution
        token={token}
        initialBudget={initialBudget}
        withdraw={getWithdraw(initialBudget, order.budget)}
        deposit={getDeposit(initialBudget, order.budget)}
        balance={balance.data ?? '0'}
        buy={buy}
      />
      <BudgetDescription
        token={token}
        initialBudget={initialBudget}
        withdraw={getWithdraw(initialBudget, order.budget)}
        deposit={getDeposit(initialBudget, order.budget)}
        balance={balance.data ?? '0'}
      />
      <FullOutcome
        min={order.min}
        max={order.max}
        budget={order.budget}
        buy={buy}
        base={base}
        quote={quote}
      />
    </article>
  );
};
