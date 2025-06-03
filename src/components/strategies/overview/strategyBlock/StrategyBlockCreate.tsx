import { FC } from 'react';
import { Link } from 'libs/routing';
import { ReactComponent as IconPlus } from 'assets/icons/plus.svg';
import { cn } from 'utils/helpers';
import { buttonStyles } from 'components/common/button/buttonStyles';

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
        'bg-content rounded-10 py-50 text-24 font-weight-500 group flex flex-col items-center justify-center gap-24 md:text-[32px]',
        className,
      )}
    >
      <div
        className={cn(
          buttonStyles({ variant: 'success' }),
          'size-72 rounded-full px-0 md:size-80',
        )}
      >
        <IconPlus className="md:p-26 p-24" />
      </div>
      <h1 className="w-[200px] text-center leading-9 md:w-[250px]">{title}</h1>
    </Link>
  );
};
