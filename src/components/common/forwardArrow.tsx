import { FC } from 'react';
import { ReactComponent as IconArrowCut } from 'assets/icons/arrow-cut.svg';
import { ReactComponent as IconArrowFull } from 'assets/icons/arrow.svg';
import { cn } from 'utils/helpers';

export type ForwardArrowProps = {
  arrowType?: 'full' | 'cut';
  className?: string;
};

export const ForwardArrow: FC<ForwardArrowProps> = ({
  arrowType = 'cut',
  className = '',
}) => {
  const newClassName = cn('h-12 w-7', className);

  return arrowType === 'cut' ? (
    <IconArrowCut className={newClassName} />
  ) : (
    <IconArrowFull className={newClassName} />
  );
};
