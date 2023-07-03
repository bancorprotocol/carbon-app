import { Table } from 'libs/table';
import {
  StrategyPortfolioData,
  useStrategyPortfolio,
} from 'components/strategies/portfolio/useStrategyPortfolio';

export const StrategiesPortfolioPage = () => {
  const { tableData, tableColumns, totalValue, isLoading } =
    useStrategyPortfolio();

  return (
    <>
      <div>
        {!isLoading && (
          <div>
            <div>{totalValue.toString()}</div>

            <Table<StrategyPortfolioData>
              columns={tableColumns}
              data={tableData}
              initialSorting={[{ id: 'share', desc: true }]}
            />
          </div>
        )}
      </div>
    </>
  );
};
