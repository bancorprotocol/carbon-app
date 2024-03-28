import { CreateOverlappingStrategy } from 'components/simulator/input/overlapping/CreateOverlappingStrategy';
import {
  SimulatorInputOverlappingValues,
  SimulatorOverlappingInputDispatch,
} from 'hooks/useSimulatorOverlappingInput';

interface Props {
  state: SimulatorInputOverlappingValues;
  dispatch: SimulatorOverlappingInputDispatch;
  marketPrice: number;
}

// TODO can be removed
export const SimInputOverlapping = (props: Props) => {
  return (
    <CreateOverlappingStrategy
      {...props}
      spread={+props.state.spread!}
      setSpread={(v) => props.dispatch('spread', v.toString())}
    />
  );
};
