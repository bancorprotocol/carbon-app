import { FC, ReactNode, useId } from 'react';
import { Token } from 'libs/tokens';
import { m } from 'libs/motion';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { StrategyType } from 'libs/routing';
import { LogoImager } from 'components/common/imager/Imager';
import { FullOutcome } from 'components/strategies/FullOutcome';
import { OrderHeader } from 'components/strategies/create/Order/Header';
import { items } from 'components/strategies/create/variants';
import { InputBudget } from './InputBudget';
import { InputRange } from './InputRange';
import { InputLimit } from './InputLimit';
import { OrderBlock } from 'components/strategies/create/types';

interface Props {
  base: Token;
  quote: Token;
  order: OrderBlock;
  buy?: boolean;
  optionalBudget?: boolean;
  type: StrategyType;
  setOrder: (order: Partial<OrderBlock>) => void;
  settings?: ReactNode;
  warnings?: (string | undefined)[];
  error?: string;
}

export const OrderFields: FC<Props> = ({
  base,
  quote,
  order,
  optionalBudget,
  type,
  setOrder,
  buy = false,
  settings,
  error,
  warnings,
}) => {
  const titleId = useId();
  const tooltipText = `This section will define the order details in which you are willing to ${
    buy ? 'buy' : 'sell'
  } ${base.symbol} at.`;

  const inputTitle = (
    <>
      <span className="flex size-16 items-center justify-center rounded-full bg-white/10 text-[10px] text-white/60">
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
  const setBudget = (budget: string) => setOrder({ budget });

  const headerProps = { titleId, order, base, buy, setOrder };

  return (
    <m.article
      variants={items}
      aria-labelledby={titleId}
      className={`rounded-10 bg-background-900 flex flex-col gap-20 border-l-2 p-20 ${
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
      <InputBudget
        buy={buy}
        quote={quote}
        base={base}
        strategyType={type}
        order={order}
        setBudget={setBudget}
        optional={!!optionalBudget}
      />
      <FullOutcome
        min={order.min}
        max={order.max}
        budget={order.budget}
        buy={buy}
        base={base}
        quote={quote}
      />
    </m.article>
  );
};
