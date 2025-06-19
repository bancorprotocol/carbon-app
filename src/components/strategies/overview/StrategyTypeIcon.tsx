import { ReactComponent as InfinityIcon } from 'assets/icons/infinity.svg';
import { ReactComponent as GradientIcon } from 'assets/icons/gradient-type.svg';
import { cn } from 'utils/helpers';

interface Props {
  className?: string;
  isGradient?: boolean;
}

export const StrategyTypeIcon = ({ isGradient, className }: Props) => {
  if (isGradient) return <GradientIcon className={cn('size-16', className)} />;
  return <InfinityIcon className={cn('size-16', className)} />;
};
