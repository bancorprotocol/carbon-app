import { FC } from 'react';
import { Strategy } from 'queries';
import { m, mItemVariant } from 'motion';

type Props = { strategy: Strategy };

export const StrategyBlock: FC<Props> = ({ strategy }) => {
  return (
    <m.div
      variants={mItemVariant}
      className="bg-content space-y-10 rounded-10 p-20"
    >
      <div className={'flex space-x-10'}>{strategy.tokens.source}</div>
    </m.div>
  );
};
