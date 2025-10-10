import { PortfolioData } from 'components/strategies/portfolio/usePortfolioData';
import { buildPercentageString } from 'components/strategies/portfolio/utils';
import { FC, useMemo, useState } from 'react';
import { useStore } from 'store';
import { getFiatDisplayValue, tokenAmount } from 'utils/helpers';
import { TokenLogo } from 'components/common/imager/Imager';
import { getColorByIndex } from 'utils/colorPalettes';
import { SuspiciousToken } from 'components/common/DisplayPair';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { Paginator } from 'components/common/table/Paginator';
import { clamp } from 'utils/helpers/operators';

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

  const maxOffset = useMemo(() => {
    return clamp(0, data.length - limit, offset);
  }, [offset, limit, data.length]);

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Token</th>
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
            onRowClick={onRowClick}
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

const Rows = ({ data, onRowClick }: Omit<Props, 'isPending'>) => {
  const {
    fiatCurrency: { selectedFiatCurrency },
  } = useStore();

  return data.map((item, i) => (
    <tr
      key={item.token.address}
      className="h-64 text-white/80 text-16 hover:bg-new-primary hover:text-white cursor-pointer"
      onClick={() => onRowClick(item.token.address)}
    >
      <td className="relative">
        <div className="flex items-center gap-16">
          <div
            className="absolute left-0 h-32 w-4"
            style={{ backgroundColor: getColorByIndex(i) }}
          />
          <TokenLogo token={item.token} size={32} />
          <span className="inline-flex items-center gap-4">
            {item.token.isSuspicious && <SuspiciousToken />}
            {item.token.symbol}
          </span>
        </div>
      </td>
      <td>{buildPercentageString(item.share)}</td>
      <td>
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
      <td>{getFiatDisplayValue(item.value, selectedFiatCurrency)}</td>
    </tr>
  ));
};
