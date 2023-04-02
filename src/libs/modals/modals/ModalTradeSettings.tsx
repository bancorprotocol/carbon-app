import { ModalFC } from 'libs/modals/modals.types';
import { ModalSlideOver } from 'libs/modals/ModalSlideOver';
import { TradeSettings } from 'components/trade/settings/TradeSettings';
import { useStore } from 'store';
import { Token } from 'libs/tokens';
import { sendEvent } from 'services/googleTagManager';

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

  return (
    <ModalSlideOver
      id={id}
      title={
        <div className="flex flex-1 items-center justify-between">
          <h2>Trade Settings</h2>
          {!isAllSettingsDefault && (
            <button
              className="mr-20 font-mono text-16 font-weight-500 text-white"
              onClick={() => {
                resetAll();
                sendEvent('trade', 'trade_reset_all', undefined);
              }}
            >
              Reset All
            </button>
          )}
        </div>
      }
      size={'md'}
    >
      <TradeSettings base={data.base} quote={data.quote} />
    </ModalSlideOver>
  );
};
