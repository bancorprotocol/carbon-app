import { Link } from '@tanstack/react-router';
import { Button } from 'components/common/button';
import { useModal } from 'hooks/useModal';
import { SimulatorInput } from 'libs/queries';
import { Token } from 'libs/tokens';
import { useState } from 'react';

const defaultParams: SimulatorInput = {
  start: '1672491600',
  end: '1701262800',
  baseToken: '',
  baseBudget: '300',
  quoteToken: '',
  quoteBudget: '100',
  sellMax: '0.619452',
  sellMin: '0.522466',
  buyMax: '0.44',
  buyMin: '0.3275',
};

export const SimInput = () => {
  const { openModal } = useModal();
  const [baseToken, setBaseToken] = useState<Token>();
  const [quoteToken, setQuoteToken] = useState<Token>();

  const [params, setParams] = useState<SimulatorInput>(defaultParams);

  return (
    <div className={'space-y-10'}>
      <div className={'flex space-x-20'}>
        <Button
          className={'w-[200px]'}
          onClick={() => {
            openModal('tokenLists', {
              onClick: (token) => {
                setBaseToken(token);
                setParams({ ...params, baseToken: token.address });
              },
            });
          }}
        >
          {baseToken ? baseToken.symbol : 'Select Base Token'}
        </Button>
        <input
          placeholder={'baseBudget'}
          className={'rounded-full px-20 py-10'}
          value={params.baseBudget}
          onChange={(e) => setParams({ ...params, baseBudget: e.target.value })}
        />
      </div>

      <div className={'flex space-x-20'}>
        <Button
          className={'w-[200px]'}
          onClick={() => {
            openModal('tokenLists', {
              onClick: (token) => {
                setQuoteToken(token);
                setParams({ ...params, quoteToken: token.address });
              },
            });
          }}
        >
          {quoteToken ? quoteToken.symbol : 'Select Quote Token'}
        </Button>
        <input
          placeholder={'quoteBudget'}
          className={'rounded-full px-20 py-10'}
          value={params.quoteBudget}
          onChange={(e) =>
            setParams({ ...params, quoteBudget: e.target.value })
          }
        />
      </div>
      <div className={'grid grid-cols-2 gap-20'}>
        <input
          placeholder={'sellMax'}
          className={'w-full rounded-full px-20 py-10'}
          value={params.sellMax}
          onChange={(e) => setParams({ ...params, sellMax: e.target.value })}
        />
        <input
          placeholder={'sellMin'}
          className={'w-full rounded-full px-20 py-10'}
          value={params.sellMin}
          onChange={(e) => setParams({ ...params, sellMin: e.target.value })}
        />
        <input
          placeholder={'buyMax'}
          className={'w-full rounded-full px-20 py-10'}
          value={params.buyMax}
          onChange={(e) => setParams({ ...params, buyMax: e.target.value })}
        />
        <input
          placeholder={'buyMin'}
          className={'w-full rounded-full px-20 py-10'}
          value={params.buyMin}
          onChange={(e) => setParams({ ...params, buyMin: e.target.value })}
        />
        <label>
          Start Date
          <input
            placeholder={'start'}
            className={'w-full rounded-full px-20 py-10'}
            value={params.start}
            onChange={(e) => setParams({ ...params, start: e.target.value })}
          />
        </label>

        <label>
          End Date
          <input
            placeholder={'end'}
            className={'w-full rounded-full px-20 py-10'}
            value={params.end}
            onChange={(e) => setParams({ ...params, end: e.target.value })}
          />
        </label>
      </div>

      <Link to={'/simulator/result'} search={params}>
        Start Simulation
      </Link>
    </div>
  );
};
