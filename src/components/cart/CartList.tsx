import { FC } from 'react';
import { CartStrategyItems } from './CartStrategy';
import { cn } from 'utils/helpers';
import { AnyCartStrategy } from 'components/strategies/common/types';
import styles from 'components/strategies/overview/StrategyContent.module.css';

interface Props {
  strategies: AnyCartStrategy[];
}

export const CartList: FC<Props> = ({ strategies }) => {
  return (
    <ul className={cn('grid gap-20', styles.strategyList)}>
      {strategies.map((strategy, i) => {
        const className = i < 12 ? styles.animateItem : '';
        const style = { ['--delay' as any]: `${i * 50}ms` };
        return (
          <CartStrategyItems
            key={strategy.id}
            strategy={strategy}
            style={style}
            className={className}
          />
        );
      })}
    </ul>
  );
};
