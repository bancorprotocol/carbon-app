import {
  buildPairNameByStrategy,
  buildPercentageString,
} from 'components/strategies/portfolio/utils';
import { Token } from 'libs/tokens';
import { getColorByIndex } from 'utils/colorPalettes';
import { PortfolioTokenData } from './usePortfolioToken';
import { FC, useMemo, useState } from 'react';
import { getUsdPrice, tokenAmount } from 'utils/helpers';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { Paginator } from 'components/common/table/Paginator';
import { clamp } from 'utils/helpers/operators';

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

  const maxOffset = useMemo(() => {
    return clamp(0, data.length - limit, offset);
  }, [offset, limit, data.length]);

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
            data={data.slice(maxOffset, maxOffset + limit)}
            selectedToken={selectedToken}
          />
        )}
      </tbody>
      <Paginator
        size={data.length}
        offset={maxOffset}
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
  return data.map((item, i) => (
    <tr key={item.strategy.id} className="h-64 text-main-0/80 text-16">
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
      <td>{getUsdPrice(item.value)}</td>
    </tr>
  ));
};
