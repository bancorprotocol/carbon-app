import { FC, useMemo, useState } from 'react';
import { MigratedPosition } from './type';
import { DexIcon } from './DexIcon';
import { dexNames } from './utils';
import { getUsdPrice, tokenAmount } from 'utils/helpers';
import { TokenLogo } from 'components/common/imager/Imager';
import { PositionDialog } from './MigrationDialog';
import { PairLogoName } from 'components/common/DisplayPair';

interface Props {
  positions: MigratedPosition[];
}
export const MigrationTable: FC<Props> = ({ positions }) => {
  const [selectedIndex, setSelectedIndex] = useState<number>();

  const selectedPosition = useMemo(() => {
    if (typeof selectedIndex !== 'number') return;
    if (!positions) return;
    return positions[selectedIndex];
  }, [selectedIndex, positions]);

  return (
    <>
      <table className="table">
        <thead>
          <tr>
            <th>Dex</th>
            <th>Pool</th>
            <th>Position</th>
            <th>Fees</th>
            <th>Pool fee tier</th>
            <th>Price range (Min)</th>
            <th>Price range (Max)</th>
            <th></th>
          </tr>
        </thead>
        <tbody className="align-top">
          {positions.map((p, i) => {
            const dexName = dexNames[p.dex];
            return (
              <tr key={`${p.dex}-${p.id}`}>
                <td>
                  <div className="inline-flex items-center gap-8">
                    <DexIcon dex={p.dex} className="size-24" />
                    {dexName}
                  </div>
                </td>
                <td>
                  <div className="inline-flex gap-8">
                    <PairLogoName
                      pair={{ baseToken: p.base, quoteToken: p.quote }}
                      size={20}
                    />
                  </div>
                </td>
                <td>
                  <div className="inline-grid gap-8">
                    <p className="text-16">
                      {getUsdPrice(p.fiat.total.budget)}
                    </p>
                    <div className="inline-flex items-center gap-4">
                      <TokenLogo token={p.base} size={14} />
                      {tokenAmount(p.sell.budget, p.base, { abbreviate: true })}
                    </div>
                    <div className="inline-flex items-center gap-4">
                      <TokenLogo token={p.quote} size={14} />
                      {tokenAmount(p.buy.budget, p.quote, { abbreviate: true })}
                    </div>
                  </div>
                </td>
                <td>
                  <div className="inline-grid gap-8">
                    <p className="text-16">{getUsdPrice(p.fiat.total.fee)}</p>
                    <div className="inline-flex items-center gap-4">
                      <TokenLogo token={p.base} size={14} />
                      {tokenAmount(p.sell.fee, p.base, { abbreviate: true })}
                    </div>
                    <div className="inline-flex items-center gap-4">
                      <TokenLogo token={p.quote} size={14} />
                      {tokenAmount(p.buy.fee, p.quote, { abbreviate: true })}
                    </div>
                  </div>
                </td>
                <td>{p.spread}%</td>
                <td>
                  <div className="inline-grid gap-8">
                    <p>{tokenAmount(p.buy.min, p.quote)}</p>
                    <p className="text-12 text-main-0/60">
                      {p.quote.symbol} per {p.base.symbol}
                    </p>
                  </div>
                </td>
                <td>
                  <div className="inline-grid gap-8">
                    <p>{tokenAmount(p.sell.max, p.quote)}</p>
                    <p className="text-12 text-main-0/60">
                      {p.quote.symbol} per {p.base.symbol}
                    </p>
                  </div>
                </td>
                <td>
                  <button
                    className="btn-on-surface"
                    onClick={() => setSelectedIndex(i)}
                  >
                    Migrate
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {selectedPosition && (
        <PositionDialog
          position={selectedPosition}
          onClose={() => setSelectedIndex(-1)}
        />
      )}
    </>
  );
};
