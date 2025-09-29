import { PortfolioData } from 'components/strategies/portfolio/usePortfolioData';
import { buildPercentageString } from 'components/strategies/portfolio/utils';
import { FC, useState } from 'react';
import { useStore } from 'store';
import { getFiatDisplayValue, tokenAmount } from 'utils/helpers';
import { TokenLogo } from 'components/common/imager/Imager';
import { getColorByIndex } from 'utils/colorPalettes';
import { SuspiciousToken } from 'components/common/DisplayPair';
import { ReactComponent as IconChevronLeft } from 'assets/icons/chevron-left.svg';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { Tooltip } from 'components/common/tooltip/Tooltip';

interface Props {
  data: PortfolioData[];
  isPending: boolean;
  onRowClick: (address: string) => void;
}

export const PortfolioAllTokensDesktop: FC<Props> = ({
  data,
  isPending,
  onRowClick,
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
    <table className="w-full rounded-10 bg-white-gradient table-fixed">
      <thead>
        <tr className="border-background-800 text-14 border-b text-white/60">
          <th className="text-start font-normal py-16 pl-8 whitespace-nowrap first:pl-24 last:pr-24 last:text-end">
            Token
          </th>
          <th className="text-start font-normal py-16 pl-8 whitespace-nowrap first:pl-24 last:pr-24 last:text-end">
            Share
          </th>
          <th className="text-start font-normal py-16 pl-8 whitespace-nowrap first:pl-24 last:pr-24 last:text-end">
            Amount
          </th>
          <th className="text-start font-normal py-16 pl-8 whitespace-nowrap first:pl-24 last:pr-24 last:text-end">
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
            onRowClick={onRowClick}
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
          <td className="px-24 py-16 text-end" colSpan={2}>
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

const Rows = ({ data, onRowClick }: Omit<Props, 'isPending'>) => {
  const {
    fiatCurrency: { selectedFiatCurrency },
  } = useStore();

  return data.map((item, i) => (
    <tr
      key={item.token.address}
      className="h-64 text-white/80 text-16 hover:bg-background-800 hover:text-white cursor-pointer"
      onClick={() => onRowClick(item.token.address)}
    >
      <td className="last:text-right last:pr-20">
        <div className="flex items-center gap-16">
          <div
            className="h-32 w-4"
            style={{ backgroundColor: getColorByIndex(i) }}
          />
          <TokenLogo token={item.token} size={32} />
          <span className="inline-flex items-center gap-4">
            {item.token.isSuspicious && <SuspiciousToken />}
            {item.token.symbol}
          </span>
        </div>
      </td>
      <td className="last:text-right last:pr-20">
        {buildPercentageString(item.share)}
      </td>
      <td className="last:text-right last:pr-20">
        <Tooltip
          element={tokenAmount(item.amount, item.token, {
            highPrecision: true,
          })}
        >
          <span>
            {tokenAmount(item.amount, item.token, { abbreviate: true })}
          </span>
        </Tooltip>
      </td>
      <td className="last:text-right last:pr-20">
        {getFiatDisplayValue(item.value, selectedFiatCurrency)}
      </td>
    </tr>
  ));
};
