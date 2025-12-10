import { LogoImager, TokenLogo } from 'components/common/imager/Imager';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Token } from 'libs/tokens';
import { useVirtualizer } from '@tanstack/react-virtual';
import { ModalTokenListDuplicateWarning } from 'libs/modals/modals/ModalTokenList/ModalTokenListDuplicateWarning';
import { SuspiciousToken } from 'components/common/DisplayPair';
import { lsService } from 'services/localeStorage';
import { useWagmi } from 'libs/wagmi';
import { useTokens } from 'hooks/useTokens';
import IconStar from 'assets/icons/star.svg?react';
import config from 'config';

type Props = {
  all: Map<string, Token>;
  duplicateSymbols: string[];
  select: (token: Token) => void;
  search: string;
};

const flip = (selectors: string) => {
  const previous = document.querySelectorAll<HTMLElement>(selectors);
  const positions = new Map<string, DOMRect>();
  for (const element of previous) {
    const rect = element.getBoundingClientRect();
    if (!rect.width || !rect.height) continue;
    positions.set(element.id, rect);
  }
  let frames = 0;
  const retry = () => {
    const next = document.querySelectorAll<HTMLElement>(selectors);
    if (next.length === previous.length) {
      if (++frames > 10) return;
      else return requestAnimationFrame(retry);
    }
    for (const element of next) {
      if (positions.has(element.id)) {
        const previousRect = positions.get(element.id)!;
        const nextRect = element.getBoundingClientRect();
        if (previousRect.x !== nextRect.x || previousRect.y !== nextRect.y) {
          const x = previousRect.x - nextRect.x;
          const y = previousRect.y - nextRect.y;
          element.animate(
            [{ translate: `${x}px ${y}px` }, { translate: `0 0` }],
            { duration: 200, easing: 'ease-in-out' },
          );
        }
      }
    }
  };
  requestAnimationFrame(retry);
};

const useFavorites = () => {
  const { user } = useWagmi();
  const init = useRef(false);
  const [favorites, setFavorites] = useState<string[]>(
    lsService.getItem(`favoriteTokens-${user}`) || [],
  );

  useEffect(() => {
    setFavorites(lsService.getItem(`favoriteTokens-${user}`) || []);
  }, [user]);

  useEffect(() => {
    if (init.current) {
      lsService.setItem(`favoriteTokens-${user}`, favorites);
    } else {
      init.current = true;
    }
  }, [favorites, user]);

  const toggleFavorite = useCallback((address: string) => {
    flip('.flip');
    setFavorites((prev) => {
      if (prev.includes(address)) {
        return prev.filter((a) => a !== address);
      } else {
        return [...prev, address];
      }
    });
  }, []);

  return { favorites, toggleFavorite };
};

const popular = config.popularTokens;
export const ModalTokenListContent: FC<Props> = ({
  all,
  duplicateSymbols,
  select,
  search,
}) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const { favorites, toggleFavorite } = useFavorites();

  const rest = useMemo(() => {
    return all
      .keys()
      .toArray()
      .filter((address) => {
        if (favorites.includes(address)) return false;
        if (popular.includes(address)) return false;
        return true;
      });
  }, [all, favorites]);

  const favoriteTokens = useMemo(() => {
    return favorites
      .map((address) => all.get(address))
      .filter((v) => !!v)
      .sort((a, b) => a.symbol.localeCompare(b.symbol));
  }, [all, favorites]);

  const popularTokens = useMemo(() => {
    return popular.map((address) => all.get(address)).filter((v) => !!v);
  }, [all]);

  const { getTokenById } = useTokens();

  const rowVirtualizer = useVirtualizer({
    count: rest.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60,
    overscan: 10,
  });

  useEffect(() => {
    if (parentRef.current) parentRef.current.scrollTop = 0;
  }, [search]);

  return (
    <>
      <menu className="flex items-center gap-16">
        {popularTokens.map((token) => (
          <button
            key={token.address}
            role="menuitem"
            className="token-select btn-on-surface rounded-md flex items-center gap-8 px-8 py-4 aria-selected:outline"
            onClick={() => select(token)}
          >
            <TokenLogo token={token} size={20} />
            <span className="text-14">{token.symbol}</span>
          </button>
        ))}
      </menu>
      {!!popularTokens.length && <hr className="border-main-900" />}
      <div className="grid gap-16 overflow-auto px-1" ref={parentRef}>
        <ul className="grid empty:hidden" aria-label="favorites">
          {favoriteTokens.map((token) => (
            <li
              key={token.address}
              className="flip rounded-xl flex items-center justify-between hover:bg-main-900/40"
              id={`token-${token.address}`}
            >
              <button
                onClick={() => select(token)}
                className="token-select flex flex-1 items-center gap-16 py-8 px-16 aria-selected:outline"
                data-testid={`select-token-${token.address}`}
              >
                <LogoImager
                  src={token.logoURI}
                  alt={`${token.symbol} Token`}
                  className="size-32"
                />
                <div className="grid justify-items-start">
                  <div className="flex gap-4">
                    {token.isSuspicious && <SuspiciousToken />}
                    {token.symbol}
                  </div>
                  <div className="text-12 max-w-full truncate text-white/60">
                    {token.name ?? token.symbol}
                  </div>
                  {duplicateSymbols.includes(token.symbol) && (
                    <ModalTokenListDuplicateWarning token={token} />
                  )}
                </div>
              </button>
              <FavoriteButton
                checked={favorites.includes(token.address)}
                onChange={() => toggleFavorite(token.address)}
              />
            </li>
          ))}
        </ul>
        {!!favoriteTokens.length && (
          <hr className="flip border-main-900/20" id="flip-divider" />
        )}
        <div>
          <h3 className="flip px-16 text-12 text-white/60" id="flip-title">
            All
          </h3>
          <ul
            aria-label="all tokens"
            className="relative"
            style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
          >
            {rowVirtualizer.getVirtualItems().map((row) => {
              const token = getTokenById(rest[row.index])!;
              const style = {
                height: `${row.size}px`,
                transform: `translateY(${row.start}px)`,
              } as const;
              return (
                <li
                  key={token.address}
                  className="flip rounded-xl absolute inset-0 flex items-center justify-between hover:bg-main-900/40"
                  style={style}
                  id={`token-${token.address}`}
                >
                  <button
                    onClick={() => select(token)}
                    className="token-select flex gap-16 flex-1 items-center py-8 px-16 aria-selected:outline"
                    data-testid={`select-token-${token.address}`}
                  >
                    <LogoImager
                      src={token.logoURI}
                      alt={`${token.symbol} Token`}
                      className="size-32"
                    />
                    <div className="grid justify-items-start">
                      <div className="flex gap-4">
                        {token.isSuspicious && <SuspiciousToken />}
                        {token.symbol}
                      </div>
                      <div className="text-12 max-w-full truncate text-white/60">
                        {token.name ?? token.symbol}
                      </div>
                      {duplicateSymbols.includes(token.symbol) && (
                        <ModalTokenListDuplicateWarning token={token} />
                      )}
                    </div>
                  </button>
                  <FavoriteButton
                    checked={favorites.includes(token.address)}
                    onChange={() => toggleFavorite(token.address)}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
};

interface FavoriteProps {
  checked: boolean;
  onChange: () => void;
}

const FavoriteButton = ({ checked, onChange }: FavoriteProps) => {
  const label = checked
    ? 'remove token from favorites'
    : 'mark token as favorite';
  return (
    <button
      aria-checked={checked}
      aria-label={label}
      className="group p-16"
      onClick={onChange}
    >
      <IconStar className="w-20 text-white/40 hover:fill-white/80 hover:text-white/80 group-aria-checked:text-primary group-aria-checked:fill-primary" />
    </button>
  );
};
