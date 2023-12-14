import { Button } from 'components/common/button';
import {
  CreateStrategyParams,
  QueryKey,
  useCreateStrategyQuery,
  useGetTokenBalances,
} from 'libs/queries';
import { FAUCET_TOKENS } from 'utils/tenderly';
import { config } from 'services/web3/config';
import { wait } from 'utils/helpers';
import { useMemo, useRef, useState } from 'react';
import { SafeDecimal } from 'libs/safedecimal';
import { useWeb3 } from 'libs/web3';
import { useQueryClient } from '@tanstack/react-query';
import { useApproval } from 'hooks/useApproval';
import { useModal } from 'hooks/useModal';
import { Input, Label } from 'components/common/inputField';
import { Checkbox } from 'components/common/Checkbox/Checkbox';

const TOKENS = FAUCET_TOKENS.map((tkn) => ({
  address: tkn.tokenContract,
  decimals: tkn.decimals,
  symbol: tkn.symbol,
}));

TOKENS.push({ address: config.tokens.ETH, decimals: 18, symbol: 'ETH' });

const spender = config.carbon.carbonController;

export const DebugCreateStrategy = () => {
  const count = useRef(0);
  const { user } = useWeb3();
  const { openModal } = useModal();
  const queryClient = useQueryClient();
  const createMutation = useCreateStrategyQuery();
  const [rounds, setRounds] = useState(10);
  const [index, setIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [interval, setInterval] = useState(0);
  const [allTokens, setAllTokens] = useState(
    TOKENS.map((t) => ({ ...t, selected: false, count: -1 }))
  );
  const [buyMin, setBuyMin] = useState('0');
  const [buyMax, setBuyMax] = useState('0');
  const [sellMin, setSellMin] = useState('0');
  const [sellMax, setSellMax] = useState('0');
  const selectedTokens = useMemo(() => {
    return allTokens
      .filter((t) => t.selected && t.count > 0)
      .sort((t1, t2) => t1.count - t2.count);
  }, [allTokens]);

  const balanceQueries = useGetTokenBalances(selectedTokens);

  const perRound = 1;

  const selectToken = (token: string) => {
    setAllTokens((prev) => {
      const res = prev.map((t) => {
        if (t.address === token) {
          count.current++;
          return { ...t, selected: !t.selected, count: count.current };
        }
        return t;
      });
      const numberSelected = res.filter((t) => t.selected).length;
      if (numberSelected > 2) {
        return prev;
      }
      return res;
    });
  };

  const balancesMap = useMemo(() => {
    return new Map(
      balanceQueries.map((t, i) => [selectedTokens[i].address, t.data])
    );
  }, [balanceQueries, selectedTokens]);

  const approvalTokens = useMemo(() => {
    return selectedTokens.map((tkn) => {
      const amount = balancesMap.get(tkn.address) || '0';

      return { ...tkn, spender, amount };
    });
  }, [balancesMap, selectedTokens]);

  const total = useMemo(() => rounds * perRound, [perRound, rounds]);

  const approval = useApproval(approvalTokens);

  const handleClick = async () => {
    if (approval.approvalRequired) {
      openModal('txConfirm', { approvalTokens, onConfirm: create });
    } else {
      create();
    }
  };

  const create = async () => {
    if (!user) {
      console.error('user is undefined');
      return;
    }
    setIsRunning(true);

    for await (const _ of Array.from({ length: rounds })) {
      const tkn0 = selectedTokens[0];
      const tkn1 = selectedTokens[1];

      const balance0 = balancesMap.get(tkn0.address) || '0';
      const balance1 = balancesMap.get(tkn1.address) || '0';

      let strategy: CreateStrategyParams = {
        base: tkn0,
        quote: tkn1,
        order0: {
          max: buyMax,
          min: buyMin,
          marginalPrice: buyMin,
          budget: new SafeDecimal(balance1).div(total + 1).toFixed(2),
          price: buyMax === buyMin ? buyMax : '0',
        },
        order1: {
          max: sellMax,
          min: sellMin,
          marginalPrice: sellMax,
          budget: new SafeDecimal(balance0).div(total + 1).toFixed(2),
          price: sellMax === sellMin ? sellMax : '0',
        },
      };
      try {
        await createMutation.mutate(strategy, {
          onError: (e) => console.error(e),
        });
        await wait(interval * 1000);
        await queryClient.invalidateQueries({
          queryKey: QueryKey.balance(user, tkn0.address),
        });
        await queryClient.invalidateQueries({
          queryKey: QueryKey.balance(user, tkn1.address),
        });
        console.log(
          'created strategy',
          strategy.base.address,
          strategy.quote.address
        );
      } catch (e) {
        console.error(
          'create strategy failed for ',
          'base',
          tkn0.address,
          'quote',
          tkn1.address,
          e
        );
      } finally {
        setIndex((i) => i + 1);
      }
    }
    setIsRunning(false);
  };

  return (
    <div
      className={
        'bg-secondary flex flex-col items-center space-y-20 rounded-18 p-20'
      }
    >
      <h2>Create Strategy</h2>
      <div className={'space-y-10'}>
        Tokens:
        {allTokens.map((t) => (
          <div
            key={t.address}
            className={'flex items-center space-x-10 rounded-18 bg-black p-5'}
          >
            <Checkbox
              isChecked={t.selected}
              setIsChecked={() => selectToken(t.address)}
            />
            <div>{t.symbol}</div>
          </div>
        ))}
      </div>
      <div className="flex w-full justify-between">
        <div>{`Base: ${
          selectedTokens?.[0]?.symbol
            ? selectedTokens?.[0]?.symbol
            : 'not selected'
        }`}</div>
        <div>{`Quote: ${
          selectedTokens?.[1]?.symbol
            ? selectedTokens?.[1]?.symbol
            : 'not selected'
        }`}</div>
      </div>
      <Label label={'Buy Min'}>
        <Input
          type={'text'}
          value={buyMin}
          fullWidth
          onChange={(e) => setBuyMin(e.target.value)}
        />
      </Label>
      <Label label={'Buy Max'}>
        <Input
          type={'text'}
          value={buyMax}
          fullWidth
          onChange={(e) => setBuyMax(e.target.value)}
        />
      </Label>
      <Label label={'Sell Min'}>
        <Input
          type={'text'}
          value={sellMin}
          fullWidth
          onChange={(e) => setSellMin(e.target.value)}
        />
      </Label>
      <Label label={'Sell Max'}>
        <Input
          type={'text'}
          value={sellMax}
          fullWidth
          onChange={(e) => setSellMax(e.target.value)}
        />
      </Label>
      <Label label={'How many strategies?'}>
        <Input
          type={'number'}
          value={rounds}
          fullWidth
          onChange={(e) => setRounds(Number(e.target.value))}
        />
      </Label>
      <Label label={'Pause in seconds between creation'}>
        <Input
          type={'number'}
          value={interval}
          fullWidth
          onChange={(e) => setInterval(Number(e.target.value))}
        />
      </Label>
      <div>Strategies total: {total}</div>
      {isRunning ? (
        <div>
          Strategies created: {index} / {total}
        </div>
      ) : (
        <Button onClick={handleClick}>START</Button>
      )}
    </div>
  );
};
