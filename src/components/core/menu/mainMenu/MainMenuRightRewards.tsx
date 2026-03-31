import { FC, useEffect, useRef } from 'react';
import CloseIcon from 'assets/icons/close.svg?react';
import { lsService } from 'services/localeStorage';
import { useBreakpoints } from 'hooks/useBreakpoints';
import { useDialog } from 'hooks/useDialog';
import { Link } from '@tanstack/react-router';
import { RewardIcon } from 'components/rewards/icon';
import config from 'config';

export const MainMenuRightReward: FC = () => {
  const { currentBreakpoint } = useBreakpoints();
  const { ref, open, close, lightDismiss } = useDialog();
  const haveSeen = useRef(lsService.getItem('haveSeen'));

  useEffect(() => {
    if (currentBreakpoint === 'sm' || !config.ui.rewards) return;
    if (!haveSeen.current?.includes('rewards')) {
      open();
      // Need to force focus to prevent race focus on browser start
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const markAsSeen = () => {
    const current = haveSeen.current ?? [];
    lsService.setItem('haveSeen', current.concat(['rewards']));
  };

  if (currentBreakpoint === 'sm') return;
  if (!config.ui.rewards) return;

  return (
    <>
      <Link
        to="/explore/pairs"
        search={{ filter: 'rewards' }}
        className="btn-on-background size-40 hidden p-0 md:grid place-items-center"
      >
        <RewardIcon className="size-20" />
      </Link>
      <dialog
        ref={ref}
        className="modal center"
        onClose={markAsSeen}
        onClick={lightDismiss}
      >
        <div className="grid gap-16 place-items-center">
          <header className="flex justify-end place-self-stretch">
            <button
              aria-label="close dialog"
              className="p-8 rounded-full"
              onClick={close}
              data-testid="close-reward"
            >
              <CloseIcon className="size-24" />
            </button>
          </header>
          <div className="grid place-items-center size-48 rounded-full bg-[#FF66E0]/50">
            <svg className="size-40" width="40" height="40" viewBox="0 0 40 40">
              <use href="#rewards-icon" />
            </svg>
          </div>
          <h2 className="text-18">Earn rewards with eligible pairs</h2>
          <p className="text-14 text-main-0/80 text-center">
            Create trading strategies with eligible token pairs and start
            earning rewards.
          </p>
          <Link
            to="/explore/pairs"
            search={{ filter: 'rewards' }}
            onClick={close}
            className="py-12 text-center rounded-full justify-self-stretch font-title text-main-0 bg-linear-to-t from-[#B80093] to-[#E38FE3]"
          >
            View Pairs with Rewards
          </Link>
          <button
            className="btn-on-surface justify-self-stretch"
            onClick={close}
          >
            Cancel
          </button>
        </div>
      </dialog>
    </>
  );
};
