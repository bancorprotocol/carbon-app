import { FC, useEffect, useRef } from 'react';
import { ReactComponent as IconInfo } from 'assets/icons/tooltip.svg';
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

  const lightDismiss = { closedby: 'any' };

  return (
    <>
      <Tooltip element="Start Walkthrough">
        <Button
          variant="secondary"
          className="size-40 hidden p-0 md:grid"
          onClick={start}
        >
          <IconInfo className="place-self-center size-20" />
        </Button>
      </Tooltip>
      <dialog
        ref={dialog}
        className="bg-background-800 rounded w-[500px] h-[300px]"
        {...lightDismiss}
      >
        <div className="grid gap-16 place-items-center p-16">
          <h2>Do you want to start a Walkthrough ?</h2>
          <button
            className="bg-background-700 rounded px-16 py-8"
            onClick={start}
          >
            Yes I would love that ! Thanks you Bancor
          </button>
          <button onClick={() => dialog.current?.close()}>
            No, your app is so easy to use, but thank you anyway
          </button>
        </div>
      </dialog>
    </>
  );
};
