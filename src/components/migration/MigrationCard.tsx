import { FC } from 'react';
import { MigratedPosition } from './type';
import { getUsdPrice, tokenAmount } from 'utils/helpers';
import { TokenLogo } from 'components/common/imager/Imager';
import { DexIcon } from './DexIcon';
import IconCarbon from 'assets/logos/carbon.svg?react';

interface Props {
  position: MigratedPosition;
}
export const MigrationCard: FC<Props> = ({ position }) => {
  const { dex, base, quote, fiat, sell, buy, spread } = position;
  return (
    <>
      <div className="bg-main-900/60 rounded-2xl px-16 py-8 font-title">
        <table className="w-full border-separate border-spacing-y-8 text-12">
          <thead>
            <tr className="text-main-0/60">
              <th className="text-start font-normal">Position:</th>
              <th className="text-start font-normal">+Fees:</th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-16 font-medium">
              <td>{getUsdPrice(fiat.total.budget)}</td>
              <td>{getUsdPrice(fiat.total.fee)}</td>
            </tr>
            <tr>
              <td>
                <div className="inline-flex items-center gap-4">
                  <TokenLogo token={base} size={14} />
                  {tokenAmount(sell.budget, base)}
                </div>
              </td>
              <td>
                <div className="inline-flex items-center gap-4">
                  <TokenLogo token={base} size={14} />
                  {tokenAmount(sell.fee, base)}
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div className="inline-flex items-center gap-4">
                  <TokenLogo token={quote} size={14} />
                  {tokenAmount(buy.budget, quote)}
                </div>
              </td>
              <td>
                <div className="inline-flex items-center gap-4">
                  <TokenLogo token={quote} size={14} />
                  {tokenAmount(buy.fee, quote)}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-center gap-16 bg-main-900/60 rounded-2xl px-16 py-8 font-title font-medium text-12 md:text-14">
        <div className="flex items-center gap-8 py-8">
          <DexIcon dex={dex} className="size-24" />
          <p>{dex}</p>
        </div>
        <svg
          className="flex"
          width="100"
          height="24"
          viewBox="0 0 100 24"
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
        >
          <line
            x1="5"
            x2="95"
            y1="12"
            y2="12"
            strokeDasharray="13"
            stroke="var(--color-primary)"
          />
          <path
            d="M85,4 L95,12 L85,20"
            strokeLinejoin="round"
            stroke="var(--color-primary)"
          />
        </svg>
        <div className="flex items-center gap-8 py-8">
          <IconCarbon className="size-24" />
          <p>Carbon Defi</p>
        </div>
      </div>
      <div className="bg-main-900/60 rounded-2xl px-16 py-8 font-title">
        <table className="w-full border-separate caption-bottom border-spacing-y-8">
          <tbody className="text-12">
            <tr>
              <th className="text-start text-main-0/60 font-normal">
                Min Price
              </th>
              <td>
                {tokenAmount(buy.min, quote)} per {base.symbol}
              </td>
            </tr>
            <tr>
              <th className="text-start text-main-0/60 font-normal">
                Max Price
              </th>
              <td>
                {tokenAmount(sell.max, quote)} per {base.symbol}
              </td>
            </tr>
            <tr>
              <th className="text-start text-main-0/60 font-normal">
                Fee Tier
              </th>
              <td>{spread}%</td>
            </tr>
          </tbody>
          <caption className="text-start text-10 text-main-0/40">
            *fetched from original position
          </caption>
        </table>
      </div>
    </>
  );
};
