import { FC, useEffect, useRef } from 'react';
import IconClose from 'assets/icons/X.svg?react';
import { lsService } from 'services/localeStorage';
import { useBreakpoints } from 'hooks/useBreakpoints';
import { useDialog } from 'hooks/useDialog';
import { Link } from '@tanstack/react-router';
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
        <svg
          className="size-20"
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          id="rewards-icon"
        >
          <path
            d="M32.9167 12.4688H7.08333C6.62333 12.4688 6.25 12.8421 6.25 13.3021V19.1354C6.25 19.5954 6.62333 19.9688 7.08333 19.9688H7.91667V31.6354C7.91667 33.9362 9.7825 35.8021 12.0833 35.8021H27.9167C30.2175 35.8021 32.0833 33.9362 32.0833 31.6354V19.9688H32.9167C33.3767 19.9688 33.75 19.5954 33.75 19.1354V13.3021C33.75 12.8413 33.3767 12.4688 32.9167 12.4688Z"
            fill="url(#reward-gradient)"
          />
          <path
            d="M23.4925 19.5781H7.08333C6.62333 19.5781 6.25 19.2048 6.25 18.7448V12.9115C6.25 12.4515 6.62333 12.0781 7.08333 12.0781H32.9167C33.3767 12.0781 33.75 12.4515 33.75 12.9115V18.7448C33.75 19.2048 33.3767 19.5781 32.9167 19.5781H27.9342"
            stroke="var(--color-main-0)"
          />
          <path
            d="M32.0807 19.5781V31.2448C32.0807 33.5456 30.2149 35.4115 27.9141 35.4115H12.0807C9.7799 35.4115 7.91406 33.5456 7.91406 31.2448V24.6048"
            stroke="var(--color-main-0)"
          />
          <path
            d="M15.8307 12.0833C13.5299 12.0833 11.6641 10.2175 11.6641 7.91667C11.6641 5.61583 13.5299 3.75 15.8307 3.75C18.1316 3.75 19.9974 5.61583 19.9974 7.91667"
            stroke="var(--color-main-0)"
          />
          <path
            d="M20 7.91667C20 5.61583 21.8658 3.75 24.1667 3.75C26.4675 3.75 28.3333 5.61583 28.3333 7.91667C28.3333 10.2175 26.4675 12.0833 24.1667 12.0833"
            stroke="var(--color-main-0)"
          />
          <path d="M20 35.4167V7.5" stroke="var(--color-main-0)" />
          <defs>
            <linearGradient
              id="reward-gradient"
              x1="27.8523"
              y1="14.4891"
              x2="9.54105"
              y2="32.9994"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#B80093" />
              <stop offset="0.123033" stopColor="#CF28AD" />
              <stop offset="0.399979" stopColor="#E35FC7" />
              <stop offset="0.730614" stopColor="#FAC2E5" />
              <stop offset="1" stopColor="#FFFBFD" stopOpacity="0.8" />
            </linearGradient>
          </defs>
        </svg>
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
              <IconClose className="size-18" />
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
