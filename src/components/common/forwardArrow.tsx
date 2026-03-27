import { FC } from 'react';
import ArrowForwardIosIcon from 'assets/icons/arrow_forward_ios.svg?react';
import ArrowForwardIcon from 'assets/icons/arrow_forward.svg?react';
import { cn } from 'utils/helpers';

export type ForwardArrowProps = {
  arrowType?: 'full' | 'cut';
  className?: string;
};

export const ForwardArrow: FC<ForwardArrowProps> = ({
  arrowType = 'cut',
  className = '',
}) => {
  const newClassName = cn('size-24', className);

  return arrowType === 'cut' ? (
    <ArrowForwardIosIcon className={newClassName} />
  ) : (
    <ArrowForwardIcon className={newClassName} />
  );
};
