import { FormEvent, KeyboardEvent, useId, useRef } from 'react';
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
import { Checkbox } from 'components/common/Checkbox/Checkbox';
import { SafeDecimal } from 'libs/safedecimal';

export type ModalTradeRoutingData = {
  source: Token;
  target: Token;
  tradeActionsRes: Action[];
  tradeActionsWei: MatchActionBNStr[];
  isTradeBySource: boolean;
  onSuccess: () => any;
  sourceBalance: string;
  buy?: boolean;
};

export const ModalTradeRouting: ModalFC<ModalTradeRoutingData> = ({
  id,
  data,
}) => {
  const sourceInputId = useId();
  const table = useRef<HTMLTableElement>(null);
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
    buttonText,
    errorMsg,
    isAwaiting,
  } = useModalTradeRouting({
    id,
    data,
  });

  const selectedSorted = selected.sort((a, b) => {
    const averageAmountA = data.buy
      ? new SafeDecimal(a.sourceAmount).div(a.targetAmount)
      : new SafeDecimal(a.targetAmount).div(a.sourceAmount);
    const averageAmountB = data.buy
      ? new SafeDecimal(b.sourceAmount).div(b.targetAmount)
      : new SafeDecimal(b.targetAmount).div(b.sourceAmount);

    return averageAmountA.sub(averageAmountB).toNumber();
  });

  const allSelected = selected.every((pred) => pred.isSelected);

  const handleAllCheck = (selectAll: boolean) => {
    if (selectAll) {
      for (const select of selected) {
        if (!select.isSelected) onSelect(select.id);
      }
    } else {
      for (const select of selected) {
        if (select.isSelected) onSelect(select.id);
      }
    }
  };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleCTAClick();
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const key = e.key;
    if (e.ctrlKey && e.key === 'a') {
      e.preventDefault();
      handleAllCheck(allSelected);
    }
    if (['Home', 'End', 'ArrowDown', 'ArrowUp'].includes(e.key)) {
      e.preventDefault();
      const btns = table.current?.querySelectorAll('button');
      if (!btns) return;
      if (key === 'Home') btns.item(0)?.focus();
      else if (key === 'End') btns.item(btns.length - 1).focus();
      else {
        for (let i = 0; i < btns.length; i++) {
          if (btns.item(i) === document.activeElement) {
            const nextIndex =
              e.key === 'ArrowDown'
                ? (i + 1) % btns.length
                : (i + btns.length - 1) % btns.length;
            return btns.item(nextIndex).focus();
          }
        }
        btns.item(0).focus();
      }
    }
  };

  return (
    <ModalOrMobileSheet id={id} title="Trade Routing" size="md">
      <form className="flex max-h-[inherit] flex-col gap-20" onSubmit={submit}>
        <div
          role="group"
          aria-labelledby="routing-table"
          className="flex min-h-[130px] flex-col gap-8 overflow-auto"
        >
          <Tooltip element="This is the list of orders your trade will use when executed.">
            <h3 id="routing-table" className="text-14 text-white/60">
              Routing Table
            </h3>
          </Tooltip>
          {/* Wrap table to keep rounded visual on overflow */}
          <div className="overflow-auto rounded">
            <table
              ref={table}
              className="w-full bg-black text-left"
              onKeyDown={onKeyDown}
            >
              <thead>
                <tr>
                  <th className="sticky top-0 bg-black p-8">
                    <Checkbox
                      className="m-auto"
                      isChecked={allSelected}
                      setIsChecked={handleAllCheck}
                      aria-label="toggle all orders"
                    />
                  </th>
                  <th className="text-14 font-weight-500 sticky top-0 bg-black py-8 text-white/60">
                    {source.symbol}
                  </th>
                  <th className="sticky top-0 bg-black">{/* Arrow */}</th>
                  <th className="text-14 font-weight-500 sticky top-0 bg-black py-8 text-white/60">
                    {target.symbol}
                  </th>
                  <th className="text-14 font-weight-500 sticky top-0 bg-black py-8 text-white/60">
                    Avg Price
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectedSorted.map((action) => (
                  <ModalTradeRoutingRow
                    key={action.id}
                    action={action}
                    source={data.source}
                    target={data.target}
                    sourceFiatPrice={sourceFiatPrice.data}
                    targetFiatPrice={targetFiatPrice.data}
                    isSelected={action.isSelected}
                    handleClick={onSelect}
                    buy={data.buy}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div
          role="group"
          aria-labelledby="confirm-table"
          className="flex flex-col gap-8"
        >
          <header className="flex items-center justify-between">
            <Tooltip element="When managing the list of orders, your trade amounts will change to reflect these changes.">
              <h3 id="confirm-table" className="text-14 text-white/60">
                Confirm Trade
              </h3>
            </Tooltip>
            {errorMsg && (
              <output
                htmlFor={sourceInputId}
                className="text-12 font-weight-500 text-error"
              >
                {errorMsg}
              </output>
            )}
          </header>
          <TokenInputField
            id={sourceInputId}
            value={totalSourceAmount}
            token={data.source}
            isError={!!errorMsg}
            disabled
            data-testid="confirm-source"
            className="rounded-12 -mb-16 bg-black"
          />
          <IconArrow className="bg-background-900 z-10 mx-auto size-24 rounded-full p-5" />
          <TokenInputField
            value={totalTargetAmount}
            token={data.target}
            disabled
            data-testid="confirm-target"
            className="rounded-12 -mt-16 bg-black"
          />
        </div>

        <Button
          type="submit"
          variant="white"
          fullWidth
          disabled={disabledCTA}
          loading={isAwaiting}
          loadingChildren="Waiting for Confirmation"
          className="shrink-0"
        >
          {buttonText}
        </Button>
      </form>
    </ModalOrMobileSheet>
  );
};
