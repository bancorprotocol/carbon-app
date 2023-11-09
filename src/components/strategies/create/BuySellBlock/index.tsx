import { FC, useId } from 'react';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { OrderCreate } from 'components/strategies/create/useOrder';
import { Token } from 'libs/tokens';
import { UseQueryResult } from 'libs/queries';
import { LimitRangeSection } from './LimitRangeSection';
import { LogoImager } from 'components/common/imager/Imager';
import {
  StrategyDirection,
  StrategyType,
} from 'components/strategies/create/types';
import { TabsMenu } from 'components/common/tabs/TabsMenu';
import { TabsMenuButton } from 'components/common/tabs/TabsMenuButton';
import { FullOutcome } from 'components/strategies/FullOutcome';
import { useNavigate } from 'libs/routing';
import { BuySellHeader } from './Header';
import { m } from 'libs/motion';
import { items } from '../variants';
import { BudgetSection } from './BugetSection';

type Props = {
  base: Token;
  quote: Token;
  tokenBalanceQuery: UseQueryResult<string>;
  order: OrderCreate;
  buy?: boolean;
  isBudgetOptional?: boolean;
  strategyType?: StrategyType;
  isOrdersOverlap: boolean;
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
}) => {
  const titleId = useId();
  const navigate = useNavigate();

  const tooltipText = `This section will define the order details in which you are willing to ${
    buy ? 'buy' : 'sell'
  } ${base.symbol} at.`;

  const inputTitle = (
    <>
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-[10px] text-white/60">
        1
      </span>
      <Tooltip
        sendEventOnMount={{ buy }}
        element={`Define the price you are willing to ${buy ? 'buy' : 'sell'} ${
          base.symbol
        } at. Make sure the price is in ${quote.symbol} tokens.`}
      >
        <>
          <span className="text-white/80">
            Set {buy ? 'Buy' : 'Sell'} Price&nbsp;
          </span>
          <span className="text-white/60">
            ({quote.symbol} per 1 {base.symbol})
          </span>
        </>
      </Tooltip>
    </>
  );

  const changeStrategy = (direction: StrategyDirection) => {
    navigate({
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
      className={`bg-secondary flex flex-col gap-20 rounded-10 border-l-2 p-20 ${
        buy
          ? 'border-green/50 focus-within:border-green'
          : 'border-red/50 focus-within:border-red'
      }`}
      data-testid={`${buy ? 'buy' : 'sell'}-section`}
    >
      {strategyType === 'disposable' && (
        <TabsMenu>
          <TabsMenuButton onClick={() => changeStrategy('buy')} isActive={buy}>
            Buy
          </TabsMenuButton>
          <TabsMenuButton
            onClick={() => changeStrategy('sell')}
            isActive={!buy}
          >
            Sell
          </TabsMenuButton>
        </TabsMenu>
      )}

      <BuySellHeader {...headerProps}>
        <h3 className="flex items-center gap-8" id={titleId}>
          <Tooltip sendEventOnMount={{ buy }} element={tooltipText}>
            <span>{buy ? 'Buy Low' : 'Sell High'}</span>
          </Tooltip>
          <LogoImager alt="Token" src={base.logoURI} className="h-18 w-18" />
          <span>{base.symbol}</span>
        </h3>
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
