import { FC, memo, useEffect, useRef, useState } from 'react';
import { AnyStrategyWithFiat } from 'components/strategies/common/types';
import { StrategyBlock } from 'components/strategies/overview/strategyBlock';
import { StrategyBlockCreate } from 'components/strategies/overview/strategyBlock';
import { cn } from 'utils/helpers';
import { StrategyTable } from './StrategyTable';
import { StrategyLayout } from '../StrategySelectLayout';
import { lsService } from 'services/localeStorage';
import { useBreakpoints } from 'hooks/useBreakpoints';
import { NotFound } from 'components/common/NotFound';
import styles from './StrategyContent.module.css';

interface Props {
  strategies: AnyStrategyWithFiat[];
  isExplorer?: boolean;
  layout?: StrategyLayout;
}

export const LocalStrategyContent: FC<Props> = ({
  strategies,
  isExplorer,
  layout = lsService.getItem('strategyLayout') || 'grid',
}) => {
  const { belowBreakpoint } = useBreakpoints();
  const [max, setMax] = useState(21);

  if (!strategies?.length) {
    return (
      <NotFound
        variant="info"
        title="No results found"
        text="Try changing the search term"
      />
    );
  }

  if (layout === 'table' && !belowBreakpoint('xl')) {
    return (
      <>
        <StrategyTable strategies={strategies.slice(0, max)} />
        {max < strategies.length && (
          <Paginator increase={() => setMax((v) => v + 21)} />
        )}
      </>
    );
  }

  return (
    <>
      <ul
        data-testid="strategy-list"
        className={cn('grid gap-20', styles.strategyList)}
      >
        {strategies.slice(0, max).map((s, i) => {
          const animate = i < 21;
          const style = { ['--delay' as any]: `${i * 50}ms` };
          return (
            <StrategyBlock
              key={s.id}
              className={cn(
                styles.strategyItem,
                animate ? styles.animateItem : '',
              )}
              strategy={s}
              isExplorer={isExplorer}
              style={animate ? style : undefined}
            />
          );
        })}
        {!isExplorer && <StrategyBlockCreate />}
      </ul>
      {max < strategies.length && (
        <Paginator increase={() => setMax((v) => v + 21)} />
      )}
    </>
  );
};

const Paginator = ({ increase }: { increase: () => any }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio > 0) increase();
      },
      { rootMargin: '500px' },
    );
    observer.observe(ref.current!);
    return () => observer.disconnect();
  }, [increase]);
  return <div ref={ref} className="invisible"></div>;
};

export const StrategyContent = memo(LocalStrategyContent, (prev, next) => {
  if (prev.layout !== next.layout) return false;
  return JSON.stringify(prev.strategies) === JSON.stringify(next.strategies);
});
