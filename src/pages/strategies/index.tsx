import { Page } from 'components/Page';
import { StrategyBlock } from 'components/StrategyBlock';
import { StrategyBlockCreate } from 'components/StrategyBlock/create';
import { m, Variants } from 'motion';
import { useWeb3 } from 'web3';
import { useContract } from 'hooks/useContract';
import { useEffect } from 'react';

export const StrategiesPage = () => {
  const { user } = useWeb3();
  const { PoolCollection } = useContract();

  const getStrategies = async () => {
    if (!user) {
      return;
    }
    try {
      const res = await PoolCollection.read.strategiesByPool(
        '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        '0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C'
      );
      console.log(res);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    void getStrategies();
  }, [getStrategies]);

  return (
    <Page title={'Strategies'}>
      <m.div
        className={
          'grid grid-cols-1 gap-30 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3'
        }
        variants={list}
        initial={'hidden'}
        animate={'visible'}
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
          <m.div key={i} variants={items}>
            <StrategyBlock />
          </m.div>
        ))}

        <StrategyBlockCreate />
      </m.div>
    </Page>
  );
};

const list: Variants = {
  visible: {
    opacity: 1,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.1,
    },
  },
  hidden: {
    transition: {
      when: 'afterChildren',
    },
    opacity: 0,
  },
};

const items: Variants = {
  visible: {
    opacity: 1,
    scale: 1,
  },
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
};
