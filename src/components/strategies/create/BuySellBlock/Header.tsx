import { FC, ReactNode } from 'react';
import { OrderCreate } from '../useOrder';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { Token } from 'libs/tokens';
import { useNavigate } from 'libs/routing';
import { StrategyCreateSearch } from '../types';
import { toStrategyType } from '../useCreateStrategy';

interface Props {
  children: ReactNode;
  order: OrderCreate;
  base: Token;
  buy?: boolean;
}

const updateSettings = (
  search: StrategyCreateSearch,
  buy: boolean,
  to: 'limit' | 'range'
) => {
  const strategyType = toStrategyType(search.strategySettings);
  if (strategyType === 'disposable') return to;
  const settings = search.strategySettings?.split('_') as [string, string];
  const index = buy ? 0 : 1;
  settings[index] = to;
  return settings.join('_');
};

export const BuySellHeader: FC<Props> = (props) => {
  const navigate = useNavigate();
  const { order, buy, children, base } = props;
  const { isRange, resetFields } = order;
  const handleRangeChange = () => {
    navigate({
      search: (search) => {
        const to = isRange ? 'limit' : 'range';
        const strategySettings = updateSettings(search, !!buy, to);
        return { ...search, strategySettings };
      },
      replace: true,
      resetScroll: false,
    });
    resetFields(true);
  };
  return (
    <header className="flex items-center justify-between">
      {children}
      <div className="flex items-center gap-10 text-14">
        <div className="bg-body flex items-center rounded-[100px] p-2">
          <button
            type="button"
            tabIndex={!isRange ? -1 : 0}
            onClick={() => handleRangeChange()}
            className={`rounded-40 font-weight-500 ${
              !isRange ? 'bg-silver' : 'text-secondary'
            } px-10 py-4`}
            data-testid="select-limit"
          >
            Limit
          </button>
          <button
            type="button"
            tabIndex={isRange ? -1 : 0}
            onClick={() => handleRangeChange()}
            className={`rounded-40 font-weight-500 ${
              isRange ? 'bg-silver' : 'text-secondary'
            } px-10 py-4`}
            data-testid="select-range"
          >
            Range
          </button>
        </div>
        <Tooltip
          sendEventOnMount={{ buy }}
          element={
            <>
              This section will define the order details in which you are
              willing to {buy ? 'buy' : 'sell'} {base.symbol} at.
              <br />
              <b>Limit</b> will allow you to define a specific price point to{' '}
              {buy ? 'buy' : 'sell'} the token at.
              <br />
              <b>Range</b> will allow you to define a range of prices to{' '}
              {buy ? 'buy' : 'sell'} the token at.
            </>
          }
        />
      </div>
    </header>
  );
};
