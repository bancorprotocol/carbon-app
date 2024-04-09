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
        text-12 flex items-center gap-10
        ${isError ? 'text-error' : 'text-warning'}
        ${className}
      `}
    >
      <IconWarning className="size-12" />
      <span className="flex-1">{children ?? message}</span>
    </output>
  );
};
