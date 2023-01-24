import { ModalFC } from 'libs/modals/modals.types';
import { ModalSlideOver } from 'libs/modals/ModalSlideOver';
import { TradeSettings } from 'components/trade/settings/TradeSettings';

export const ModalTradeSettings: ModalFC<undefined> = ({ id }) => {
  return (
    <ModalSlideOver id={id} title={'Trade Settings'} size={'md'}>
      <TradeSettings />
    </ModalSlideOver>
  );
};
