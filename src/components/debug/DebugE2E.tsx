import { Checkbox } from 'components/common/Checkbox/Checkbox';
import { useStore } from 'store';

export const DebugE2E = () => {
  const { debug } = useStore();

  const toggleE2E = () => {
    debug.setDebugState((state) => ({ ...state, isE2E: !state.isE2E }));
  };

  return (
    <div className="bg-secondary flex flex-col gap-16 rounded-18 p-20">
      <h2 className="text-center">E2E</h2>
      <div className="flex items-center gap-8">
        <Checkbox
          isChecked={debug.debugState.isE2E}
          setIsChecked={toggleE2E}
          data-testid="is-e2e-checkbox"
        />
        <span>Is E2E ?</span>
      </div>
    </div>
  );
};
