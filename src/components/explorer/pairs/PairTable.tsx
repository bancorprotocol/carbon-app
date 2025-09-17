import { FC, useMemo, useState } from 'react';
import { PairRow } from './types';
import { PairLogoName } from 'components/common/DisplayPair';
import { Link } from '@tanstack/react-router';
import { buttonStyles } from 'components/common/button/buttonStyles';
import { Paginator } from 'components/common/table/Paginator';
import { NewTabLink } from 'libs/routing';
import { clamp } from 'utils/helpers/operators';
import config from 'config';

interface Props {
  pairs: PairRow[];
}

export const PairTable: FC<Props> = ({ pairs }) => {
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);

  const maxOffset = useMemo(() => {
    return clamp(0, pairs.length - limit, offset);
  }, [offset, limit, pairs.length]);

  return (
    <table className="table grid-area-[list]">
      <thead>
        <tr>
          <th>Token Pair</th>
          {config.ui.rewardUrl && <th>Rewards</th>}
          <th>Trades</th>
          <th>24h Trades</th>
          <th># of Strategies</th>
          <th>Liquidity</th>
          <th>{/* Actions */}</th>
        </tr>
      </thead>
      <tbody>
        {pairs.slice(maxOffset, maxOffset + limit).map((pair) => {
          const base = pair.base;
          const quote = pair.quote;
          return (
            <tr key={pair.id}>
              <td>
                <div className="inline-flex gap-16">
                  <PairLogoName pair={{ baseToken: base, quoteToken: quote }} />
                </div>
              </td>
              {config.ui.rewardUrl && (
                <td>
                  {pair.reward && (
                    <NewTabLink
                      className="text-gradient underline decoration-primary underline-offset-4 hover:no-underline"
                      to={config.ui.rewardUrl}
                    >
                      Yes
                    </NewTabLink>
                  )}
                </td>
              )}
              <td>{pair.tradeCount}</td>
              <td>{pair.tradeCount24h}</td>
              <td>{pair.strategyAmount}</td>
              <td>{pair.liquidity}</td>
              <td>
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
      <Paginator
        size={pairs.length}
        offset={maxOffset}
        setOffset={setOffset}
        limit={limit}
        setLimit={setLimit}
      />
    </table>
  );
};
