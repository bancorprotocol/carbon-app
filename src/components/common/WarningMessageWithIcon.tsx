import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { FC, ReactNode } from 'react';
import { Tooltip } from './tooltip/Tooltip';
import { cn } from 'utils/helpers';

type Props = {
  htmlFor?: string;
  message?: string;
  className?: string;
  isError?: boolean;
  children?: ReactNode;
  'data-testid'?: string;
};

export const Warning: FC<Props> = (props) => {
  const { htmlFor, message, className, isError, children } = props;
  return (
    <output
      htmlFor={htmlFor}
      role="alert"
      aria-live="polite"
      className={cn(
        'animate-scaleUp text-12 flex items-center gap-10',
        isError ? 'error-message text-error' : 'warning-message text-warning',
        className,
      )}
      data-testid={props['data-testid']}
    >
      <IconWarning className="size-12" />
      <span className="flex-1">{children ?? message}</span>
    </output>
  );
};

export const WarningTooltip: FC<Props> = (props) => {
  const { message, className, isError, children } = props;
  return (
    <Tooltip element={children || message}>
      <span>
        <IconWarning
          className={cn(
            'size-12',
            isError
              ? 'error-message text-error'
              : 'warning-message text-warning',
            className,
          )}
        />
      </span>
    </Tooltip>
  );
};
