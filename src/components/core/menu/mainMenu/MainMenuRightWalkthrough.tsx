import { FC, useEffect } from 'react';
import { ReactComponent as IconWalkthrough } from 'assets/icons/walkthrough.svg';
import { ReactComponent as IconClose } from 'assets/icons/X.svg';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { lsService } from 'services/localeStorage';
import { useBreakpoints } from 'hooks/useBreakpoints';
import { useDialog } from 'hooks/useDialog';
import config from 'config';

export const MainMenuRightWalkthrough: FC = () => {
  const { currentBreakpoint } = useBreakpoints();
  const { ref, open, close, lightDismiss } = useDialog();
  useEffect(() => {
    if (currentBreakpoint === 'sm' || !config.ui.walkthroughId) return;
    const hasWalkthrough = lsService.getItem('hasWalkthrough');
    if (!hasWalkthrough) {
      open();
      // Need to force focus to prevent race focus on browser start
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const start = async () => {
    if (!config.ui.walkthroughId) return;
    const selector = 'script[src="https://js.storylane.io/js/v2/storylane.js"]';
    if (!document.querySelector(selector)) {
      const script = document.createElement('script');
      script.src = 'https://js.storylane.io/js/v2/storylane.js';
      document.head.appendChild(script);
      await new Promise((res) => (script.onload = res));
    }
    await close();
    (globalThis as any).Storylane.Play({
      type: 'popup',
      demo_type: 'image',
      width: 2560,
      height: 1291,
      scale: '0.95',
      demo_url: `https://app.storylane.io/demo/${config.ui.walkthroughId}?embed=popup`,
      padding_bottom: 'calc(50.46% + 25px)',
    });
    lsService.setItem('hasWalkthrough', true);
  };

  const dismiss = () => {
    close();
    lsService.setItem('hasWalkthrough', true);
  };

  if (currentBreakpoint === 'sm') return;
  if (!config.ui.walkthroughId) return;

  return (
    <>
      <Tooltip element="Start Walkthrough">
        <button
          className="btn-flat-tertiary size-40 hidden p-0 md:grid"
          onClick={start}
        >
          <IconWalkthrough className="place-self-center size-20" />
        </button>
      </Tooltip>
      <dialog ref={ref} className="modal" onClick={lightDismiss}>
        <form
          method="dialog"
          className="grid gap-24 place-items-center"
          onSubmit={start}
        >
          <header className="flex justify-end place-self-stretch">
            <button
              aria-label="close dialog"
              className="p-8 rounded-full"
              type="button"
              onClick={dismiss}
              data-testid="close-walkthrough"
            >
              <IconClose className="size-18" />
            </button>
          </header>
          <div className="grid place-items-center size-48 bg-primary/15 rounded-full">
            <IconWalkthrough className="size-28 text-primary" />
          </div>
          <h2 className="text-18">Smart Moves Start Here</h2>
          <p className="text-14 text-white/80 text-center">
            Learn how to create liquidity strategies and unlock your full
            trading potential.
          </p>
          <button
            type="submit"
            className="btn-primary-gradient text-center  rounded-full place-self-stretch outline-offset-2"
          >
            Show me how it works
          </button>
        </form>
      </dialog>
    </>
  );
};
