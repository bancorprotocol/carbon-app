export const RoundedBackground = ({
  value,
  className = '',
}: {
  value: string;
  className?: string;
}) => {
  return (
    <div className={`rounded-full bg-white/10 px-6 ${className}`}>{value}</div>
  );
};
