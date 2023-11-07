import {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
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

export type ModalTradeRoutingData = {
  source: Token;
  target: Token;
  tradeActionsRes: Action[];
  tradeActionsWei: MatchActionBNStr[];
  isTradeBySource: boolean;
  onSuccess: Function;
  sourceBalance: string;
  buy?: boolean;
};

export const ModalTradeRouting: ModalFC<ModalTradeRoutingData> = ({
  id,
  data,
}) => {
  const sourceInputId = useId();
  const table = useRef<HTMLTableElement>(null);
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
    errorMsg,
  } = useModalTradeRouting({
    id,
    data: { ...data, setIsAwaiting },
  });
  const [allChecked, setAllChecked] = useState(true);

  useEffect(() => {
    if (allChecked) {
      for (const select of selected) {
        if (!select.isSelected) onSelect(select.id);
      }
    } else {
      for (const select of selected) {
        if (select.isSelected) onSelect(select.id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allChecked]);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleCTAClick();
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const key = e.key;
    if (e.ctrlKey && e.key === 'a') {
      e.preventDefault();
      setAllChecked(!allChecked);
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
            <h3 id="routing-table" className="text-secondary">
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
                      isChecked={allChecked}
                      setIsChecked={setAllChecked}
                      aria-label="toggle all orders"
                    />
                  </th>
                  <th className="sticky top-0 bg-black py-8 font-mono text-14 font-weight-500 text-white/60">
                    {source.symbol}
                  </th>
                  <th className="sticky top-0 bg-black">{/* Arrow */}</th>
                  <th className="sticky top-0 bg-black py-8 font-mono text-14 font-weight-500 text-white/60">
                    {target.symbol}
                  </th>
                  <th className="sticky top-0 bg-black py-8 font-mono text-14 font-weight-500 text-white/60">
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
              <h3 id="confirm-table" className="text-secondary">
                Confirm Trade
              </h3>
            </Tooltip>
            {errorMsg && (
              <output
                htmlFor={sourceInputId}
                className="text-12 font-weight-500 text-red"
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
            className="-mb-16 rounded-12 bg-black"
          />
          <IconArrow className="z-10 mx-auto h-24 w-24 rounded-full bg-silver p-5" />
          <TokenInputField
            value={totalTargetAmount}
            token={data.target}
            disabled
            data-testid="confirm-target"
            className="-mt-16 rounded-12 bg-black"
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
          Confirm
        </Button>
      </form>
    </ModalOrMobileSheet>
  );
};
