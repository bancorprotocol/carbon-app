import { CreateOverlappingStrategy } from 'components/simulator/input/overlapping/CreateOverlappingStrategy';
import {
  StrategyInputDispatch,
  StrategyInputValues,
} from 'hooks/useStrategyInput';

interface Props {
  state: StrategyInputValues;
  dispatch: StrategyInputDispatch;
  marketPrice: number;
}

// TODO can be removed
export const SimInputOverlapping = (props: Props) => {
  return (
    <CreateOverlappingStrategy
      {...props}
      spread={+props.state.overlappingSpread!}
      setSpread={(v) => props.dispatch('overlappingSpread', v.toString())}
    />
  );
};
