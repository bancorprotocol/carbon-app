import { useState } from 'react';
import { Modal } from 'libs/modals/Modal';
import { ModalFC } from 'libs/modals/modals.types';
import { Action } from 'libs/sdk';
import { Token } from 'libs/tokens';
import { Button } from 'components/common/button';
import { TokenInputField } from 'components/common/TokenInputField/TokenInputField';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { MatchActionBNStr } from '@bancor/carbon-sdk/';
import { useModalTradeRouting } from 'libs/modals/modals/ModalTradeRouting/useModalTradeRouting';
import { ModalTradeRoutingRow } from 'libs/modals/modals/ModalTradeRouting/ModalTradeRoutingRow';
import { ModalTradeRoutingHeader } from 'libs/modals/modals/ModalTradeRouting/ModalTradeRoutingHeader';
import { ReactComponent as IconArrow } from 'assets/icons/arrowDown.svg';
import { useTranslation } from 'libs/translations';

export type ModalTradeRoutingData = {
  source: Token;
  target: Token;
  tradeActionsRes: Action[];
  tradeActionsWei: MatchActionBNStr[];
  isTradeBySource: boolean;
  onSuccess: Function;
  buy?: boolean;
};

export const ModalTradeRouting: ModalFC<ModalTradeRoutingData> = ({
  id,
  data,
}) => {
  const { t } = useTranslation();
  const [isAwaiting, setIsAwaiting] = useState(false);

  const {
    selected,
    onSelect,
    handleCTAClick,
    sourceFiatPrice,
    targetFiatPrice,
    totalSourceAmount,
    totalTargetAmount,
    disabledCTA,
  } = useModalTradeRouting({
    id,
    data: { ...data, setIsAwaiting },
  });

  return (
    <Modal id={id} title={t('modals.tradeRouting.modalTitle')} size={'md'}>
      <Tooltip element={t('modals.tradeRouting.tooltips.tooltip1')}>
        <div className={'text-secondary mt-20 mb-5'}>
          {t('modals.tradeRouting.section1.title1')}
        </div>
      </Tooltip>
      <ModalTradeRoutingHeader
        baseSymbol={data.source.symbol}
        quoteSymbol={data.target.symbol}
      />

      <div className="mt-2 grid max-h-[210px] grid-cols-3 gap-10 overflow-y-auto rounded-t-4 rounded-b-10 bg-black p-10 pl-20">
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
      <Tooltip element={t('modals.tradeRouting.tooltips.tooltip2')}>
        <div className={'text-secondary mt-20 mb-5'}>
          {t('modals.tradeRouting.section2.title1')}
        </div>
      </Tooltip>
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
        <Button
          variant={'white'}
          fullWidth
          onClick={handleCTAClick}
          disabled={disabledCTA}
          loading={isAwaiting}
          loadingChildren={t('common.statues.status1')}
        >
          {t('modals.tradeRouting.actionButtons.actionButton1')}
        </Button>
      </div>
    </Modal>
  );
};
