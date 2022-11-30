import { TokenBlock } from 'components/TokenBlock';
import { OrderBlock } from 'components/OrderBlock';
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
      <div className={'flex space-x-10'}>
        {[1, 2].map((i) => (
          <TokenBlock
            key={i}
            text={'TKN'}
            textSecondary={'100.000.000'}
            imgUrl={''}
          />
        ))}
      </div>
      {[1, 2].map((i) => (
        <OrderBlock
          key={i}
          text={'100,000,000 TKN'}
          textSecondary={'Sell 1 TKN for'}
        />
      ))}
      <div>ID: {strategy.id}</div>
    </m.div>
  );
};
