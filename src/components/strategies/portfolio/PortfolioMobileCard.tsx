import { FC, ReactNode } from 'react';
import { cn } from 'utils/helpers';
import { getColorByIndex } from 'utils/colorPalettes';
import { Link } from 'libs/routing';

type Props = {
  children: ReactNode;
  index: number;
  href?: string;
};

const wrapperClasses = cn(
  'flex',
  'items-center',
  'bg-silver',
  'h-[120px]',
  'rounded-10',
  'space-x-20'
);

export const PortfolioMobileCard: FC<Props> = ({ index, href, children }) => {
  const content = (
    <>
      <div
        className={cn('w-4', 'h-88', 'rounded-r-2')}
        // TODO refactor to use tailwind utility
        style={{ backgroundColor: getColorByIndex(index) }}
      />

      <div
        className={cn(
          'grid',
          'grid-cols-2',
          'gap-10',
          'w-full',
          'font-weight-500'
        )}
      >
        {children}
      </div>
    </>
  );

  if (href) {
    return (
      <Link to={href} className={wrapperClasses}>
        {content}
      </Link>
    );
  }

  return <div className={wrapperClasses}>{content}</div>;
};

export const CardSection: FC<{ title: string; value: string }> = ({
  title,
  value,
}) => {
  return (
    <div>
      <div className={cn('!text-12', 'text-white/60')}>{title}</div>
      <div>{value}</div>
    </div>
  );
};
