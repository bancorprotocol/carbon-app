import { Dispatch, FC, SetStateAction, useState } from 'react';
import { PairLogoName, TokenLogoName } from 'components/common/PairLogoName';
import { TradePair } from 'libs/modals/modals/ModalTradeTokenList';
import { useNavigate } from '@tanstack/react-router';
import { toPairSlug } from 'utils/pairSearch';
import { cn } from 'utils/helpers';
import { Token } from 'libs/tokens';
import { Button } from 'components/common/button';
import style from './index.module.css';

interface Props {
  listboxId: string;
  filteredPairs: TradePair[];
  filteredTokens: Token[];
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const SuggestionList: FC<Props> = (props) => {
  const { listboxId, filteredPairs, filteredTokens, setOpen } = props;
  const nav = useNavigate();
  const navigate = (slug: string) => {
    setOpen(false);
    const params = { type: 'token-pair' as const, slug };
    nav({ to: '/explore/$type/$slug', params });
  };

  const [maxTokens, setMaxTokens] = useState(5);
  const [maxPairs, setMaxPairs] = useState(5);

  return (
    <div
      role="listbox"
      id={listboxId}
      className={cn(style.listbox, 'grid gap-20 overflow-auto py-10')}
    >
      {!!filteredTokens.length && (
        <div id="filtered-token-list" data-tab="token">
          <h3 className="text-14 font-weight-500 px-30 text-white/60">
            Tokens
          </h3>
          {filteredTokens.slice(0, maxTokens).map((token) => (
            <button
              key={token.address}
              type="button"
              role="option"
              onMouseDown={(e) => e.preventDefault()} // prevent blur on click
              onClick={() => navigate(token.address.toLowerCase())}
              className="px-30 flex w-full cursor-pointer items-center gap-10 py-10 hover:bg-white/20 aria-selected:bg-white/10"
              aria-selected="false"
            >
              <TokenLogoName token={token} />
            </button>
          ))}
          {maxTokens <= filteredTokens.length && (
            <footer className="px-30 flex h-[50px] items-center">
              <Button
                variant="white"
                onClick={() => setMaxTokens((v) => v + 5)}
              >
                View More
              </Button>
            </footer>
          )}
        </div>
      )}
      {!!filteredPairs.length && (
        <div id="filtered-pair-list" data-tab="pair">
          <h3 className="text-14 font-weight-500 px-30 text-white/60">Pairs</h3>
          {filteredPairs.slice(0, maxTokens).map((pair) => {
            const slug = toPairSlug(pair.baseToken, pair.quoteToken);
            return (
              <button
                key={slug}
                type="button"
                role="option"
                onMouseDown={(e) => e.preventDefault()} // prevent blur on click
                onClick={() => navigate(slug)}
                className="px-30 flex w-full cursor-pointer items-center gap-10 py-10 hover:bg-white/20 aria-selected:bg-white/10"
                aria-selected="false"
                aria-setsize={filteredPairs.length}
              >
                <PairLogoName pair={pair} />
              </button>
            );
          })}
          {maxPairs <= filteredPairs.length && (
            <footer className="px-30 flex h-[50px] items-center">
              <Button variant="white" onClick={() => setMaxPairs((v) => v + 5)}>
                View More
              </Button>
            </footer>
          )}
        </div>
      )}
    </div>
  );
};
