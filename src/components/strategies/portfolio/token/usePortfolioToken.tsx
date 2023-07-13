import { usePortfolio } from 'components/strategies/portfolio/usePortfolio';
import { useMemo } from 'react';
import BigNumber from 'bignumber.js';
import { Order, Strategy } from 'libs/queries';
import { sortObjectArray } from 'utils/helpers';

export interface PortfolioTokenData {
  amount: BigNumber;
  value: BigNumber;
  share: BigNumber;
  strategy: Strategy;
}

export const usePortfolioToken = ({ address }: { address: string }) => {
  const { tableData: sourceData, isLoading } = usePortfolio();

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
      let amount = new BigNumber(0);
      let value = new BigNumber(0);
      let share = new BigNumber(0);

      const handleOrder = ({ balance }: Order) => {
        amount = new BigNumber(balance);
        value = new BigNumber(balance).times(selectedToken.fiatPrice);
        share = new BigNumber(value).dividedBy(selectedToken.value).times(100);
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
