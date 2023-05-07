import { ReactNode, FC } from 'react';

type RoundedBackgroundProps = {
  value: string | ReactNode;
  className?: string;
};

export const RoundedBackground: FC<RoundedBackgroundProps> = ({
  value,
  className = '',
}) => {
  return (
    <div className={`rounded-full bg-white/10 px-6 ${className}`}>{value}</div>
  );
};
