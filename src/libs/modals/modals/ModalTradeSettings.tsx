import { useStore } from 'store';
import { carbonEvents } from 'services/events';
import { ModalFC } from 'libs/modals/modals.types';
import { ModalSlideOver } from 'libs/modals/ModalSlideOver';
import { Token } from 'libs/tokens';
import { TradeSettings } from 'components/trade/settings/TradeSettings';

export type ModalTradeSettingsData = {
  base: Token;
  quote: Token;
};

export const ModalTradeSettings: ModalFC<ModalTradeSettingsData> = ({
  id,
  data,
}) => {
  const {
    trade: {
      settings: { resetAll, isAllSettingsDefault },
    },
  } = useStore();

  const handleReset = () => {
    resetAll();
    carbonEvents.trade.tradeSettingsResetAllClick({
      ...data,
    });
  };

  return (
    <ModalSlideOver
      id={id}
      title={
        <div className="flex flex-1 items-center justify-between">
          <h2>Trade Settings</h2>
          {!isAllSettingsDefault && (
            <button
              className="mr-20 font-mono text-16 font-weight-500 text-white"
              onClick={handleReset}
            >
              Reset All
            </button>
          )}
        </div>
      }
      size={'md'}
    >
      <TradeSettings
        isAllSettingsDefault={isAllSettingsDefault}
        base={data.base}
        quote={data.quote}
      />
    </ModalSlideOver>
  );
};
