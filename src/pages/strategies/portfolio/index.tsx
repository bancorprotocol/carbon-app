import { Table } from 'libs/table';
import { useStrategyPortfolio } from 'components/strategies/portfolio/useStrategyPortfolio';

export const StrategiesPortfolioPage = () => {
  const { tableData, tableColumns, totalValue } = useStrategyPortfolio();

  return (
    <>
      <div>
        <div>{totalValue.toString()}</div>
        <Table columns={tableColumns} data={tableData} />
      </div>
    </>
  );
};
