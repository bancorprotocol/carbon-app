import { FC } from 'react';
import { carbonEvents } from 'services/events';
import { Link, PathNames } from 'libs/routing';
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
      to={PathNames.createStrategy}
      className={cn(
        'bg-content flex flex-col items-center justify-center gap-24 rounded-10 py-50 text-24 font-weight-500 md:text-[32px]',
        className
      )}
    >
      <div className="h-72 w-72 rounded-full bg-green/20 md:h-80 md:w-80">
        <IconPlus className="p-24 text-green md:p-26" />
      </div>
      <span className="w-[185px] text-center leading-9 md:w-[210px]">
        {title}
      </span>
    </Link>
  );
};
