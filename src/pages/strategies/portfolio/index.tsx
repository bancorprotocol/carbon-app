import {
  useStrategyPortfolio,
  PortfolioAllTokens,
} from 'components/strategies/portfolio';
import { Page } from 'components/common/page';

export const StrategiesPortfolioPage = () => {
  const { tableData, totalValue, isLoading } = useStrategyPortfolio();

  return (
    <Page title={'portfolio'}>
      {!isLoading && (
        <>
          <div>{totalValue.toString()}</div>
          <PortfolioAllTokens data={tableData} />
        </>
      )}
    </Page>
  );
};
