import { FC, useEffect, useId } from 'react';
import { Strategy, useGetTokenBalance } from 'libs/queries';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { OverlappingStrategyGraph } from '../../overlapping/OverlappingStrategyGraph';
import { useMarketPrice } from 'hooks/useMarketPrice';
import {
  getRoundedSpread,
  isMaxBelowMarket,
  isMinAboveMarket,
  isOverlappingBudgetTooSmall,
} from '../../overlapping/utils';
import { useMarketIndication } from 'components/strategies/marketPriceIndication';
import { OrderCreate } from 'components/strategies/create/useOrder';
import { ReactComponent as IconAction } from 'assets/icons/action.svg';
import { ReactComponent as IconLink } from 'assets/icons/link.svg';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { SafeDecimal } from 'libs/safedecimal';
import { BudgetInput } from 'components/strategies/common/BudgetInput';
import { WithdrawAllocatedBudget } from 'components/strategies/common/AllocatedBudget';
import {
  MarginalPriceOptions,
  calculateOverlappingBuyBudget,
  calculateOverlappingSellBudget,
} from '@bancor/carbon-sdk/strategy-management';
import { geoMean } from 'utils/fullOutcome';
import { OverlappingSmallBudget } from 'components/strategies/overlapping/OverlappingSmallBudget';

interface Props {
  strategy: Strategy;
  order0: OrderCreate;
  order1: OrderCreate;
}

export const WithdrawOverlappingStrategy: FC<Props> = (props) => {
  const { strategy, order0, order1 } = props;
  const { base, quote } = strategy;
  const buyId = useId();
  const sellId = useId();

  const tokenBaseBalanceQuery = useGetTokenBalance(base);
  const tokenQuoteBalanceQuery = useGetTokenBalance(quote);

  const externalMarketPrice = useMarketPrice({ base, quote });
  const oldMarketPrice = geoMean(order0.marginalPrice, order1.marginalPrice)!;

  const spread = getRoundedSpread(strategy);
  const min = order0.min;
  const max = order1.max;
  const { marketPricePercentage } = useMarketIndication({
    base,
    quote,
    order: { min, max, price: '', isRange: true },
  });
  const budgetTooSmall = isOverlappingBudgetTooSmall(order0, order1);
  const buyBudgetId = useId();
  const sellBudgetId = useId();

  useEffect(() => {
    order0.setMarginalPriceOption(MarginalPriceOptions.maintain);
    order1.setMarginalPriceOption(MarginalPriceOptions.maintain);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkInsufficientBalance = (balance: string, order: OrderCreate) => {
    if (new SafeDecimal(balance).lt(order.budget)) {
      order.setBudgetError('Insufficient balance');
    } else {
      order.setBudgetError('');
    }
  };

  // Check for error when buy budget changes
  useEffect(() => {
    const balance = strategy.order0.balance;
    checkInsufficientBalance(balance, order0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order0.budget]);

  // Check for error when sell budget changes
  useEffect(() => {
    const balance = strategy.order1.balance;
    checkInsufficientBalance(balance, order1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order1.budget]);

  const aboveMarket = isMinAboveMarket(order0);
  const belowMarket = isMaxBelowMarket(order1);
  const withdrawAll =
    (order0.budget || '0') === strategy.order0.balance &&
    (order1.budget || '0') === strategy.order1.balance;

  const getMarketPrice = () => {
    if (aboveMarket || new SafeDecimal(strategy.order0.balance).eq(0)) {
      return order0.min;
    }
    if (belowMarket || new SafeDecimal(strategy.order1.balance).eq(0)) {
      return order1.max;
    }
    return oldMarketPrice.toString();
  };

  const setBuyBudget = async (sellBudgetDelta: string) => {
    if (!sellBudgetDelta) return order0.setBudget('');
    const currentBuyBudget = new SafeDecimal(strategy.order0.balance || '0');
    const currentSellBudget = new SafeDecimal(strategy.order1.balance || '0');
    const sellBudget = currentSellBudget.minus(sellBudgetDelta);
    const totalBuy = calculateOverlappingBuyBudget(
      base.decimals,
      quote.decimals,
      order0.min,
      order1.max,
      getMarketPrice(),
      spread.toString(),
      sellBudget.toString()
    );
    const buyBudget = new SafeDecimal(currentBuyBudget).minus(totalBuy);
    order0.setBudget(SafeDecimal.max(buyBudget, 0).toString());
  };

  const setSellBudget = async (buyBudgetDelta: string) => {
    if (!buyBudgetDelta) return order1.setBudget('');
    const currentBuyBudget = new SafeDecimal(strategy.order0.balance || '0');
    const currentSellBudget = new SafeDecimal(strategy.order1.balance || '0');
    const buyBudget = currentBuyBudget.minus(buyBudgetDelta);
    const totalSell = calculateOverlappingSellBudget(
      base.decimals,
      quote.decimals,
      order0.min,
      order1.max,
      getMarketPrice(),
      spread.toString(),
      buyBudget.toString()
    );
    const sellBudget = new SafeDecimal(currentSellBudget).minus(totalSell);
    order1.setBudget(SafeDecimal.max(0, sellBudget).toString());
  };

  const onBuyBudgetChange = (value: string) => {
    order0.setBudget(value);
    setSellBudget(value);
  };
  const onSellBudgetChange = (value: string) => {
    order1.setBudget(value);
    setBuyBudget(value);
  };

  return (
    <>
      <article className="flex flex-col gap-20 rounded-10 bg-background-900 p-20">
        <header>
          <h3 className="flex-1 text-18 font-weight-500">Price Range</h3>
        </header>
        <OverlappingStrategyGraph
          base={base}
          quote={quote}
          order0={order0}
          order1={order1}
          marketPrice={externalMarketPrice}
          spread={spread}
          marketPricePercentage={marketPricePercentage}
          disabled
        />
      </article>
      <article className="flex flex-col gap-20 rounded-10 bg-background-900 p-20">
        <header className="flex items-center gap-8 ">
          <h3 className="flex-1 text-18 font-weight-500">Withdraw Budget</h3>
          <Tooltip
            element='Indicate the amount you wish to withdraw to the available "wallet budget"'
            iconClassName="h-14 w-14 text-white/60"
          />
        </header>
        <BudgetInput
          action="withdraw"
          id={buyBudgetId}
          token={quote}
          max={tokenQuoteBalanceQuery.data ?? '0'}
          value={order0.min}
          onChange={onBuyBudgetChange}
          disabled={aboveMarket || order0.min === '0'}
        />
        <WithdrawAllocatedBudget
          token={quote}
          order={order0}
          currentBudget={strategy.order0.balance}
          setBudget={onBuyBudgetChange}
          buy
        />
        <BudgetInput
          action="withdraw"
          id={sellBudgetId}
          token={base}
          max={tokenBaseBalanceQuery.data ?? '0'}
          value={order1.max}
          onChange={onSellBudgetChange}
          disabled={belowMarket || order1.max === '0'}
        />
        <WithdrawAllocatedBudget
          token={base}
          order={order1}
          currentBudget={strategy.order1.balance}
          setBudget={onSellBudgetChange}
        />
        {budgetTooSmall && (
          <OverlappingSmallBudget
            base={base}
            quote={quote}
            buyBudget={order0.budget}
            htmlFor={`${buyBudgetId} ${sellBudgetId}`}
          />
        )}
        <footer className="flex items-center gap-8">
          {!withdrawAll && (
            <>
              <IconAction className="h-16 w-16" />
              <p className="text-12 text-white/60">
                Price range and liquidity spread remain unchanged.&nbsp;
                <a
                  href="https://faq.carbondefi.xyz/what-is-an-overlapping-strategy#overlapping-budget-dynamics"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-4 font-weight-500 text-primary"
                >
                  <span>Learn More</span>
                  <IconLink className="inline h-12 w-12" />
                </a>
              </p>
            </>
          )}
          {withdrawAll && (
            <output
              htmlFor={[buyId, sellId].join(',')}
              role="alert"
              aria-live="polite"
              className="flex items-center gap-10 font-mono text-12 text-warning"
            >
              <IconWarning className="h-12 w-12" />
              <span className="flex-1">
                Please note that your strategy will be inactive as it will not
                have any budget.
              </span>
            </output>
          )}
        </footer>
      </article>
    </>
  );
};
