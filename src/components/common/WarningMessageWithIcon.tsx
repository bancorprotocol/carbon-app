import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { FC } from 'react';

type WarningMessageWithIconProps = {
  message: string;
  className?: string;
};

export const WarningMessageWithIcon: FC<WarningMessageWithIconProps> = ({
  message,
  className,
}) => {
  return (
    <output
      role="alert"
      aria-live="polite"
      className={`flex items-center gap-10 font-mono text-12 text-warning-500 ${className}`}
    >
      <IconWarning className="h-12 w-12" />
      <span className="flex-1">{message}</span>
    </output>
  );
};
