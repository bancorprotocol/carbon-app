import { Page } from 'components/Page';
import { StrategyBlock } from 'components/StrategyBlock';
import { StrategyBlockCreate } from 'components/StrategyBlock/create';
import { m, Variants } from 'motion';

export const StrategiesPage = () => (
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
