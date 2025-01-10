import { FC } from 'react';
import { CartStrategy } from 'libs/queries';
import { CartStrategyItems } from './CartStrategy';
import { cn } from 'utils/helpers';
import { lsService } from 'services/localeStorage';
import styles from 'components/strategies/overview/StrategyContent.module.css';

interface Props {
  strategies: CartStrategy[];
}

const flip = (selector: string) => {
  const elements = document.querySelectorAll<HTMLElement>(selector);
  const boxes = new Map<HTMLElement, DOMRect>();
  for (const el of elements) {
    boxes.set(el, el.getBoundingClientRect());
  }
  let attempts = 0;
  const checkChange = () => {
    if (attempts > 10) return;
    attempts++;
    const updated = document.querySelectorAll<HTMLElement>(selector);
    if (elements.length === updated.length) {
      return requestAnimationFrame(checkChange);
    }
    for (const [el, box] of boxes.entries()) {
      const newBox = el.getBoundingClientRect();
      if (box.top === newBox.top && box.left === newBox.left) continue;
      const keyframes = [
        // eslint-disable-next-line prettier/prettier
        {
          transform: `translate(${box.left - newBox.left}px, ${
            box.top - newBox.top
          }px)`,
        },
        { transform: `translate(0px, 0px)` },
      ];
      el.animate(keyframes, {
        duration: 300,
        easing: 'cubic-bezier(.85, 0, .15, 1)',
      });
    }
  };
  requestAnimationFrame(checkChange);
};

export const CartList: FC<Props> = ({ strategies }) => {
  const removeAt = (index: number) => {
    const current = lsService.getItem('cart');
    if (!current) return;
    current.splice(index, 1);
    lsService.setItem('cart', current);
    flip(`.${styles.strategyList} > li`);
  };
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
            onRemove={() => removeAt(i)}
          />
        );
      })}
    </ul>
  );
};
