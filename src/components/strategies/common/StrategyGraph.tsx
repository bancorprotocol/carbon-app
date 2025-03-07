import { m } from 'libs/motion';
import { items } from 'components/strategies/common/variants';
import { Button } from 'components/common/button';
import { ReactComponent as IconX } from 'assets/icons/X.svg';
import { FC, ReactNode } from 'react';

interface Props {
  setShowGraph: (value: boolean) => void;
  children: ReactNode;
}
export const StrategyGraph: FC<Props> = ({ setShowGraph, children }) => {
  return (
    <m.article
      variants={items}
      key="createStrategyGraph"
      data-testid="strategy-chart"
      className="rounded-10 bg-background-900 flex h-[550px] flex-col gap-20 p-20 md:sticky md:top-80 md:flex-1"
    >
      <header className="flex items-center justify-between">
        <h2 className="font-weight-500">Price Chart</h2>
        <Button
          className="bg-background-800 hover:border-background-600 gap-12 self-end"
          variant="secondary"
          size="md"
          data-testid="close-chart"
          onClick={() => setShowGraph(false)}
        >
          <IconX className="w-10" />
          <span className="hidden md:block">Close Chart</span>
        </Button>
      </header>
      {children}
    </m.article>
  );
};
