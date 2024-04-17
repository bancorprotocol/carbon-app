import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { FC, ReactNode } from 'react';

type WarningMessageWithIconProps = {
  htmlFor?: string;
  message?: string;
  className?: string;
  isError?: boolean;
  children?: ReactNode;
};

export const WarningMessageWithIcon: FC<WarningMessageWithIconProps> = ({
  htmlFor,
  message,
  className,
  isError,
  children,
}) => {
  return (
    <output
      htmlFor={htmlFor}
      role="alert"
      aria-live="polite"
      className={`
        flex animate-scaleUp items-center gap-10 text-12
        ${isError ? 'error-message text-error' : 'warning-message text-warning'}
        ${className}
      `}
    >
      <IconWarning className="h-12 w-12" />
      <span className="flex-1">{children ?? message}</span>
    </output>
  );
};
