import { FC } from 'react';
import { InputRange } from '../../../strategies/create/BuySellBlock/InputRange';
import { Token } from 'libs/tokens';

interface Props {
  base: Token;
  quote: Token;
  min: string;
  max: string;
  error?: string;
  setError: (value: string) => void;
  setMin: (value: string) => void;
  setMax: (value: string) => void;
}

export const CreateOverlappingRange: FC<Props> = (props) => {
  const { base, quote, min, max, error, setError } = props;

  return (
    <InputRange
      base={base}
      quote={quote}
      min={min}
      max={max}
      setMin={props.setMin}
      setMax={props.setMax}
      minLabel="Min Buy Price"
      maxLabel="Max Sell Price"
      error={error}
      setRangeError={setError}
    />
  );
};
