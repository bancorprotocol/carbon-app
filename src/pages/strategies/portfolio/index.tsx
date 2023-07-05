import {
  useStrategyPortfolio,
  PortfolioAllTokens,
} from 'components/strategies/portfolio';

export const StrategiesPortfolioPage = () => {
  const { tableData, totalValue, isLoading } = useStrategyPortfolio();

  return (
    <>
      {!isLoading && (
        <>
          <div>{totalValue.toString()}</div>
          <PortfolioAllTokens data={tableData} />
        </>
      )}
    </>
  );
};
