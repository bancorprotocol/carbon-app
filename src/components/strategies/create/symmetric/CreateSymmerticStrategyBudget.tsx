import { FC } from 'react';
import { Token } from 'libs/tokens';
import { OrderCreate } from '../useOrder';
import { UseQueryResult } from '@tanstack/react-query';
import { TokenInputField } from 'components/common/TokenInputField/TokenInputField';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { ReactComponent as IconLink } from 'assets/icons/link.svg';
import BigNumber from 'bignumber.js';
import { SymmetricStrategyProps } from './CreateSymmetricStrategy';
import { useComparePrice } from 'hooks/useComparePrice';

export const CreateSymmerticStrategyBudget: FC<SymmetricStrategyProps> = (
  props
) => {
  const {
    base,
    quote,
    order0,
    order1,
    token0BalanceQuery,
    token1BalanceQuery,
  } = props;
  const { baseFiat, quoteFiat } = useComparePrice({ base, quote });
  // Note: in the context of symmetric strategy order0 is same as order1
  const minAboveMarket = baseFiat.lt(quoteFiat.times(order0.min));
  const maxBelowMarket = baseFiat.gt(quoteFiat.times(order0.max));
  if (minAboveMarket) {
    return (
      <>
        <TokenBudget token={base} order={order1} query={token0BalanceQuery} />
        <Explaination base={base} buy />
      </>
    );
  } else if (maxBelowMarket) {
    return (
      <>
        <TokenBudget token={quote} order={order0} query={token1BalanceQuery} />
        <Explaination base={base} />
      </>
    );
  } else {
    return (
      <>
        <TokenBudget token={quote} order={order0} query={token1BalanceQuery} />
        <TokenBudget token={base} order={order1} query={token0BalanceQuery} />
      </>
    );
  }
};

const Explaination: FC<{ base?: Token; buy?: boolean }> = ({ base, buy }) => {
  return (
    <p className="text-12 text-white/60">
      The market price is outside the ranges you set for&nbsp;
      {buy ? 'buying' : 'selling'}&nbsp;
      {base?.symbol}. Budget for buying {base?.symbol} is not required.&nbsp;
      {/* TODO: add url */}
      <a
        href="/"
        target="_blank"
        className="inline-flex items-center gap-4 text-12 font-weight-500 text-green"
      >
        Learn More
        <IconLink className="h-12 w-12" />
      </a>
    </p>
  );
};

interface TokenBudgetProps {
  token?: Token;
  order: OrderCreate;
  query: UseQueryResult<string, any>;
}

const TokenBudget: FC<TokenBudgetProps> = (props) => {
  const { token, order, query } = props;
  if (!token) return <></>;

  const insufficientBalance =
    !query.isLoading && new BigNumber(query.data || 0).lt(order.budget);

  return (
    <>
      <TokenInputField
        id={`${token.symbol}-budget`}
        className="rounded-16 bg-black p-16"
        value={order.budget}
        setValue={order.setBudget}
        token={token}
        isBalanceLoading={query.isLoading}
        balance={query.data}
        isError={insufficientBalance}
        data-testid="input-budget"
      />
      {insufficientBalance && (
        <output
          htmlFor={`${token.symbol}-budget`}
          role="alert"
          aria-live="polite"
          className="flex items-center gap-10 font-mono text-12 text-red"
        >
          <IconWarning className="h-12 w-12" />
          <span className="flex-1">Insufficient balance</span>
        </output>
      )}
    </>
  );
};
