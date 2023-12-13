import { useStore } from 'store';
import { Checkbox } from 'components/common/Checkbox/Checkbox';

export const DebugOverlapping = () => {
  const { debug } = useStore();

  const toggleOverlapping = (showOverlapping: boolean) => {
    debug.setDebugState((state) => ({ ...state, showOverlapping }));
  };

  return (
    <div className="bg-secondary flex flex-col items-center space-y-20 rounded-18 p-20">
      <h2>Overlapping Strategy</h2>
      <div className="flex items-center gap-8">
        <Checkbox
          data-testid="unchecked-signer"
          isChecked={debug.debugState.showOverlapping}
          setIsChecked={toggleOverlapping}
        />
        <span>Show Overlapping strategies</span>
      </div>
    </div>
  );
};
