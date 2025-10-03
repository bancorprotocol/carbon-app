import { FC } from 'react';
import { Link } from 'libs/routing';
import { ReactComponent as IconPlus } from 'assets/icons/plus.svg';
import { cn } from 'utils/helpers';

type Props = {
  title?: string;
  className?: string;
};
export const StrategyBlockCreate: FC<Props> = ({
  title = 'Create',
  className = '',
}) => {
  return (
    <Link
      to="/trade"
      className={cn(
        'bg-white-gradient h-400 rounded-lg py-50 font-medium grid justify-items-center gap-32 md:text-[32px]',
        className,
      )}
    >
      <div className="grid place-items-center size-72 rounded-full md:size-80 bg-gradient self-end">
        <IconPlus className="text-black md:p-26 p-24" />
      </div>
      <h1 className="w-[200px] text-center md:w-[250px] text-24">{title}</h1>
    </Link>
  );
};
