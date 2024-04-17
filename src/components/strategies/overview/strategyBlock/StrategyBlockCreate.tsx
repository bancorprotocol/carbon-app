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
      to="/strategies/create"
      className={cn(
        'bg-content rounded-10 py-50 text-24 font-weight-500 flex flex-col items-center justify-center gap-24 md:text-[32px]',
        className
      )}
    >
      <div className="bg-primary/20 size-72 md:size-80 rounded-full">
        <IconPlus className="text-primary md:p-26 p-24" />
      </div>
      <span className="w-[185px] text-center leading-9 md:w-[210px]">
        {title}
      </span>
    </Link>
  );
};
