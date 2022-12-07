import { FC } from 'react';
import { Strategy } from 'queries';
import { m, mItemVariant } from 'motion';
import { TokensOverlap } from 'components/TokensOverlap';

type Props = { strategy: Strategy };

export const StrategyBlock: FC<Props> = ({ strategy }) => {
  return (
    <m.div
      variants={mItemVariant}
      className="bg-content space-y-20 rounded-10 p-20"
    >
      <div className={'flex space-x-10'}>
        <TokensOverlap
          tokens={[strategy.tokens.source, strategy.tokens.target]}
        />
        <span>{strategy.tokens.source.symbol}</span>
        <div>·</div>
        <span>{strategy.tokens.target.symbol}</span>
      </div>
      <hr className="border-silver dark:border-black-low" />
    </m.div>
  );
};
