import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { FC, ReactNode } from 'react';
import { cn } from 'utils/helpers';

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
      className={cn(
        '!text-12 text-warning flex items-center gap-10 font-mono',
        className
      )}
    >
      <IconWarning className="size-12" />
      <span className="flex-1">{children ?? message}</span>
    </output>
  );
};
