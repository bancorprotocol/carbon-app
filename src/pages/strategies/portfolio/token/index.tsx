import { useMatch } from 'libs/routing';
import { useStrategyPortfolioToken } from 'components/strategies/portfolio';
import { createColumnHelper, Table } from 'libs/table';
import { StrategyPortfolioTokenData } from 'components/strategies/portfolio/token/useStrategyPortfolioToken';
import { cn, prettifyNumber } from 'utils/helpers';

const columnHelper = createColumnHelper<StrategyPortfolioTokenData>();

const tableColumns = [
  columnHelper.accessor('strategy.idDisplay', {
    header: () => <span className={cn('ps-20')}>ID</span>,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('strategy', {
    header: 'Pair',
    cell: (info) => {
      const { base, quote } = info.getValue();
      return `${base.symbol}/${quote.symbol}`;
    },
  }),
  columnHelper.accessor('share', {
    header: 'Share',
    cell: (info) => `${info.getValue().toFixed(2)} %`,
  }),
  columnHelper.accessor('amount', {
    header: 'Amount',
    cell: (info) => `${prettifyNumber(info.getValue())} ????`,
  }),
  columnHelper.accessor('value', {
    header: 'Value',
    // TODO dont hardcode fiat currency
    cell: (info) => `$${prettifyNumber(info.getValue())} ???`,
  }),
];

export const StrategiesPortfolioTokenPage = () => {
  const {
    params: { address },
  } = useMatch();
  const { tableData, isLoading, selectedToken } = useStrategyPortfolioToken({
    address,
  });

  return (
    <div>
      PortfolioToken: {address}
      <div>
        <div>
          Total Value {selectedToken?.value.toString()}{' '}
          {selectedToken?.token.symbol || null}
        </div>
      </div>
      {/*<pre>{JSON.stringify(tableData, null, 2)}</pre>*/}
      <Table<StrategyPortfolioTokenData>
        columns={tableColumns}
        data={tableData}
        initialSorting={[{ id: 'share', desc: true }]}
      />
    </div>
  );
};
