import { FC } from 'react';
import { Link, PathNames } from 'routing';
import { ReactComponent as IconPlus } from 'assets/icons/plus.svg';

export const StrategyBlockCreate: FC<{
  title?: string;
  className?: string;
}> = ({ title = 'Create a Strategy', className }) => {
  return (
    <Link
      to={PathNames.createStrategy}
      className="bg-content flex h-[420px] items-center justify-center rounded-10 border-dashed"
    >
      <div className={`${className} flex flex-col items-center gap-24 text-20`}>
        <IconPlus />
        {title}
      </div>
    </Link>
  );
};
