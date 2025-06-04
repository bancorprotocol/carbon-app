import { Link, Pathnames, PathParams } from 'libs/routing';
import { FC, ReactNode } from 'react';
import { cn } from 'utils/helpers';
import { getColorByIndex } from 'utils/colorPalettes';

type Props = {
  children: ReactNode;
  index: number;
  href?: Pathnames;
  params?: PathParams;
  search?: <T>(currentSearch: T) => T & { token: string };
  gridColsClassName?: string;
};

const wrapperClasses = cn(
  'flex',
  'items-center',
  'bg-background-900',
  'h-[120px]',
  'rounded-10',
  'space-x-20',
);

export const PortfolioMobileCard: FC<Props> = ({
  index,
  href,
  params,
  search,
  children,
  gridColsClassName = 'grid-cols-2',
}) => {
  const content = (
    <>
      <div
        className={cn('w-4', 'h-88', 'rounded-r-2')}
        style={{ backgroundColor: getColorByIndex(index) }}
      />

      <div className={cn('grid', 'gap-10', 'w-full', gridColsClassName)}>
        {children}
      </div>
    </>
  );

  if (href) {
    return (
      <Link
        to={href}
        // TODO: fix this
        params={params ?? {}}
        search={search ?? {}}
        resetScroll={false}
        className={wrapperClasses}
      >
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
      <div className="text-12 text-white/60">{title}</div>
      <div>{value}</div>
    </div>
  );
};

export const PortfolioMobileCardLoading: FC = () => {
  return <div className={cn(wrapperClasses, 'animate-pulse')} />;
};
