import { Button } from 'components/common/button';
import { m } from 'libs/motion';
import { BuySellBlock } from './BuySellBlock';
import { items } from './variants';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { useBudgetWarning } from '../useBudgetWarning';
import { UseStrategyCreateReturn } from 'components/strategies/create';
import { TokensOverlap } from 'components/common/tokensOverlap';

export const CreateStrategyOrders = ({
  base,
  quote,
  order0,
  order1,
  createStrategy,
  isCTAdisabled,
  token0BalanceQuery,
  token1BalanceQuery,
  strategyDirection,
  strategyType,
}: UseStrategyCreateReturn) => {
  const showBudgetWarning = useBudgetWarning(
    base,
    quote,
    order0.budget,
    order1.budget
  );

  return (
    <>
      <m.div
        variants={items}
        key={'createStrategyBuyTokens'}
        className={'flex space-x-10 rounded-10 bg-silver p-20 pl-30'}
      >
        <TokensOverlap className="h-40 w-40" tokens={[base!, quote!]} />
        <div>
          {
            <div className="flex space-x-6">
              <span>{base?.symbol}</span>
              <div className="text-secondary !text-16">/</div>
              <span>{quote?.symbol}</span>
            </div>
          }

          <div className="text-secondary capitalize">{strategyType}</div>
        </div>
      </m.div>

      {(strategyDirection === 'buy' || !strategyDirection) && (
        <m.div variants={items} key={'createStrategyBuyOrder'}>
          <BuySellBlock
            base={base!}
            quote={quote!}
            order={order0}
            buy
            tokenBalanceQuery={token1BalanceQuery}
            isBudgetOptional={+order0.budget === 0 && +order1.budget > 0}
          />
        </m.div>
      )}
      {(strategyDirection === 'sell' || !strategyDirection) && (
        <m.div variants={items} key={'createStrategySellOrder'}>
          <BuySellBlock
            base={base!}
            quote={quote!}
            order={order1}
            tokenBalanceQuery={token0BalanceQuery}
            isBudgetOptional={+order1.budget === 0 && +order0.budget > 0}
          />
        </m.div>
      )}
      {showBudgetWarning && (
        <div
          className={'font-auto flex items-center gap-6 px-25 text-warning-500'}
        >
          <div>
            <IconWarning className={'h-14 w-14'} />
          </div>
          <span className="font-mono text-12">
            Strategies with low budget might be ignored during trading due to
            gas considerations
          </span>
        </div>
      )}
      <m.div variants={items} key={'createStrategyCTA'}>
        <Button
          variant={'success'}
          size={'lg'}
          fullWidth
          onClick={createStrategy}
          disabled={isCTAdisabled}
        >
          Create Strategy
        </Button>
      </m.div>
    </>
  );
};
