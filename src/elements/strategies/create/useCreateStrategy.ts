import { useOrder } from './useOrder';
import { useContract } from 'hooks/useContract';

const ONE = 2 ** 32;

const calcScale = (x: number) => ONE * Math.floor(x);

const calcSqrt = (x: string) => Math.sqrt(parseFloat(x));

const calcA = (low: string, high: string) =>
  calcScale(calcSqrt(high) - calcSqrt(low));

const calcB = (low: string) => calcScale(calcSqrt(low));

export const useCreateStrategy = () => {
  const { PoolCollection } = useContract();
  const source = useOrder();
  const target = useOrder();

  const create = async () => {
    try {
      const tx = await PoolCollection.write.createStrategy(
        '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        '0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C',
        source.liquidity,
        source.liquidity,
        calcA(source.low, source.high),
        calcB(source.low),
        target.liquidity,
        target.liquidity,
        calcA(target.low, target.high),
        calcB(target.low),
        { gasLimit: '99999999999999999999999' }
      );
    } catch (e) {
      console.error(e);
    }
  };

  return { source, target, create };
};
