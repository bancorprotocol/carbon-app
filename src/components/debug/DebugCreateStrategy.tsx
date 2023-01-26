import { Button } from 'components/common/button';
import {
  CreateStrategyParams,
  QueryKey,
  useCreateStrategy,
  useGetTokenBalances,
} from 'libs/queries';
import { FAUCET_TOKENS } from 'utils/tenderly';
import { config } from 'services/web3/config';
import { randomIntFromInterval, wait } from 'utils/helpers';
import { useMemo, useState } from 'react';
import BigNumber from 'bignumber.js';
import { useWeb3 } from 'libs/web3';
import { useQueryClient } from '@tanstack/react-query';
import { useApproval } from 'hooks/useApproval';
import { useModal } from 'hooks/useModal';

const TOKENS = FAUCET_TOKENS.map((tkn) => ({
  address: tkn.tokenContract,
  decimals: tkn.decimals,
  symbol: tkn.symbol,
}));

TOKENS.push({ address: config.tokens.ETH, decimals: 18, symbol: 'ETH' });

const spender = config.carbon.poolCollection;

const rounds = 40;

export const DebugCreateStrategy = () => {
  const { user } = useWeb3();
  const { openModal } = useModal();
  const queryClient = useQueryClient();
  const balanceQueries = useGetTokenBalances(TOKENS);
  const createMutation = useCreateStrategy();
  const [index, setIndex] = useState(0);

  const balancesMap = useMemo(() => {
    return new Map(balanceQueries.map((t, i) => [TOKENS[i].address, t.data]));
  }, [balanceQueries]);

  const approvalTokens = useMemo(() => {
    return TOKENS.map((tkn) => {
      const amount = balancesMap.get(tkn.address) || '0';

      return { ...tkn, spender, amount };
    });
  }, [balancesMap]);

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

    while (index < rounds) {
      for await (const tkn0 of TOKENS) {
        if (index >= rounds) {
          break;
        }

        for await (const tkn1 of TOKENS) {
          if (index >= rounds) {
            break;
          }
          if (tkn0.address === tkn1.address) {
            continue;
          }

          const balance0 = balancesMap.get(tkn0.address) || '0';
          const balance1 = balancesMap.get(tkn1.address) || '0';

          let strategy: CreateStrategyParams = {
            token0: tkn0,
            token1: tkn1,
            order0: {
              max: randomIntFromInterval(8, 10).toString(),
              min: randomIntFromInterval(4, 7).toString(),
              budget: new BigNumber(balance0).div(rounds + 1).toFixed(2),
              price: '',
            },
            order1: {
              max: randomIntFromInterval(66, 100).toString(),
              min: randomIntFromInterval(40, 50).toString(),
              budget: new BigNumber(balance1).div(rounds + 1).toFixed(2),
              price: '',
            },
          };
          try {
            await createMutation.mutate(strategy, {
              onError: (e) => console.error(e),
            });
            await wait(500);
            await queryClient.invalidateQueries({
              queryKey: QueryKey.balance(user, tkn0.address),
            });
            await queryClient.invalidateQueries({
              queryKey: QueryKey.balance(user, tkn1.address),
            });
            console.log(
              'created strategy',
              strategy.token0.address,
              strategy.token1.address
            );
          } catch (e) {
            console.error(
              'create strategy failed for ',
              'token0',
              tkn0.address,
              'token1',
              tkn1.address,
              e
            );
          } finally {
            setIndex((i) => i + 1);
          }
        }
      }
    }
  };

  return (
    <div
      className={
        'bg-secondary flex flex-col items-center space-y-20 rounded-18 p-20'
      }
    >
      <h2>Create Strategy</h2>
      {index} / {rounds}
      <Button onClick={handleClick}>RESET</Button>
    </div>
  );
};
