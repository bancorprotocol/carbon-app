import { Radio, RadioGroup } from 'components/common/radio/RadioGroup';
import { StrategyDirection } from 'libs/routing';
import { FC } from 'react';

interface Props {
  direction: StrategyDirection;
  setDirection: (direction: StrategyDirection) => any;
}
export const OrderDirection: FC<Props> = (props) => {
  const { direction, setDirection } = props;
  const color =
    direction === 'buy' ? 'var(--buy-gradient)' : 'var(--sell-gradient)';

  return (
    <div className="p-24" style={{ ['--lens-background' as any]: color }}>
      <RadioGroup className="grid grid-flow-col text-center text-16 p-0">
        <Radio
          checked={direction === 'sell'}
          onChange={() => setDirection('sell')}
        >
          <p className="peer-checked/radio:text-black">Sell</p>
        </Radio>
        <Radio
          checked={direction === 'buy'}
          onChange={() => setDirection('buy')}
        >
          <p className="peer-checked/radio:text-black">Buy</p>
        </Radio>
      </RadioGroup>
    </div>
  );
};
