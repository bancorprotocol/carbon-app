import { Modal } from 'libs/modals/Modal';
import { ModalFC } from 'libs/modals/modals.types';
import { Action } from 'libs/sdk';
import { Token } from 'libs/tokens';
import { Button } from 'components/common/button';
import { TokenInputField } from 'components/common/TokenInputField';
import { MatchAction } from '@bancor/carbon-sdk/dist/types';
import { useModalTradeRouting } from 'libs/modals/modals/ModalTradeRouting/useModalTradeRouting';
import { ModalTradeRoutingRow } from 'libs/modals/modals/ModalTradeRouting/ModalTradeRoutingRow';

export type ModalTradeRoutingData = {
  source: Token;
  target: Token;
  tradeActionsRes: Action[];
  tradeActionsWei: MatchAction[];
  isTradeBySource: boolean;
  onSuccess: Function;
};

export const ModalTradeRouting: ModalFC<ModalTradeRoutingData> = ({
  id,
  data,
}) => {
  const {
    selected,
    onSelect,
    handleCTAClick,
    sourceFiatPrice,
    targetFiatPrice,
    onCancel,
    totalSourceAmount,
    totalTargetAmount,
  } = useModalTradeRouting({ id, data });

  return (
    <Modal id={id} title="Trade Routing" size={'md'}>
      <div className="mt-20 grid grid-cols-3 gap-10 rounded-8 bg-black p-10">
        <div>{data.source.symbol}</div>
        <div>{data.target.symbol}</div>
        <div>Average Price</div>

        {selected.map((action, index) => (
          <ModalTradeRoutingRow
            key={index}
            action={action}
            source={data.source}
            target={data.target}
            sourceFiatPrice={sourceFiatPrice.data}
            targetFiatPrice={targetFiatPrice.data}
            isSelected={action.isSelected}
            handleClick={onSelect}
          />
        ))}
      </div>

      <div className={'my-20 space-y-10'}>
        <div className={'rounded-12 bg-black p-16'}>
          <TokenInputField
            value={totalSourceAmount}
            token={data.source}
            disabled
          />
        </div>
        <div className={'rounded-12 bg-black p-16'}>
          <TokenInputField
            value={totalTargetAmount}
            token={data.target}
            disabled
          />
        </div>
      </div>

      <div className={'flex w-full space-x-10'}>
        <Button variant={'secondary'} fullWidth onClick={onCancel}>
          Cancel
        </Button>
        <Button fullWidth onClick={handleCTAClick}>
          Confirm
        </Button>
      </div>
    </Modal>
  );
};
