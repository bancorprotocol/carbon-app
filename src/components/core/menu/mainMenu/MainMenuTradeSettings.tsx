import IconCog from 'assets/icons/cog.svg?react';
import IconClose from 'assets/icons/X.svg?react';
import { useStore } from 'store';
import { FormEvent, useCallback, useId, useState } from 'react';
import { TradeSettingsData } from 'components/trade/settings/utils';
import { TradeSettingsRow } from 'components/trade/settings/TradeSettingsRow';
import { useDialog, useOnDialogClose } from 'hooks/useDialog';

const toSlippagePreset = (values: string[]) => {
  return values.map((value) => ({ label: `${value}%`, value }));
};
const toDeadlinePreset = (values: string[]) => {
  return values.map((value) => ({ label: value, value }));
};

export const MainMenuTradeSettings = () => {
  const dialogId = useId();
  const { ref, open, close, lightDismiss } = useDialog();
  const { trade } = useStore();
  const { slippage, setSlippage, deadline, setDeadline, presets } =
    trade.settings;
  const [internalSlippage, setInternalSlippage] = useState(slippage);
  const [internalDeadline, setInternalDeadline] = useState(deadline);

  const defaultSlippage = presets.slippage[0];
  const defaultDeadline = presets.deadline[1];

  const initSettings = useCallback(() => {
    setTimeout(() => {
      setInternalSlippage(slippage);
      setInternalDeadline(deadline);
    }, 500); // Wait for animation to stop
  }, [deadline, slippage]);

  useOnDialogClose(ref, initSettings);

  const resetAll = (e: FormEvent) => {
    e.preventDefault();
    setInternalSlippage(defaultSlippage);
    setInternalDeadline(defaultDeadline);
  };

  const submit = (e: FormEvent) => {
    // On old browser: prevent closing without animation
    e.preventDefault();
    setSlippage(settingsData[0].value);
    setDeadline(settingsData[1].value);
    close();
  };

  const isAllSettingsDefault =
    internalSlippage === defaultSlippage &&
    internalDeadline === defaultDeadline;

  const settingsData: TradeSettingsData[] = [
    {
      id: 'slippageTolerance',
      title: 'Slippage Tolerance',
      value: internalSlippage,
      append: '%',
      setValue: setInternalSlippage,
      presets: toSlippagePreset(presets.slippage),
      max: 50,
    },
    {
      id: 'transactionExpiration',
      title: 'Transaction Expiration Time (min)',
      value: internalDeadline,
      append: '',
      setValue: setInternalDeadline,
      presets: toDeadlinePreset(presets.deadline),
    },
  ];

  return (
    <>
      <button
        type="button"
        className="btn-on-surface border border-transparent flex gap-8 items-center px-8 py-4 rounded-full"
        aria-label="Trade settings"
        aria-haspopup="dialog"
        aria-controls={dialogId}
        onClick={() => open({ autofocus: false })}
      >
        <span className="text-14">{slippage}%</span>
        <IconCog className="size-18" />
      </button>
      <dialog
        ref={ref}
        id={dialogId}
        className="modal center"
        onClick={lightDismiss}
      >
        <form
          method="dialog"
          className="form grid gap-40 md:min-w-[440px]"
          onSubmit={submit}
          onReset={resetAll}
        >
          <header className="flex items-center gap-16">
            <h2 className="mr-auto text-18">Trade Settings</h2>
            {!isAllSettingsDefault && (
              <button
                type="reset"
                className="text-14 text-white p-8 rounded-md"
              >
                Reset All
              </button>
            )}
            <button
              aria-label="Dismiss"
              type="button"
              className="p-8 rounded-full"
              onClick={close}
            >
              <IconClose className="size-18" />
            </button>
          </header>
          {settingsData.map((item) => (
            <TradeSettingsRow key={item.id} item={item} />
          ))}
          <button className="btn-primary-gradient" type="submit">
            Save Changes
          </button>
        </form>
      </dialog>
    </>
  );
};
