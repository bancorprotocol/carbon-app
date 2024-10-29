import { FC } from 'react';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { ReactComponent as IconTooltip } from 'assets/icons/tooltip.svg';
import { cn, prettifyNumber } from 'utils/helpers';
import { StrategyWithFiat } from 'libs/queries';

interface Props {
  strategy: StrategyWithFiat;
}

export const StrategyBlockTradeCount: FC<Props> = ({ strategy }) => {
  const count = prettifyNumber(strategy.tradeCount, {
    abbreviate: true,
    decimals: 0,
  });
  return (
    <article
      className={cn(
        'rounded-8 border-background-800 flex w-1/3 flex-col border-2 p-16',
        strategy.status === 'active' ? '' : 'opacity-50'
      )}
    >
      <Tooltip element="Trade count indicates how often this strategy has been used. More trades suggest it was relevant and actively engaged in trading.">
        <h4 className="text-12 flex items-center gap-4 text-white/60">
          Trades
          <IconTooltip className="size-10" />
        </h4>
      </Tooltip>
      <p className="text-18 font-weight-500">{count}</p>
    </article>
  );
};
