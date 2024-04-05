import { usePortfolioData } from 'components/strategies/portfolio/usePortfolioData';
import { useMemo } from 'react';
import { SafeDecimal } from 'libs/safedecimal';
import { Order, Strategy } from 'libs/queries';
import { sortObjectArray } from 'utils/helpers';

export interface PortfolioTokenData {
  amount: SafeDecimal;
  value: SafeDecimal;
  share: SafeDecimal;
  strategy: Strategy;
}

interface Props {
  address: string;
  strategies?: Strategy[];
  isLoading?: boolean;
}

export const usePortfolioToken = ({
  address,
  strategies,
  isLoading: _isLoading,
}: Props) => {
  const { tableData: sourceData, isLoading } = usePortfolioData({
    strategies,
    isLoading: _isLoading,
  });

  const selectedToken = useMemo(() => {
    return sourceData.find(
      ({ token }) => token.address.toLowerCase() === address.toLowerCase()
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

      const handleOrder = ({ balance }: Order) => {
        amount = new SafeDecimal(balance);
        value = new SafeDecimal(balance).times(selectedToken.fiatPrice);
        share = new SafeDecimal(value)
          .dividedBy(selectedToken.value)
          .times(100);
      };

      if (strategy.base.address.toLowerCase() === address.toLowerCase()) {
        handleOrder(strategy.order1);
      }

      if (strategy.quote.address.toLowerCase() === address.toLowerCase()) {
        handleOrder(strategy.order0);
      }

      return {
        amount,
        value,
        share,
        strategy,
      };
    });

    return sortObjectArray(unsorted, 'share', (a, b) =>
      a.share.gt(b.share) ? -1 : 1
    );
  }, [address, selectedToken]);

  return { tableData, isLoading, selectedToken };
};
