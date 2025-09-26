import { Radio, RadioGroup } from 'components/common/radio/RadioGroup';
import { StrategyDirection } from 'libs/routing';
import { FC } from 'react';
import { cn } from 'utils/helpers';

interface Props {
  direction: StrategyDirection;
  setDirection: (direction: StrategyDirection) => any;
}
export const OrderDirection: FC<Props> = (props) => {
  const { direction, setDirection } = props;
  const color = direction === 'buy' ? 'bg-buy-gradient' : 'bg-sell-gradient';

  return (
    <div className={cn(color, 'transition-all duration-300')}>
      <RadioGroup className="grid grid-flow-col gap-8 text-center text-16 rounded-none p-8">
        <Radio
          checked={direction === 'sell'}
          onChange={() => setDirection('sell')}
        >
          <p>Sell</p>
        </Radio>
        <Radio
          checked={direction === 'buy'}
          onChange={() => setDirection('buy')}
        >
          <p>Buy</p>
        </Radio>
      </RadioGroup>
    </div>
  );
};
