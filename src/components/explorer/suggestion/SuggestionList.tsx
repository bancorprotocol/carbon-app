import { Dispatch, FC, memo, SetStateAction } from 'react';
import { suggestionClasses } from './utils';
import { TradePair } from 'libs/modals/modals/ModalTradeTokenList';
import { useNavigate } from '@tanstack/react-router';

interface Props {
  listboxId: string;
  filteredSlugs: Set<string>;
  pairEntries: [string, TradePair][];
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const _SuggestionList: FC<Props> = (props) => {
  const nav = useNavigate();
  const click = (params: { type: 'token-pair'; slug: string }) => {
    props.setOpen(false);
    nav({ to: '/explore/$type/$slug', params });
  };

  return (
    <div
      role="listbox"
      id={props.listboxId}
      hidden={!props.open}
      className={suggestionClasses}
    >
      <h3 className="text-14 font-weight-500 mb-8 ml-20 text-white/60">
        {props.filteredSlugs.size} Results
      </h3>
      {props.pairEntries.map(([slug, { baseToken, quoteToken }]) => {
        return (
          <button
            key={slug}
            type="button"
            role="option"
            onMouseDown={(e) => e.preventDefault()} // prevent blur on click
            onClick={() => click({ type: 'token-pair' as const, slug })}
            className="px-30 flex cursor-pointer items-center gap-10 py-10 hover:bg-white/20 aria-selected:bg-white/10 [&[hidden]]:hidden"
            aria-selected="false"
            data-slug={slug}
          >
            <span className="isolate flex shrink-0 items-center">
              <img
                width="30"
                height="30"
                loading="lazy"
                decoding="async"
                src={baseToken.logoURI}
                title={baseToken.symbol}
                alt={baseToken.symbol + 'token'}
                className="max-w-none rounded-full border border-black bg-black"
              />
              <img
                width="30"
                height="30"
                loading="lazy"
                decoding="async"
                src={quoteToken.logoURI}
                title={quoteToken.symbol}
                alt={quoteToken.symbol + 'token'}
                className="z-1 -ml-8 max-w-none rounded-full border border-black bg-black"
              />
            </span>
            <p className="font-weight-500 flex items-center gap-4">
              {baseToken.symbol}
              <span className="text-white/60">/</span>
              {quoteToken.symbol}
            </p>
          </button>
        );
      })}
    </div>
  );
};
export const SuggestionList = memo(
  _SuggestionList,
  (a, b) => a.pairEntries.length !== b.pairEntries.length
);
