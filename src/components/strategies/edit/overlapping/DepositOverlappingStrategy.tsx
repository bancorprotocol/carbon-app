import { FC, useEffect } from 'react';
import { Strategy, useGetTokenBalance } from 'libs/queries';
import { ReactComponent as IconTooltip } from 'assets/icons/tooltip.svg';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { OverlappingStrategyGraph } from '../../overlapping/OverlappingStrategyGraph';
import { useMarketPrice } from 'hooks/useMarketPrice';
import {
  getRoundedSpreadPPM,
  isMaxBelowMarket,
  isMinAboveMarket,
} from '../../overlapping/utils';
import { useMarketIndication } from 'components/strategies/marketPriceIndication';
import { OrderCreate } from 'components/strategies/create/useOrder';
import { ReactComponent as IconAction } from 'assets/icons/action.svg';
import { ReactComponent as IconLink } from 'assets/icons/link.svg';
import { SafeDecimal } from 'libs/safedecimal';
import { BudgetInput } from 'components/strategies/common/BudgetInput';
import { DepositAllocatedBudget } from 'components/strategies/common/AllocatedBudget';
import { carbonSDK } from 'libs/sdk';
import { MarginalPriceOptions } from '@bancor/carbon-sdk/strategy-management';
import { MarketWarning } from './MarketWarning';
import { geoMean } from 'utils/fullOutcome';

interface Props {
  strategy: Strategy;
  order0: OrderCreate;
  order1: OrderCreate;
}

export const DepositOverlappingStrategy: FC<Props> = (props) => {
  const { strategy, order0, order1 } = props;
  const { base, quote } = strategy;

  const tokenBaseBalanceQuery = useGetTokenBalance(base);
  const tokenQuoteBalanceQuery = useGetTokenBalance(quote);

  const externalMarketPrice = useMarketPrice({ base, quote });
  const oldMarketPrice = geoMean(order0.marginalPrice, order1.marginalPrice)!;

  const spreadPPM = getRoundedSpreadPPM(strategy);
  const min = order0.min;
  const max = order1.max;
  const { marketPricePercentage } = useMarketIndication({
    base,
    quote,
    order: { min, max, price: '', isRange: true },
  });

  const aboveMarket = isMinAboveMarket(order0, quote);
  const belowMarket = isMaxBelowMarket(order1, quote);

  useEffect(() => {
    order0.setMarginalPriceOption(MarginalPriceOptions.maintain);
    order1.setMarginalPriceOption(MarginalPriceOptions.maintain);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    const sellBudget = new SafeDecimal(sellBudgetDelta || '0').plus(
      strategy.order1.balance || '0'
    );
    const resultBuyBudget =
      await carbonSDK.calculateOverlappingStrategyBuyBudget(
        base.address,
        quote.address,
        order0.min,
        order1.max,
        getMarketPrice(),
        spreadPPM.toString(),
        sellBudget.toString()
      );
    const buyBudget = new SafeDecimal(resultBuyBudget).minus(
      strategy.order0.balance || '0'
    );
    order0.setBudget(buyBudget.toString());
  };

  const setSellBudget = async (buyBudgetDelta: string) => {
    if (!buyBudgetDelta) return order1.setBudget('');
    const buyBudget = new SafeDecimal(buyBudgetDelta || '0').plus(
      strategy.order0.balance || '0'
    );
    const resultSellBudget =
      await carbonSDK.calculateOverlappingStrategySellBudget(
        base.address,
        quote.address,
        order0.min,
        order1.max,
        getMarketPrice(),
        spreadPPM.toString(),
        buyBudget.toString()
      );
    const sellBudget = new SafeDecimal(resultSellBudget).minus(
      strategy.order1.balance || '0'
    );
    order1.setBudget(sellBudget.toString());
  };

  const checkInsufficientBalance = (balance: string, order: OrderCreate) => {
    if (new SafeDecimal(balance).lt(order.budget)) {
      order.setBudgetError('Insufficient balance');
    } else {
      order.setBudgetError('');
    }
  };

  // Check for error when buy budget changes
  useEffect(() => {
    const balance = tokenQuoteBalanceQuery.data ?? '0';
    checkInsufficientBalance(balance, order0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order0.budget]);

  // Check for error when sell budget changes
  useEffect(() => {
    const balance = tokenBaseBalanceQuery.data ?? '0';
    checkInsufficientBalance(balance, order1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order1.budget]);

  const onBuyBudgetChange = (value: string) => {
    order0.setBudget(value);
    setSellBudget(value);
  };
  const onSellBudgetChange = (value: string) => {
    order1.setBudget(value);
    setBuyBudget(value);
  };

  const marketWarningProps = { oldMarketPrice, externalMarketPrice };

  return (
    <>
      <article className="flex flex-col gap-20 rounded-10 bg-silver p-20">
        <header>
          <h3 className="flex-1 text-18 font-weight-500">Price Range</h3>
        </header>
        <OverlappingStrategyGraph
          base={base}
          quote={quote}
          order0={order0}
          order1={order1}
          marketPrice={externalMarketPrice}
          spreadPPM={spreadPPM}
          marketPricePercentage={marketPricePercentage}
          disabled
        />
      </article>
      <article className="flex flex-col gap-20 rounded-10 bg-silver p-20">
        <header className="flex items-center gap-8 ">
          <h3 className="flex-1 text-18 font-weight-500">Deposit Budget</h3>
          <Tooltip element='Indicate the amount you wish to deposit from the available "allocated budget"'>
            <IconTooltip className="h-14 w-14 text-white/60" />
          </Tooltip>
        </header>
        <BudgetInput
          token={quote}
          query={tokenQuoteBalanceQuery}
          order={order0}
          onChange={onBuyBudgetChange}
          disabled={aboveMarket || order0.min === '0'}
        >
          <DepositAllocatedBudget
            token={quote}
            currentBudget={strategy.order0.balance}
            buy
          />
          <MarketWarning {...marketWarningProps} />
        </BudgetInput>
        <BudgetInput
          token={base}
          query={tokenBaseBalanceQuery}
          order={order1}
          onChange={onSellBudgetChange}
          disabled={belowMarket || order1.max === '0'}
        >
          <DepositAllocatedBudget
            token={base}
            currentBudget={strategy.order1.balance}
          />
          <MarketWarning {...marketWarningProps} />
        </BudgetInput>
        <footer className="flex items-center gap-8">
          <IconAction className="h-16 w-16" />
          <p className="text-12 text-white/60">
            Price range and liquidity spread remain unchanged.&nbsp;
            <a
              href="https://faq.carbondefi.xyz/what-is-an-overlapping-strategy#overlapping-budget-dynamics"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-4 font-weight-500 text-green"
            >
              <span>Learn More</span>
              <IconLink className="inline h-12 w-12" />
            </a>
          </p>
        </footer>
      </article>
    </>
  );
};
