import {
  buildPairNameByStrategy,
  buildPercentageString,
} from 'components/strategies/portfolio/utils';
import { Token } from 'libs/tokens';
import { useStore } from 'store';
import { getColorByIndex } from 'utils/colorPalettes';
import { PortfolioTokenData } from './usePortfolioToken';
import { FC, useState } from 'react';
import { getFiatDisplayValue, tokenAmount } from 'utils/helpers';
import { ReactComponent as IconChevronLeft } from 'assets/icons/chevron-left.svg';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { Tooltip } from 'components/common/tooltip/Tooltip';

export interface PortfolioTokenProps {
  selectedToken?: Token;
  data: PortfolioTokenData[];
  isPending: boolean;
}

export const PortfolioTokenDesktop: FC<PortfolioTokenProps> = ({
  selectedToken,
  data,
  isPending,
}) => {
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);

  const currentPage = Math.floor(offset / limit) + 1;
  const maxPage = Math.ceil(data.length / limit);
  const maxOffset = Math.max((maxPage - 1) * limit, 0);

  const firstPage = () => setOffset(0);
  const lastPage = () => setOffset(maxOffset);
  const previousPage = () => setOffset(Math.max(offset - limit, 0));
  const nextPage = () => setOffset(Math.min(offset + limit, maxOffset));

  return (
    <table className="w-full rounded-10 bg-background-900 table-fixed">
      <thead>
        <tr className="border-background-800 text-14 border-b text-white/60">
          <th className="text-start font-weight-400 py-16 pl-8 whitespace-nowrap first:pl-24 last:pr-24 last:text-end">
            ID
          </th>
          <th className="text-start font-weight-400 py-16 pl-8 whitespace-nowrap first:pl-24 last:pr-24 last:text-end">
            Pair
          </th>
          <th className="text-start font-weight-400 py-16 pl-8 whitespace-nowrap first:pl-24 last:pr-24 last:text-end">
            Share
          </th>
          <th className="text-start font-weight-400 py-16 pl-8 whitespace-nowrap first:pl-24 last:pr-24 last:text-end">
            Amount
          </th>
          <th className="text-start font-weight-400 py-16 pl-8 whitespace-nowrap first:pl-24 last:pr-24 last:text-end">
            Value
          </th>
        </tr>
      </thead>
      <tbody>
        {isPending ? (
          <Pending />
        ) : (
          <Rows
            data={data.slice(offset, offset + limit)}
            selectedToken={selectedToken}
          />
        )}
      </tbody>
      <tfoot>
        <tr className="border-background-800 text-14 border-t text-white/80">
          <td className="px-24 py-16" colSpan={2}>
            <div className="flex items-center gap-8">
              <label>Show results</label>
              <select
                className="border-background-800 bg-background-900 rounded-full border-2 px-12 py-8"
                name="limit"
                onChange={(e) => setLimit(Number(e.target.value))}
                value={limit}
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
                <option value="40">40</option>
                <option value="50">50</option>
              </select>
            </div>
          </td>
          <td className="px-24 py-16 text-end" colSpan={3}>
            <div role="group" className="flex justify-end gap-8">
              <button
                onClick={firstPage}
                disabled={!offset}
                aria-label="First page"
                className="disabled:opacity-50"
              >
                First
              </button>
              <button
                onClick={previousPage}
                disabled={!offset}
                aria-label="Previous page"
                className="p-8 disabled:opacity-50"
              >
                <IconChevronLeft className="size-12" />
              </button>
              <p
                className="border-background-800 flex gap-8 rounded-full border-2 px-12 py-8"
                aria-label="page position"
              >
                <span className="text-white">{currentPage}</span>
                <span role="separator">/</span>
                <span className="text-white">{maxPage}</span>
              </p>
              <button
                onClick={nextPage}
                disabled={currentPage === maxPage}
                aria-label="Next page"
                className="p-8 disabled:opacity-50"
              >
                <IconChevronLeft className="size-12 rotate-180" />
              </button>
              <button
                onClick={lastPage}
                disabled={currentPage === maxPage}
                aria-label="Last page"
                className="disabled:opacity-50"
              >
                Last
              </button>
            </div>
          </td>
        </tr>
      </tfoot>
    </table>
  );
};

const Pending = () => (
  <tr>
    <td colSpan={4} className="h-[320px] text-center">
      <CarbonLogoLoading className="h-[80px]" />
    </td>
  </tr>
);

const Rows = ({
  data,
  selectedToken,
}: Omit<PortfolioTokenProps, 'isPending'>) => {
  const {
    fiatCurrency: { selectedFiatCurrency },
  } = useStore();

  return data.map((item, i) => (
    <tr key={item.strategy.id} className="h-64 text-white/80 text-16 ">
      <td className="last:text-right last:pr-20">
        <div className="flex items-center gap-16">
          <div
            className="h-32 w-4"
            style={{ backgroundColor: getColorByIndex(i) }}
          />
          <p>{item.strategy.idDisplay}</p>
        </div>
      </td>
      <td className="last:text-right last:pr-20">
        {buildPairNameByStrategy(item.strategy)}
      </td>
      <td className="last:text-right last:pr-20">
        {buildPercentageString(item.share)}
      </td>
      <td className="last:text-right last:pr-20">
        {selectedToken && (
          <Tooltip
            element={tokenAmount(item.amount, selectedToken, {
              highPrecision: true,
            })}
          >
            <span>
              {tokenAmount(item.amount, selectedToken, { abbreviate: true })}
            </span>
          </Tooltip>
        )}
      </td>
      <td className="last:text-right last:pr-20">
        {getFiatDisplayValue(item.value, selectedFiatCurrency)}
      </td>
    </tr>
  ));
};
