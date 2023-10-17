import { FormEvent, useState } from 'react';
import { ModalFC } from '../../modals.types';
import { Action } from 'libs/sdk';
import { Token } from 'libs/tokens';
import { Button } from 'components/common/button';
import { TokenInputField } from 'components/common/TokenInputField/TokenInputField';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { MatchActionBNStr } from '@bancor/carbon-sdk/';
import { useModalTradeRouting } from './useModalTradeRouting';
import { ModalTradeRoutingRow } from './ModalTradeRoutingRow';
import { ReactComponent as IconArrow } from 'assets/icons/arrowDown.svg';
import { ModalOrMobileSheet } from '../../ModalOrMobileSheet';

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
  const [isAwaiting, setIsAwaiting] = useState(false);
  const { source, target } = data;
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

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleCTAClick();
  };

  return (
    <ModalOrMobileSheet id={id} title="Trade Routing" size="md">
      <form className="flex flex-col gap-20" onSubmit={submit}>
        <fieldset className="flex flex-col gap-8">
          <Tooltip element="This is the list of orders your trade will use when executed.">
            <legend className="text-secondary">Routing Table</legend>
          </Tooltip>
          <table className="rounded bg-silver">
            <thead>
              <tr>
                <th>{/* checkbox */}</th>
                <th className="py-8 font-mono text-14 font-weight-500 text-white/60">
                  {source.symbol}
                </th>
                <th>{/* Arrow */}</th>
                <th className="py-8 font-mono text-14 font-weight-500 text-white/60">
                  {target.symbol}
                </th>
                <th className="py-8 font-mono text-14 font-weight-500 text-white/60">
                  Avg Price
                </th>
              </tr>
            </thead>
            <tbody>
              {selected.map((action) => (
                <ModalTradeRoutingRow
                  key={action.id}
                  action={action}
                  source={data.source}
                  target={data.target}
                  sourceFiatPrice={sourceFiatPrice.data}
                  targetFiatPrice={targetFiatPrice.data}
                  isSelected={action.isSelected}
                  handleClick={onSelect}
                />
              ))}
            </tbody>
          </table>
        </fieldset>

        <fieldset className="flex flex-col gap-8">
          <Tooltip element="When managing the list of orders, your trade amounts will change to reflect these changes.">
            <legend className="text-secondary">Confirm Trade</legend>
          </Tooltip>
          <TokenInputField
            value={totalSourceAmount}
            token={data.source}
            disabled
            className="-mb-16 rounded-12 bg-black"
          />
          <IconArrow className="z-10 mx-auto h-24 w-24 rounded-full bg-silver p-5" />
          <TokenInputField
            value={totalTargetAmount}
            token={data.target}
            disabled
            className="-mt-16 rounded-12 bg-black"
          />
        </fieldset>

        <Button
          type="submit"
          variant="white"
          fullWidth
          disabled={disabledCTA}
          loading={isAwaiting}
          loadingChildren="Waiting for Confirmation"
        >
          Confirm
        </Button>
      </form>
    </ModalOrMobileSheet>
  );
};
