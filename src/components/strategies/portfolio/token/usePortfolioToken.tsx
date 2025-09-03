import { usePortfolioData } from 'components/strategies/portfolio/usePortfolioData';
import { useMemo } from 'react';
import { SafeDecimal } from 'libs/safedecimal';
import { AnyStrategy, Order } from 'components/strategies/common/types';
import { sortObjectArray } from 'utils/helpers';

export interface PortfolioTokenData {
  amount: SafeDecimal;
  value: SafeDecimal;
  share: SafeDecimal;
  strategy: AnyStrategy;
}

interface Props {
  address: string;
  strategies?: AnyStrategy[];
}

export const usePortfolioToken = ({ address, strategies }: Props) => {
  const { tableData: sourceData, isPending } = usePortfolioData({
    strategies,
  });

  const selectedToken = useMemo(() => {
    return sourceData.find(
      ({ token }) => token.address.toLowerCase() === address.toLowerCase(),
    );
  }, [sourceData, address]);

  const tableData = useMemo<PortfolioTokenData[]>(() => {
    if (!selectedToken) {
      return [];
    }
    const unsorted = selectedToken.strategies.map((strategy) => {
      let amount = new SafeDecimal(0);
      let value = new SafeDecimal(0);
      let share = new SafeDecimal(0);

      const handleOrder = ({ budget }: Order) => {
        amount = new SafeDecimal(budget);
        value = new SafeDecimal(budget).times(selectedToken.fiatPrice);
        share = new SafeDecimal(value)
          .dividedBy(selectedToken.value)
          .times(100);
      };

      if (strategy.base.address.toLowerCase() === address.toLowerCase()) {
        handleOrder(strategy.sell);
      }

      if (strategy.quote.address.toLowerCase() === address.toLowerCase()) {
        handleOrder(strategy.buy);
      }

      return {
        amount,
        value,
        share,
        strategy,
      };
    });

    return sortObjectArray(unsorted, 'share', (a, b) =>
      a.share.gt(b.share) ? -1 : 1,
    );
  }, [address, selectedToken]);

  return { tableData, isPending, selectedToken };
};
