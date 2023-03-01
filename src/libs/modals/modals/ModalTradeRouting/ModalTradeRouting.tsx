import { Modal } from 'libs/modals/Modal';
import { ModalFC } from 'libs/modals/modals.types';
import { Action } from 'libs/sdk';
import { Token } from 'libs/tokens';
import { Button } from 'components/common/button';
import { TokenInputField } from 'components/common/TokenInputField';
import { MatchAction } from '@bancor/carbon-sdk/dist/types';
import { useModalTradeRouting } from 'libs/modals/modals/ModalTradeRouting/useModalTradeRouting';
import { ModalTradeRoutingRow } from 'libs/modals/modals/ModalTradeRouting/ModalTradeRoutingRow';
import { ModalTradeRoutingHeader } from 'libs/modals/modals/ModalTradeRouting/ModalTradeRoutingHeader';
import { ReactComponent as IconArrow } from 'assets/icons/arrowDown.svg';

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
    disabledCTA,
  } = useModalTradeRouting({ id, data });

  return (
    <Modal id={id} title="Trade Routing" size={'md'}>
      <div className={'text-secondary mt-20 mb-5'}>Routing Table</div>
      <ModalTradeRoutingHeader
        baseSymbol={data.source.symbol}
        quoteSymbol={data.target.symbol}
      />

      <div className="mt-2 grid grid-cols-3 gap-10 rounded-t-4 rounded-b-10 bg-black p-10 pl-20">
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

      <div className={'text-secondary mt-20 mb-5'}>Confirm Trade</div>
      <div className={'-space-y-10'}>
        <div className={'rounded-12 bg-black p-16'}>
          <TokenInputField
            value={totalSourceAmount}
            token={data.source}
            disabled
          />
        </div>
        <div
          className={
            'relative z-10 mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-silver'
          }
        >
          <IconArrow className={'w-10'} />
        </div>
        <div className={'rounded-12 bg-black p-16'}>
          <TokenInputField
            value={totalTargetAmount}
            token={data.target}
            disabled
          />
        </div>
      </div>

      <div className={'mt-20 flex w-full space-x-10'}>
        <Button variant={'secondary'} fullWidth onClick={onCancel}>
          Cancel
        </Button>
        <Button fullWidth onClick={handleCTAClick} disabled={disabledCTA}>
          Confirm
        </Button>
      </div>
    </Modal>
  );
};
