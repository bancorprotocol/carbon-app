import { FC } from 'react';
import { PairRow } from './types';
import { PairLogoName } from 'components/common/DisplayPair';
import { Link } from '@tanstack/react-router';
import { buttonStyles } from 'components/common/button/buttonStyles';

interface Props {
  pairs: PairRow[];
}

export const PairTable: FC<Props> = ({ pairs }) => {
  return (
    <table className="w-full border-collapse md:bg-background-900 rounded-2xl grid-area-[list]">
      <thead>
        <tr className="border-background-800 text-14 border-b text-white/60">
          <th className="text-14 text-start font-normal py-16 pl-8 whitespace-nowrap first:pl-24 last:pr-24 last:text-end">
            Token Pair
          </th>
          <th className="text-14 text-start font-normal py-16 pl-8 whitespace-nowrap first:pl-24 last:pr-24 last:text-end">
            Trades
          </th>
          <th className="text-14 text-start font-normal py-16 pl-8 whitespace-nowrap first:pl-24 last:pr-24 last:text-end">
            24h Trades
          </th>
          <th className="text-14 text-start font-normal py-16 pl-8 whitespace-nowrap first:pl-24 last:pr-24 last:text-end">
            # of Strategies
          </th>
          <th className="text-14 text-start font-normal py-16 pl-8 whitespace-nowrap first:pl-24 last:pr-24 last:text-end">
            Liquidity
          </th>
          <th className="text-14 text-start font-normal py-16 pl-8 whitespace-nowrap first:pl-24 last:pr-24 last:text-end">
            {/* Actions */}
          </th>
        </tr>
      </thead>
      <tbody>
        {pairs.map((pair) => {
          const base = pair.base;
          const quote = pair.quote;
          return (
            <tr key={pair.id}>
              <td className="py-12 pl-8 first:pl-24">
                <div className="inline-flex gap-16">
                  <PairLogoName pair={{ baseToken: base, quoteToken: quote }} />
                </div>
              </td>
              <td className="py-12 pl-8 first:pl-24 last:pr-24 last:text-end">
                {pair.tradeCount}
              </td>
              <td className="py-12 pl-8 first:pl-24 last:pr-24 last:text-end">
                {pair.tradeCount24h}
              </td>
              <td className="py-12 pl-8 first:pl-24 last:pr-24 last:text-end">
                {pair.strategyAmount}
              </td>
              <td className="py-12 pl-8 first:pl-24 last:pr-24 last:text-end">
                {pair.liquidity}
              </td>
              <td className="py-12 pl-8 first:pl-24  last:pr-24 last:text-end">
                <div className="inline-flex gap-8">
                  <Link
                    className={buttonStyles({ variant: 'success' })}
                    to="/trade"
                    search={{ base: base.address, quote: quote.address }}
                  >
                    Create Position
                  </Link>
                  <Link
                    className={buttonStyles({ variant: 'white' })}
                    to="/trade/market"
                    search={{ base: base.address, quote: quote.address }}
                  >
                    Trade
                  </Link>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
