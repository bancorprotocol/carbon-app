import { FC } from 'react';
import { PairRow } from './types';
import { PairLogoName } from 'components/common/DisplayPair';
import { Link } from '@tanstack/react-router';
import { buttonStyles } from 'components/common/button/buttonStyles';

interface Props {
  pairs: PairRow[];
}

export const PairList: FC<Props> = ({ pairs }) => {
  return (
    <ol className="w-full grid gap-24 place-self-auto grid-area-[list] grid-fill-350">
      {pairs.map((pair) => {
        const base = pair.base;
        const quote = pair.quote;
        return (
          <li
            key={pair.id}
            className="grid gap-16 bg-background-800 p-16 rounded-2xl"
          >
            <header className="flex gap-8">
              <PairLogoName pair={{ baseToken: base, quoteToken: quote }} />
            </header>
            <dl className="grid grid-cols-3 gap-16">
              <div className="col-span-3 grid gap-8">
                <dt className="text-white/80 text-12">Trades</dt>
                <dd className="text-14">{pair.tradeCount}</dd>
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
            <footer className="grid grid-cols-2 gap-16">
              <Link
                className={buttonStyles({ variant: 'success' })}
                to="/trade"
                search={{ base: base.address, quote: quote.address }}
              >
                Create
              </Link>
              <Link
                className={buttonStyles({ variant: 'white' })}
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
