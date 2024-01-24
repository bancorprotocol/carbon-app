import { Link } from '@tanstack/react-router';
import { Button } from 'components/common/button';
import { Page } from 'components/common/page';
import { useModal } from 'hooks/useModal';
import { useStrategyInput } from 'hooks/useStrategyInput';
import { D3ChartSettingsProps } from 'libs/d3';
import { D3ChartCandlestickWrapper } from 'libs/d3/charts/candlestick/D3ChartCandlestickWrapper';
import { useGetTokenPriceHistory } from 'libs/queries/extApi/tokenPrice';
import { SimulatorResultSearch } from 'libs/routing';
import { Token } from 'libs/tokens';
import { useState } from 'react';

const defaultParams: SimulatorResultSearch = {
  start: '1674554752',
  end: '1706004352',
  baseToken: '',
  baseBudget: '300',
  quoteToken: '',
  quoteBudget: '100',
  sellMax: '0.619452',
  sellMin: '0.522466',
  buyMax: '0.44',
  buyMin: '0.3275',
};

const chartSettings: D3ChartSettingsProps = {
  width: 0,
  height: 330,
  marginTop: 0,
  marginBottom: 40,
  marginLeft: 50,
  marginRight: 0,
};

export const SimulatorPage = () => {
  const { openModal } = useModal();
  const [baseToken, setBaseToken] = useState<Token>();
  const [quoteToken, setQuoteToken] = useState<Token>();

  const [state, dispatch] = useStrategyInput();

  const [params, setParams] = useState(defaultParams);
  const priceHistoryQuery = useGetTokenPriceHistory({
    baseToken: state.baseToken,
    quoteToken: state.quoteToken,
    start: Number(params.start),
    end: Number(params.end),
  });

  return (
    <Page title="Simulator Input">
      <pre>{JSON.stringify(state, null, 2)}</pre>
      <div className={'space-y-10'}>
        {priceHistoryQuery.isLoading && <div>Loading...</div>}
        {priceHistoryQuery.isError && <div>Error</div>}
        {priceHistoryQuery.data && (
          <D3ChartCandlestickWrapper
            data={priceHistoryQuery.data}
            settings={chartSettings}
            dispatch={dispatch}
            state={state}
          />
        )}
        <div className={'flex space-x-20'}>
          <Button
            className={'w-[200px]'}
            onClick={() => {
              openModal('tokenLists', {
                onClick: (token) => {
                  setBaseToken(token);
                  dispatch('baseToken', token.address);
                },
              });
            }}
          >
            {baseToken ? baseToken.symbol : 'Select Base Token'}
          </Button>
          <input
            placeholder={'baseBudget'}
            className={'rounded-full px-20 py-10'}
            value={state.baseBudget}
            onChange={(e) => dispatch('baseBudget', e.target.value)}
          />
        </div>

        <div className={'flex space-x-20'}>
          <Button
            className={'w-[200px]'}
            onClick={() => {
              openModal('tokenLists', {
                onClick: (token) => {
                  setQuoteToken(token);
                  dispatch('quoteToken', token.address);
                },
              });
            }}
          >
            {quoteToken ? quoteToken.symbol : 'Select Quote Token'}
          </Button>
          <input
            placeholder={'quoteBudget'}
            className={'rounded-full px-20 py-10'}
            value={state.quoteBudget}
            onChange={(e) => dispatch('quoteBudget', e.target.value)}
          />
        </div>
        <div className={'grid grid-cols-2 gap-20'}>
          <input
            placeholder={'sellMax'}
            className={'w-full rounded-full px-20 py-10'}
            value={state.sellMax}
            onChange={(e) => dispatch('sellMax', e.target.value)}
          />
          <input
            placeholder={'sellMin'}
            className={'w-full rounded-full px-20 py-10'}
            value={state.sellMin}
            onChange={(e) => dispatch('sellMin', e.target.value)}
          />
          <input
            type={'text'}
            placeholder={'buyMax'}
            className={'w-full rounded-full px-20 py-10'}
            value={state.buyMax}
            onChange={(e) => dispatch('buyMax', e.target.value)}
          />
          <input
            placeholder={'buyMin'}
            className={'w-full rounded-full px-20 py-10'}
            value={state.buyMin}
            onChange={(e) => dispatch('buyMin', e.target.value)}
          />
        </div>

        <Link
          to={'/simulator/result'}
          search={{ ...state, start: '', end: '' }}
        >
          Start Simulation
        </Link>
      </div>
    </Page>
  );
};
