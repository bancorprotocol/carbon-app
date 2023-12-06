import { FC, useEffect } from 'react';
import { Strategy, useGetTokenBalance } from 'libs/queries';
import { ReactComponent as IconTooltip } from 'assets/icons/tooltip.svg';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { OverlappingStrategyGraph } from '../../overlapping/OverlappingStrategyGraph';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { getRoundedSpreadPPM } from '../../overlapping/utils';
import { useMarketIndication } from 'components/strategies/marketPriceIndication';
import { OrderCreate } from 'components/strategies/create/useOrder';
import { ReactComponent as IconAction } from 'assets/icons/action.svg';
import { ReactComponent as IconLink } from 'assets/icons/link.svg';
import { SafeDecimal } from 'libs/safedecimal';
import { BudgetInput } from 'components/strategies/common/BudgetInput';
import { DepositAllocatedBudget } from 'components/strategies/common/AllocatedBudget';
import { carbonSDK } from 'libs/sdk';

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

  const marketPrice = useMarketPrice({ base, quote });
  const spreadPPM = getRoundedSpreadPPM(strategy);
  const min = order0.min;
  const max = order1.max;
  const { marketPricePercentage } = useMarketIndication({
    base,
    quote,
    order: { min, max, price: '', isRange: true },
  });

  const aboveMarket = new SafeDecimal(min).gt(marketPrice);
  const belowMarket = new SafeDecimal(max).lt(marketPrice);

  const setBuyBudget = async (sellBudget: string) => {
    const buyBudget = await carbonSDK.calculateOverlappingStrategyBuyBudget(
      quote.address,
      order0.min,
      order1.max,
      marketPrice.toString(),
      spreadPPM.toString(),
      sellBudget ?? '0'
    );
    order0.setBudget(buyBudget);
  };

  const setSellBudget = async (buyBudget: string) => {
    const sellBudget = await carbonSDK.calculateOverlappingStrategySellBudget(
      base.address,
      quote.address,
      order0.min,
      order1.max,
      marketPrice.toString(),
      spreadPPM.toString(),
      buyBudget ?? '0'
    );
    order1.setBudget(sellBudget);
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
    const balance = tokenBaseBalanceQuery.data ?? '0';
    checkInsufficientBalance(balance, order0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order0.budget]);

  // Check for error when sell budget changes
  useEffect(() => {
    const balance = tokenQuoteBalanceQuery.data ?? '0';
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

  return (
    <>
      <article className="flex flex-col gap-20 rounded-10 bg-silver p-20">
        <header className="flex items-center gap-8">
          <h3 className="flex-1 text-18 font-weight-500">Price Range</h3>
          {/* TODO add tooltip text here */}
          <Tooltip element={''}>
            <IconTooltip className="h-14 w-14 text-white/60" />
          </Tooltip>
        </header>
        <OverlappingStrategyGraph
          base={base}
          quote={quote}
          order0={order0}
          order1={order1}
          marketPrice={marketPrice}
          spreadPPM={spreadPPM}
          marketPricePercentage={marketPricePercentage}
          disabled
        />
      </article>
      <article className="flex flex-col gap-20 rounded-10 bg-silver p-20">
        <header className="flex items-center gap-8 ">
          <h3 className="flex-1 text-18 font-weight-500">Deposit Budget</h3>
          {/* TODO add tooltip text here */}
          <Tooltip element={''}>
            <IconTooltip className="h-14 w-14 text-white/60" />
          </Tooltip>
        </header>
        {!aboveMarket && (
          <BudgetInput
            token={quote}
            query={tokenQuoteBalanceQuery}
            order={order0}
            onChange={onBuyBudgetChange}
          >
            <DepositAllocatedBudget
              token={quote}
              currentBudget={strategy.order0.balance}
              buy
            />
          </BudgetInput>
        )}
        {!belowMarket && (
          <BudgetInput
            token={base}
            query={tokenBaseBalanceQuery}
            order={order1}
            onChange={onSellBudgetChange}
          >
            <DepositAllocatedBudget
              token={base}
              currentBudget={strategy.order1.balance}
            />
          </BudgetInput>
        )}
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
