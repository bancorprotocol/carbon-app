import { Checkbox } from 'components/common/Checkbox/Checkbox';
import { useStore } from 'store';

export const DebugShowPoweredFooter = () => {
  const { debug } = useStore();

  const toggleShowPoweredFooter = () => {
    debug.setDebugState((state) => ({
      ...state,
      showPoweredFooter: !state.showPoweredFooter,
    }));
  };

  return (
    <div className="bg-secondary flex flex-col gap-16 rounded-18 p-20">
      <h2 className="text-center">Show Powered by CarbonDeFi Footer</h2>
      <div className="flex items-center gap-8">
        <Checkbox
          isChecked={debug.debugState.showPoweredFooter}
          setIsChecked={toggleShowPoweredFooter}
          data-testid="show-powered-by-checkbox"
        />
        <span>Show Powered by CarbonDeFi Footer</span>
      </div>
    </div>
  );
};
