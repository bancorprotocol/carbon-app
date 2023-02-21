import { ModalFC } from 'libs/modals/modals.types';
import { ModalSlideOver } from 'libs/modals/ModalSlideOver';
import { TradeSettings } from 'components/trade/settings/TradeSettings';
import { useStore } from 'store';

export const ModalTradeSettings: ModalFC<undefined> = ({ id }) => {
  const {
    trade: {
      settings: { resetAll, isAllSettingsDefault },
    },
  } = useStore();
  return (
    <ModalSlideOver
      id={id}
      title={
        <div className="flex flex-1 items-center justify-between">
          <h2>Trade Settings</h2>
          {!isAllSettingsDefault && (
            <button
              className="mr-20 font-mono text-16 font-weight-500 text-white"
              onClick={() => resetAll()}
            >
              Reset All
            </button>
          )}
        </div>
      }
      size={'md'}
    >
      <TradeSettings />
    </ModalSlideOver>
  );
};
