import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { FC, ReactNode } from 'react';

type WarningMessageWithIconProps = {
  htmlFor?: string;
  message?: string;
  className?: string;
  children?: ReactNode;
};

export const WarningMessageWithIcon: FC<WarningMessageWithIconProps> = ({
  htmlFor,
  message,
  className,
  children,
}) => {
  return (
    <output
      htmlFor={htmlFor}
      role="alert"
      aria-live="polite"
      className={`flex items-center gap-10 font-mono text-12 text-warning-500 ${className}`}
    >
      <IconWarning className="h-12 w-12" />
      <span className="flex-1">{children ?? message}</span>
    </output>
  );
};
