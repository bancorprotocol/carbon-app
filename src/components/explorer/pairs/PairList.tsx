import { FC } from 'react';
import { PairRow } from './types';
import { PairLogoName } from 'components/common/DisplayPair';
import { Link } from '@tanstack/react-router';
import { NewTabLink } from 'libs/routing';
import LinkIcon from 'assets/icons/link.svg?react';
import config from 'config';

interface Props {
  pairs: PairRow[];
}

export const PairList: FC<Props> = ({ pairs }) => {
  return (
    <ol className="w-full grid gap-24 place-self-auto grid-area-[list] grid-fill-330">
      {pairs.map((pair) => {
        const base = pair.base;
        const quote = pair.quote;
        return (
          <li key={pair.id} className="grid gap-16 surface p-16 rounded-2xl">
            <header className="flex gap-8">
              <PairLogoName pair={{ baseToken: base, quoteToken: quote }} />
            </header>
            <dl className="grid grid-cols-3 gap-16">
              <div className="col-span-2 grid gap-8">
                <dt className="text-white/80 text-12">Trades</dt>
                <dd className="text-14">{pair.tradeCount}</dd>
              </div>
              <div className="grid gap-8">
                {config.ui.rewardUrl && pair.reward && (
                  <>
                    <dt className="text-white/80 text-12">Rewards</dt>
                    <dd className="text-14">
                      <NewTabLink
                        className="inline-flex items-center gap-8 text-white/60 hover:text-white"
                        to={config.ui.rewardUrl}
                      >
                        <img
                          src="/logos/merkl.webp"
                          className="h-[30px]"
                          loading="lazy"
                          alt="merkl logo"
                        />
                        <LinkIcon className="size-16" />
                      </NewTabLink>
                    </dd>
                  </>
                )}
              </div>
              <div>
                <dt className="text-white/80 text-12">24h Trades</dt>
                <dd className="text-14">{pair.tradeCount24h}</dd>
              </div>
              <div>
                <dt className="text-white/80 text-12"># of Strategies</dt>
                <dd className="text-14">{pair.strategyAmount}</dd>
              </div>
              <div>
                <dt className="text-white/80 text-12">Liquidity</dt>
                <dd className="text-14">{pair.liquidity}</dd>
              </div>
            </dl>
            <footer className="grid grid-cols-2 gap-8 sm:gap-16">
              <Link
                className="btn-primary"
                to="/trade"
                search={{ base: base.address, quote: quote.address }}
              >
                Create
              </Link>
              <Link
                className="btn-on-surface"
                to="/trade/market"
                search={{ base: base.address, quote: quote.address }}
              >
                Trade
              </Link>
            </footer>
          </li>
        );
      })}
    </ol>
  );
};
