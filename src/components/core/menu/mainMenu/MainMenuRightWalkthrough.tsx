import { FC, MouseEvent, useEffect, useRef } from 'react';
import { ReactComponent as IconWalkthrough } from 'assets/icons/walkthrough.svg';
import { ReactComponent as IconClose } from 'assets/icons/X.svg';
import { Button } from 'components/common/button';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { lsService } from 'services/localeStorage';

export const MainMenuRightWalkthrough: FC = () => {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const hasWalkthrough = lsService.getItem('hasWalkthrough');
    if (!hasWalkthrough) {
      dialog.current?.showModal();
    }
  }, []);

  const start = () => {
    dialog.current?.close();
    (globalThis as any).Storylane.Play({
      type: 'popup',
      demo_type: 'image',
      width: 2560,
      height: 1291.851851851852,
      scale: '0.95',
      demo_url: 'https://app.storylane.io/demo/i2ok96zcpzqw?embed=popup',
      padding_bottom: 'calc(50.46% + 25px)',
    });
    lsService.setItem('hasWalkthrough', true);
  };

  const dismiss = () => {
    dialog.current?.close();
    lsService.setItem('hasWalkthrough', true);
  };

  const lightDismiss = (e: MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) dismiss();
  };

  return (
    <>
      <Tooltip element="Start Walkthrough">
        <Button
          variant="secondary"
          className="size-40 hidden p-0 md:grid"
          onClick={start}
        >
          <IconWalkthrough className="place-self-center size-20" />
        </Button>
      </Tooltip>
      <dialog
        ref={dialog}
        className="modal bg-background-800 rounded w-[400px] p-24"
        onClick={lightDismiss}
      >
        <header className="flex justify-end">
          <button className="p-8 rounded-full" type="button" onClick={dismiss}>
            <IconClose className="size-18" />
          </button>
        </header>
        <div className="grid gap-24 place-items-center">
          <div className="grid place-items-center size-48 bg-primary/15 rounded-full">
            <IconWalkthrough className="size-28 text-primary" />
          </div>
          <h2 className="text-18">Do you want to start a Walkthrough ?</h2>
          <p className="text-14 text-white/80 text-center">
            Learn how to create liquidity strategies and unlock your full
            trading potential.
          </p>
          <button className="bg-white text-black text-14 text-center px-16 py-8 rounded-full place-self-stretch outline-offset-2">
            Show me how it works
          </button>
        </div>
      </dialog>
    </>
  );
};
