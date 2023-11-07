import { Dispatch, FC, SetStateAction } from 'react';
import { ReactComponent as IconLink } from 'assets/icons/link.svg';
import { useMarketIndication } from 'components/strategies/marketPriceIndication';
import { CreateSymmerticStrategySpread } from './CreateSymmerticStrategySpread';
import { TokenInputField } from 'components/common/TokenInputField/TokenInputField';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { ReactComponent as IconTooltip } from 'assets/icons/tooltip.svg';
import BigNumber from 'bignumber.js';
import { InputRange } from '../BuySellBlock/InputRange';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { Token } from 'libs/tokens';
import { OrderCreate } from '../useOrder';
import { UseQueryResult } from '@tanstack/react-query';

interface Props {
  base?: Token;
  quote?: Token;
  order0: OrderCreate;
  order1: OrderCreate;
  token0BalanceQuery: UseQueryResult<string, any>;
  token1BalanceQuery: UseQueryResult<string, any>;
  spreadPPM: number;
  setSpreadPPM: Dispatch<SetStateAction<number>>;
}

export const CreateSymmetricStrategy: FC<Props> = (props) => {
  const {
    base,
    quote,
    order0,
    order1,
    token0BalanceQuery,
    token1BalanceQuery,
    spreadPPM,
    setSpreadPPM,
  } = props;
  const { marketPricePercentage } = useMarketIndication({
    base,
    quote,
    order: order0,
    buy: false,
  });

  const insufficientBalance0 =
    !token0BalanceQuery.isLoading &&
    new BigNumber(token0BalanceQuery.data || 0).lt(order0.budget);
  const insufficientBalance1 =
    !token0BalanceQuery.isLoading &&
    new BigNumber(token1BalanceQuery.data || 0).lt(order1.budget);

  return (
    <>
      <article className="grid grid-flow-col grid-cols-[auto_auto] grid-rows-2 gap-8 rounded-10 bg-silver p-20">
        <h4 className="flex items-center gap-8 text-14 font-weight-500">
          Discover Symmetric Strategies
          <span className="rounded-8 bg-darkGreen px-8 py-4 text-10 text-green">
            NEW
          </span>
        </h4>
        <p className="text-12 text-white/60">
          Learn more about the new type of strategy creation.
        </p>
        {/* TODO: Set url */}
        <a
          href="/"
          target="_blank"
          className="row-span-2 flex items-center gap-4 self-center justify-self-end text-12 font-weight-500 text-green"
        >
          Learn More
          <IconLink className="h-12 w-12" />
        </a>
      </article>
      <article className="flex flex-col gap-20 rounded-10 bg-silver p-20">
        <header className="flex items-center gap-8">
          <h3 className="flex-1 text-18 font-weight-500">Price Range</h3>
          {/* TODO add tooltip text here */}
          <Tooltip element={''}>
            <IconTooltip className="h-14 w-14 text-white/60" />
          </Tooltip>
        </header>
        <svg></svg>
      </article>
      <article className="flex flex-col gap-20 rounded-10 bg-silver p-20">
        <header className="flex items-center gap-8">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-[10px] text-white/60">
            1
          </span>
          <h3 className="flex-1 text-18 font-weight-500">
            Set Price Range ({quote?.symbol} per {base?.symbol})
          </h3>
          {/* TODO add tooltip text here */}
          <Tooltip element={''}>
            <IconTooltip className="h-14 w-14 text-white/60" />
          </Tooltip>
        </header>
        {base && (
          <InputRange
            token={base}
            min={order0.min}
            max={order0.max}
            setMin={order0.setMin}
            setMax={order0.setMax}
            error={order0.rangeError}
            setRangeError={order0.setRangeError}
            marketPricePercentages={marketPricePercentage}
          />
        )}
      </article>
      <article className="flex flex-col gap-10 rounded-10 bg-silver p-20">
        <header className="mb-10 flex items-center gap-8 ">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-[10px] text-white/60">
            2
          </span>
          <h3 className="flex-1 text-18 font-weight-500">Indicate Spread</h3>
          {/* TODO add tooltip text here */}
          <Tooltip element={''}>
            <IconTooltip className="h-14 w-14 text-white/60" />
          </Tooltip>
        </header>
        <CreateSymmerticStrategySpread
          options={[0.01, 0.05, 0.1]}
          spreadPPM={spreadPPM}
          setSpreadPPM={setSpreadPPM}
        />
      </article>
      <article className="flex flex-col gap-20 rounded-10 bg-silver p-20">
        <header className="flex items-center gap-8 ">
          <h3 className="flex-1 text-18 font-weight-500">Set Budgets</h3>
          {/* TODO add tooltip text here */}
          <Tooltip element={''}>
            <IconTooltip className="h-14 w-14 text-white/60" />
          </Tooltip>
        </header>
        {quote && (
          <>
            <TokenInputField
              id={`${quote.symbol}-budget`}
              className="rounded-16 bg-black p-16"
              value={order1.budget}
              setValue={order1.setBudget}
              token={quote}
              isBalanceLoading={token1BalanceQuery.isLoading}
              balance={token1BalanceQuery.data}
              isError={insufficientBalance1}
              data-testid="input-budget"
            />
            {insufficientBalance1 && (
              <output
                htmlFor={`${quote.symbol}-budget`}
                role="alert"
                aria-live="polite"
                className="flex items-center gap-10 font-mono text-12 text-red"
              >
                <IconWarning className="h-12 w-12" />
                <span className="flex-1">Insufficient balance</span>
              </output>
            )}
          </>
        )}
        {base && (
          <>
            <TokenInputField
              id={`${base.symbol}-budget`}
              className="rounded-16 bg-black p-16"
              value={order0.budget}
              setValue={order0.setBudget}
              token={base}
              isBalanceLoading={token0BalanceQuery.isLoading}
              balance={token0BalanceQuery.data}
              isError={insufficientBalance0}
              data-testid="input-budget"
            />
            {insufficientBalance0 && (
              <output
                htmlFor={`${base.symbol}-budget`}
                role="alert"
                aria-live="polite"
                className="flex items-center gap-10 font-mono text-12 text-red"
              >
                <IconWarning className="h-12 w-12" />
                <span className="flex-1">Insufficient balance</span>
              </output>
            )}
          </>
        )}
      </article>
    </>
  );
};
