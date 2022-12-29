import { useMutation, useQuery } from '@tanstack/react-query';
import { Result } from '@ethersproject/abi';
import { useContract } from 'hooks/useContract';
import { useWeb3 } from 'web3';
import { toStrategy } from 'utils/sdk';
import { Token, useTokens } from 'tokens';
import { MultiCall, useMulticall } from 'hooks/useMulticall';
import { decodeOrder } from 'utils/sdk2';
import { shrinkToken } from 'utils/tokens';
import { fetchTokenData } from 'tokens/tokenHelperFn';
import { QueryKey } from '../queryKey';
import BigNumber from 'bignumber.js';

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

        const decodedOrder0 = decodeOrder({ ...s.orders[0] });
        const decodedOrder1 = decodeOrder({ ...s.orders[1] });

        const offCurve =
          decodedOrder0.lowestRate.isZero() &&
          decodedOrder0.highestRate.isZero() &&
          decodedOrder1.lowestRate.isZero() &&
          decodedOrder1.highestRate.isZero();

        const noBudget =
          decodedOrder0.liquidity.isZero() && decodedOrder1.liquidity.isZero();

        const status =
          noBudget && offCurve
            ? StrategyStatus.Inactive
            : offCurve
            ? StrategyStatus.OffCurve
            : noBudget
            ? StrategyStatus.NoBudget
            : StrategyStatus.Active;

        // ATTENTION *****************************
        // This is the buy order | UI order 0 and CONTRACT order 1
        // ATTENTION *****************************
        const order0: Order = {
          balance: shrinkToken(
            decodedOrder1.liquidity.toString(),
            token1.decimals
          ),
          curveCapacity: shrinkToken(
            decodedOrder1.marginalRate.toString(),
            token1.decimals
          ),
          startRate: new BigNumber(decodedOrder1.lowestRate.toString())
            .div(new BigNumber(10).pow(token0.decimals - token1.decimals))
            .toString(),
          endRate: new BigNumber(decodedOrder1.highestRate.toString())
            .div(new BigNumber(10).pow(token0.decimals - token1.decimals))
            .toString(),
        };

        // ATTENTION *****************************
        // This is the sell order | UI order 1 and CONTRACT order 0
        // ATTENTION *****************************
        const order1: Order = {
          balance: shrinkToken(
            decodedOrder0.liquidity.toString(),
            token0.decimals
          ),
          curveCapacity: shrinkToken(
            decodedOrder0.marginalRate.toString(),
            token0.decimals
          ),
          startRate: new BigNumber(1)
            .div(decodedOrder0.highestRate.toString())
            .times(new BigNumber(10).pow(token1.decimals - token0.decimals))
            .toString(),
          endRate: new BigNumber(1)
            .div(decodedOrder0.lowestRate.toString())
            .times(new BigNumber(10).pow(token1.decimals - token0.decimals))
            .toString(),
        };

        const strategy: Strategy = {
          id: s.id.toNumber(),
          token0,
          token1,
          order0,
          order1,
          status,
        };

        return strategy;
      });

      return await Promise.all(promises);
    },
    { enabled: tokens.length > 0 }
  );
};

interface CreateStrategyOrder {
  budget?: string;
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
