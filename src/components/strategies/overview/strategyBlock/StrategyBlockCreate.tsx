import { FC } from 'react';
import { Link, PathNames } from 'libs/routing';
import { ReactComponent as IconPlus } from 'assets/icons/plus.svg';

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
      to={PathNames.createStrategy}
      className="bg-content flex h-full items-center justify-center rounded-10 py-50"
    >
      <div
        className={`${className} flex flex-col items-center gap-24 text-24 font-weight-500 md:text-[32px]`}
      >
        <div className="h-72 w-72 rounded-full bg-green/20 md:h-80 md:w-80">
          <IconPlus className="p-24 text-green md:p-26" />
        </div>
        <span className="w-[185px] text-center leading-9 md:w-[210px]">
          {title}
        </span>
      </div>
    </Link>
  );
};
