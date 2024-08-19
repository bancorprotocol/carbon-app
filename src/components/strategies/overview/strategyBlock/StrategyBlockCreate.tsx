import { FC } from 'react';
import { carbonEvents } from 'services/events';
import { Link } from 'libs/routing';
import { ReactComponent as IconPlus } from 'assets/icons/plus.svg';
import { cn } from 'utils/helpers';

type Props = {
  title?: string;
  className?: string;
};
export const StrategyBlockCreate: FC<Props> = ({
  title = 'Create Strategy',
  className = '',
}) => {
  return (
    <Link
      onClick={() => carbonEvents.strategy.newStrategyCreateClick(undefined)}
      to="/trade/market"
      className={cn(
        'bg-content rounded-10 py-50 text-24 font-weight-500 group flex flex-col items-center justify-center gap-24 md:text-[32px]',
        className
      )}
    >
      <div className="bg-primary/15 group-hover:bg-primary/25 size-72 rounded-full md:size-80">
        <IconPlus className="text-primary md:p-26 p-24" />
      </div>
      <h1 className="w-[200px] text-center leading-9 md:w-[250px]">{title}</h1>
    </Link>
  );
};
