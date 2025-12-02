import InfinityIcon from 'assets/icons/infinity.svg?react';
import GradientIcon from 'assets/icons/gradient-type.svg?react';
import { cn } from 'utils/helpers';

interface Props {
  className?: string;
  isGradient?: boolean;
}

export const StrategyTypeIcon = ({ isGradient, className }: Props) => {
  if (isGradient) return <GradientIcon className={cn('size-16', className)} />;
  return <InfinityIcon className={cn('size-16', className)} />;
};
