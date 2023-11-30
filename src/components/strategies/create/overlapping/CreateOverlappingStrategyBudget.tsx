import { FC, useEffect, useState } from 'react';
import { Token } from 'libs/tokens';
import { OrderCreate } from '../useOrder';
import { UseQueryResult } from '@tanstack/react-query';
import { TokenInputField } from 'components/common/TokenInputField/TokenInputField';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { ReactComponent as IconLink } from 'assets/icons/link.svg';
import { OverlappingStrategyProps } from './CreateOverlappingStrategy';
import { MarketPricePercentage } from 'components/strategies/marketPriceIndication';
import { SafeDecimal } from 'libs/safedecimal';
import { carbonSDK } from 'libs/sdk';
import {
  getBuyMarginalPrice,
  getSellMarginalPrice,
  getSpread,
} from 'components/strategies/overlapping/utils';

interface Props extends OverlappingStrategyProps {
  marketPricePercentage: MarketPricePercentage;
  marketPrice: number;
}

export const CreateOverlappingStrategyBudget: FC<Props> = (props) => {
  const {
    base,
    quote,
    order0,
    order1,
    marketPrice,
    token0BalanceQuery,
    token1BalanceQuery,
    marketPricePercentage,
    spreadPPM,
  } = props;
  const maxBelowMarket = marketPricePercentage.max.lt(0);
  const minAboveMarket = marketPricePercentage.min.gt(0);
  const [anchoredOrder, setAnchoderOrder] = useState('buy');

  const setBuyBudget = async (sellBudget: string) => {
    if (!base || !quote) return;
    if (!sellBudget) {
      order0.setBudget('');
      order0.setMarginalPrice('');
      order1.setMarginalPrice('');
      return;
    }
    const buyBudget = await carbonSDK.calculateOverlappingStrategyBuyBudget(
      quote.address,
      order0.min,
      order0.max, // In create we only use order0 for now
      marketPrice.toString(),
      spreadPPM.toString(),
      sellBudget ?? '0'
    );
    order0.setBudget(buyBudget);
    const spread = getSpread(Number(order1.min), Number(order0.max), spreadPPM);
    const buyMarginalPrice = getBuyMarginalPrice(marketPrice, spread);
    const sellMarginalPrice = getSellMarginalPrice(marketPrice, spread);
    order1.setMarginalPrice(buyMarginalPrice.toString());
    order0.setMarginalPrice(sellMarginalPrice.toString());
  };

  const setSellBudget = async (buyBudget: string) => {
    if (!base || !quote) return;
    if (!buyBudget) {
      order1.setBudget('');
      order1.setMarginalPrice('');
      order0.setMarginalPrice('');
      return;
    }
    const sellBudget = await carbonSDK.calculateOverlappingStrategySellBudget(
      base.address,
      order0.min,
      order0.max, // In create we only use order0 for now
      marketPrice.toString(),
      spreadPPM.toString(),
      buyBudget ?? '0'
    );
    order1.setBudget(sellBudget);
    const spread = getSpread(Number(order0.min), Number(order1.max), spreadPPM);
    const buyMarginalPrice = getBuyMarginalPrice(marketPrice, spread);
    const sellMarginalPrice = getSellMarginalPrice(marketPrice, spread);
    order0.setMarginalPrice(buyMarginalPrice.toString());
    order1.setMarginalPrice(sellMarginalPrice.toString());
  };

  // Update budget on price change
  useEffect(() => {
    if (anchoredOrder === 'buy') setSellBudget(order0.budget);
    if (anchoredOrder === 'sell') setBuyBudget(order1.budget);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order0.min, order0.max, marketPrice]);

  const onBuyBudgetChange = (value: string) => {
    order0.setBudget(value);
    setAnchoderOrder('buy');
    setSellBudget(value);
  };
  const onSellBudgetChange = (value: string) => {
    order1.setBudget(value);
    setAnchoderOrder('sell');
    setBuyBudget(value);
  };

  if (maxBelowMarket) {
    return (
      <>
        <TokenBudget
          token={quote}
          order={order0}
          query={token1BalanceQuery}
          onChange={onBuyBudgetChange}
        />
        <Explaination base={base} buy />
      </>
    );
  } else if (minAboveMarket) {
    return (
      <>
        <TokenBudget
          token={base}
          order={order1}
          query={token0BalanceQuery}
          onChange={onSellBudgetChange}
        />
        <Explaination base={base} />
      </>
    );
  } else {
    return (
      <>
        <TokenBudget
          token={quote}
          order={order0}
          query={token1BalanceQuery}
          onChange={onBuyBudgetChange}
        />
        <TokenBudget
          token={base}
          order={order1}
          query={token0BalanceQuery}
          onChange={onSellBudgetChange}
        />
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
  onChange: (value: string) => void;
}

const TokenBudget: FC<TokenBudgetProps> = (props) => {
  const { token, order, query, onChange } = props;
  if (!token) return <></>;

  const insufficientBalance =
    !query.isLoading && new SafeDecimal(query.data || 0).lt(order.budget);

  return (
    <>
      <TokenInputField
        id={`${token.symbol}-budget`}
        className="rounded-16 bg-black p-16"
        value={order.budget}
        setValue={onChange}
        token={token}
        isBalanceLoading={query.isLoading}
        balance={query.data}
        isError={insufficientBalance}
        data-testid={`input-budget-${token.symbol}`}
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
