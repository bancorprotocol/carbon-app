import { FC } from 'react';
import { Link, PathNames } from 'libs/routing';
import { ReactComponent as IconPlus } from 'assets/icons/plus.svg';
import { carbonEvents } from 'services/googleTagManager';

type Props = {
  title?: string;
  className?: string;
};
export const StrategyBlockCreate: FC<Props> = ({
  title = 'Create a Strategy',
  className,
}) => {
  return (
    <Link
      onClick={() => carbonEvents.strategy.newStrategyCreateClick(undefined)}
      to={PathNames.createStrategy}
      className="bg-content flex h-full items-center justify-center rounded-10 border-dashed py-50"
    >
      <div
        className={`${className} flex flex-col items-center gap-24  text-20`}
      >
        <div className="h-40 w-40 rounded-full bg-white">
          <IconPlus className="text-black" />
        </div>
        {title}
      </div>
    </Link>
  );
};
