import { ReactNode } from 'react';

export const RoundedBackground = ({
  value,
  className = '',
}: {
  value: string | ReactNode;
  className?: string;
}) => {
  return (
    <div className={`rounded-full bg-white/10 px-6 ${className}`}>{value}</div>
  );
};
