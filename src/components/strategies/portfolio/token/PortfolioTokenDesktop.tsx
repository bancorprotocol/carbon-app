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
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { Paginator } from 'components/common/table/Paginator';

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
  return (
    <table className="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Pair</th>
          <th>Share</th>
          <th>Amount</th>
          <th>Value</th>
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
      <Paginator
        size={data.length}
        offset={offset}
        setOffset={setOffset}
        limit={limit}
        setLimit={setLimit}
      />
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
    <tr key={item.strategy.id} className="h-64 text-white/80 text-16">
      <td className="relative">
        <div className="flex items-center gap-16">
          <div
            className="absolute left-0 h-32 w-4"
            style={{ backgroundColor: getColorByIndex(i) }}
          />
          <p>{item.strategy.idDisplay}</p>
        </div>
      </td>
      <td>{buildPairNameByStrategy(item.strategy)}</td>
      <td>{buildPercentageString(item.share)}</td>
      <td>
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
      <td>{getFiatDisplayValue(item.value, selectedFiatCurrency)}</td>
    </tr>
  ));
};
