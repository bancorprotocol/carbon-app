import { useOrder } from './useOrder';
import { useContract } from 'hooks/useContract';

export const useCreateStrategy = () => {
  // @ts-ignore
  const { PoolCollection } = useContract();
  const source = useOrder();
  const target = useOrder();

  const create = async () => {
    try {
      const tx = await PoolCollection.write.createStrategy(
        source.token,
        target.token,
        source.liquidity,
        source.intercept,
        source.high,
        source.low,
        target.liquidity,
        target.intercept,
        target.high,
        target.low
      );
    } catch (e) {
      console.error(e);
    }
  };

  return { source, target, create };
};
