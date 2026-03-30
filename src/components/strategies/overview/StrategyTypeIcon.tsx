import AllInclusiveIcon from 'assets/icons/all_inclusive.svg?react';
import HourglassIcon from 'assets/icons/hourglass.svg?react';
import { cn } from 'utils/helpers';

interface Props {
  className?: string;
  isGradient?: boolean;
}

export const StrategyTypeIcon = ({ isGradient, className }: Props) => {
  if (isGradient) return <HourglassIcon className={cn('size-24', className)} />;
  return <AllInclusiveIcon className={cn('size-24', className)} />;
};
