import { useMutation, useQuery } from '@tanstack/react-query';
import { Result } from '@ethersproject/abi';
import { useContract } from 'hooks/useContract';
import { useWeb3 } from 'web3';
import { toStrategy } from 'utils/sdk';
import { Token, useTokens } from 'tokens';
import { MultiCall, useMulticall } from 'hooks/useMulticall';
import { Decimal, decodeOrder } from 'utils/sdk2';
import { shrinkToken } from 'utils/tokens';
import { fetchTokenData } from 'tokens/tokenHelperFn';
import { QueryKey } from '../queryKey';

export enum StrategyStatus {
  Active,
  NoBudget,
  OffCurve,
  Inactive,
}

export interface Order {
  balance: string;
  curveCapacity: string;
  startRate: string;
  endRate: string;
}

export interface Strategy {
  id: number;
  token0: Token;
  token1: Token;
  order0: Order;
  order1: Order;
  status: StrategyStatus;
  provider: string;
  name?: string;
}

export const useGetUserStrategies = () => {
  const { PoolCollection, Voucher, Token } = useContract();
  const { fetchMulticall } = useMulticall();
  const { user } = useWeb3();
  const { tokens, getTokenById, importToken } = useTokens();

  return useQuery<Strategy[]>(
    QueryKey.strategies(user),
    async () => {
      if (!user) {
        return [];
      }

      const balance = await Voucher.read.balanceOf(user);

      const calls: MultiCall[] = Array.from(
        Array(balance.toNumber()),
        (_, i) => ({
          contractAddress: Voucher.read.address,
          interface: Voucher.read.interface,
          methodName: 'tokenOfOwnerByIndex',
          methodParameters: [user, i],
        })
      );
      const mcResult = await fetchMulticall(calls);
      const ids = mcResult.map((id: Result) => id[0]);

      const strategiesByIds = await PoolCollection.read.strategiesByIds(ids);

      const _getTknData = async (address: string) => {
        const data = await fetchTokenData(Token, address);
        importToken(data);
        return data;
      };

      const promises = strategiesByIds.map(async (s) => {
        const token0 =
          getTokenById(s.pair[0]) || (await _getTknData(s.pair[0]));
        const token1 =
          getTokenById(s.pair[1]) || (await _getTknData(s.pair[1]));

        const order0 = decodeOrder({ ...s.orders[0] });
        const order1 = decodeOrder({ ...s.orders[1] });

        const zero = new Decimal(0);

        const offCurve =
          order0.lowestRate === zero &&
          order0.highestRate === zero &&
          order1.lowestRate === zero &&
          order1.highestRate === zero;

        const noBudget = order0.liquidity.isZero() && order1.liquidity.isZero();

        const status =
          noBudget && offCurve
            ? StrategyStatus.Inactive
            : offCurve
            ? StrategyStatus.OffCurve
            : noBudget
            ? StrategyStatus.NoBudget
            : StrategyStatus.Active;

        const strategy: Strategy = {
          id: s.id.toNumber(),
          token0,
          token1,
          order0: {
            balance: shrinkToken(order0.liquidity.toString(), token0.decimals),
            curveCapacity: shrinkToken(
              order0.currentRate.toString(),
              token0.decimals
            ),
            startRate: order0.lowestRate.toString(),
            endRate: order0.highestRate.toString(),
          },
          order1: {
            balance: shrinkToken(order1.liquidity.toString(), token1.decimals),
            curveCapacity: shrinkToken(
              order1.currentRate.toString(),
              token1.decimals
            ),
            startRate: order1.lowestRate.toString(),
            endRate: order1.highestRate.toString(),
          },
          status,
          provider: s.provider,
        };

        return strategy;
      });

      return await Promise.all(promises);
    },
    { enabled: tokens.length > 0 }
  );
};

interface CreateStrategyOrder {
  balance?: string;
  min?: string;
  max?: string;
  price?: string;
}

type TokenAddressDecimals = Pick<Token, 'address' | 'decimals'>;

export interface CreateStrategyParams {
  token0: TokenAddressDecimals;
  token1: TokenAddressDecimals;
  order0: CreateStrategyOrder;
  order1: CreateStrategyOrder;
}
export const useCreateStrategy = () => {
  const { PoolCollection } = useContract();

  return useMutation(async (strategy: CreateStrategyParams) =>
    PoolCollection.write.createStrategy(...toStrategy(strategy), {
      // TODO fix GAS limit
      gasLimit: '99999999999999999',
    })
  );
};
