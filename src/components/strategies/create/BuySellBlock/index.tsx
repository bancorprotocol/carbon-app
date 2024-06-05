import { FC, useId } from 'react';
import { Token } from 'libs/tokens';
import { UseQueryResult } from 'libs/queries';
import { m } from 'libs/motion';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { OrderCreate } from 'components/strategies/create/useOrder';
import { StrategyDirection, StrategyType, useNavigate } from 'libs/routing';
import { LimitRangeSection } from 'components/strategies/create/BuySellBlock/LimitRangeSection';
import { LogoImager } from 'components/common/imager/Imager';
import { TabsMenu } from 'components/common/tabs/TabsMenu';
import { TabsMenuButton } from 'components/common/tabs/TabsMenuButton';
import { FullOutcome } from 'components/strategies/FullOutcome';
import { BuySellHeader } from 'components/strategies/create/BuySellBlock/Header';
import { items } from 'components/strategies/common/variants';
import { BudgetSection } from 'components/strategies/create/BuySellBlock/BudgetSection';

type Props = {
  base: Token;
  quote: Token;
  tokenBalanceQuery: UseQueryResult<string>;
  order: OrderCreate;
  buy?: boolean;
  isBudgetOptional?: boolean;
  strategyType?: StrategyType;
  isOrdersOverlap: boolean;
  isOrdersReversed: boolean;
};

export const BuySellBlock: FC<Props> = ({
  base,
  quote,
  tokenBalanceQuery,
  order,
  isBudgetOptional,
  strategyType,
  buy = false,
  isOrdersOverlap,
  isOrdersReversed,
}) => {
  const titleId = useId();
  const navigate = useNavigate();

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

  const changeStrategy = (direction: StrategyDirection) => {
    order.resetFields();
    navigate({
      from: '/strategies/create',
      search: (search) => ({
        ...search,
        strategyDirection: direction,
      }),
      replace: true,
    });
  };

  const headerProps = { titleId, order, base, buy };
  const limitRangeProps = {
    base,
    quote,
    order,
    buy,
    inputTitle,
    isOrdersOverlap,
    isOrdersReversed,
  };
  const budgetProps = {
    buy,
    quote,
    base,
    strategyType,
    order,
    isBudgetOptional,
    tokenBalanceQuery,
  };

  return (
    <m.section
      variants={items}
      aria-labelledby={titleId}
      className={`rounded-10 bg-background-900 flex flex-col gap-20 border-l-2 p-20 ${
        buy
          ? 'border-buy/50 focus-within:border-buy'
          : 'border-sell/50 focus-within:border-sell'
      }`}
      data-testid={`${buy ? 'buy' : 'sell'}-section`}
    >
      {strategyType === 'disposable' && (
        <TabsMenu>
          <TabsMenuButton
            onClick={() => changeStrategy('buy')}
            isActive={buy}
            data-testid="tab-buy"
          >
            Buy
          </TabsMenuButton>
          <TabsMenuButton
            onClick={() => changeStrategy('sell')}
            isActive={!buy}
            data-testid="tab-sell"
          >
            Sell
          </TabsMenuButton>
        </TabsMenu>
      )}

      <BuySellHeader {...headerProps}>
        <h2 className="text-18 flex items-center gap-8" id={titleId}>
          <Tooltip sendEventOnMount={{ buy }} element={tooltipText}>
            <span>{buy ? 'Buy Low' : 'Sell High'}</span>
          </Tooltip>
          <LogoImager alt="Token" src={base.logoURI} className="size-18" />
          <span>{base.symbol}</span>
        </h2>
      </BuySellHeader>
      <LimitRangeSection {...limitRangeProps} />
      <BudgetSection {...budgetProps} />
      <FullOutcome
        price={order.price}
        min={order.min}
        max={order.max}
        budget={order.budget}
        buy={buy}
        base={base}
        quote={quote}
      />
    </m.section>
  );
};
