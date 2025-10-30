import { Dispatch, FC, SetStateAction, useState } from 'react';
import { PairLogoName, TokenLogoName } from 'components/common/DisplayPair';
import { TradePair } from 'components/strategies/common/types';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { toPairSlug } from 'utils/pairSearch';
import { cn } from 'utils/helpers';
import { Token } from 'libs/tokens';
import style from './index.module.css';
import strategyStyle from 'components/strategies/overview/StrategyContent.module.css';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';

interface Props {
  url: '/explore' | '/portfolio';
  listboxId: string;
  filteredPairs: TradePair[];
  filteredTokens: Token[];
  setOpen: Dispatch<SetStateAction<boolean>>;
  isPending: boolean;
}

const animateLeaving = async () => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const selector = `.${strategyStyle.strategyItem}`;
  const cards = document.querySelectorAll<HTMLElement>(selector);
  const animations: Animation[] = [];
  const keyframes = [{ opacity: 0, transform: 'scale(0.95)' }];
  for (let i = 0; i < cards.length; i++) {
    const { top } = cards[i].getBoundingClientRect();
    if (top > document.documentElement.clientHeight) break;
    const options = { duration: 200, fill: 'forwards', delay: i * 50 } as const;
    const anim = cards[i].animate(keyframes, options);
    animations.push(anim);
  }
  await Promise.all(animations.map((anim) => anim.finished));
  // Manually display cards that were not removed from the DOM is any
  setTimeout(() => {
    const keyframes = [{ opacity: 1, transform: 'scale(1)' }];
    for (const card of cards) {
      if (card.isConnected) {
        card.animate(keyframes, { duration: 200, fill: 'forwards' });
      }
    }
  }, 2000);
};

export const SuggestionList: FC<Props> = (props) => {
  const { listboxId, filteredPairs, filteredTokens, setOpen, isPending } =
    props;
  const nav = useNavigate({ from: props.url });
  const { search } = useSearch({ from: props.url });
  const navigate = async (nextSlug: string) => {
    setOpen(false);
    if (search === nextSlug) return;
    await animateLeaving();
    nav({
      search: (s) => ({ ...s, search: nextSlug }),
      resetScroll: false,
      replace: true,
    });
  };

  const [maxTokens, setMaxTokens] = useState(5);
  const [maxPairs, setMaxPairs] = useState(5);

  if (isPending) {
    return (
      <div role="listbox" id={listboxId} className={cn(style.listbox, 'p-24')}>
        <CarbonLogoLoading className="h-[60px]" />
      </div>
    );
  }

  return (
    <div
      role="listbox"
      id={listboxId}
      className={cn(style.listbox, 'grid gap-20 overflow-auto py-10')}
    >
      {!!filteredTokens.length && (
        <div id="filtered-token-list" data-tab="token">
          <h3 className="text-14 font-medium px-30 text-white/60">Tokens</h3>
          {filteredTokens.slice(0, maxTokens).map((token, index) => (
            <button
              key={token.address}
              type="button"
              role="option"
              onMouseDown={(e) => e.preventDefault()} // prevent blur on click
              onClick={() => navigate(token.address.toLowerCase())}
              className="px-16 md:px-30  flex w-full cursor-pointer items-center gap-10 py-10 hover:bg-white/20 focus-visible:bg-white/10 aria-selected:bg-white/10"
              aria-selected="false"
              tabIndex={index ? -1 : 0}
            >
              <TokenLogoName token={token} />
            </button>
          ))}
          {maxTokens <= filteredTokens.length && (
            <footer className="px-16 md:px-30 flex h-[50px] items-center">
              <button
                type="button"
                className="text-14 font-medium btn cursor-pointer rounded-full "
                onClick={() => setMaxTokens((v) => v + 5)}
              >
                View More
              </button>
            </footer>
          )}
        </div>
      )}
      {!!filteredPairs.length && (
        <div id="filtered-pair-list" data-tab="pair">
          <h3 className="text-14 font-medium px-30 text-white/60">Pairs</h3>
          {filteredPairs.slice(0, maxPairs).map((pair, index) => {
            const slug = toPairSlug(pair.baseToken, pair.quoteToken);
            return (
              <button
                key={slug}
                type="button"
                role="option"
                onMouseDown={(e) => e.preventDefault()} // prevent blur on click
                onClick={() => navigate(slug)}
                className="px-16 md:px-30 flex w-full cursor-pointer items-center gap-10 py-10 hover:bg-white/20 focus-visible:bg-white/10 aria-selected:bg-white/10"
                aria-selected="false"
                aria-setsize={filteredPairs.length}
                tabIndex={index ? -1 : 0}
              >
                <PairLogoName pair={pair} />
              </button>
            );
          })}
          {maxPairs <= filteredPairs.length && (
            <footer className="px-30 flex h-[50px] items-center">
              <button
                type="button"
                className="text-14 font-medium btn cursor-pointer rounded-full "
                onClick={() => setMaxPairs((v) => v + 5)}
              >
                View More
              </button>
            </footer>
          )}
        </div>
      )}
    </div>
  );
};
