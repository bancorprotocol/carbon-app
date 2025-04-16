import { useStore } from 'store';
import { ModalFC } from 'libs/modals/modals.types';
import { ModalSlideOver } from 'libs/modals/ModalSlideOver';
import { TradeSettings } from 'components/trade/settings/TradeSettings';

export const ModalTradeSettings: ModalFC<undefined> = ({ id }) => {
  const {
    trade: {
      settings: { resetAll, isAllSettingsDefault },
    },
  } = useStore();

  const handleReset = () => resetAll();

  return (
    <ModalSlideOver
      id={id}
      title={
        <div className="flex flex-1 items-center justify-between">
          <h2>Trade Settings</h2>
          {!isAllSettingsDefault && (
            <button
              className="text-16 font-weight-500 mr-20 text-white"
              onClick={handleReset}
            >
              Reset All
            </button>
          )}
        </div>
      }
      size="md"
    >
      <TradeSettings />
    </ModalSlideOver>
  );
};
