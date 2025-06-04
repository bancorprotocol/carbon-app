import { FC, ReactNode } from 'react';
import { LogoImager } from 'components/common/imager/Imager';
import { ButtonHTMLProps } from 'components/common/button';
import { ReactComponent as IconChevron } from 'assets/icons/chevron.svg';
import { ReactComponent as IconPlus } from 'assets/icons/plus.svg';
import { cn } from 'utils/helpers';
import { SuspiciousToken } from '../DisplayPair';
import { Token } from 'libs/tokens';

type Props = ButtonHTMLProps & {
  token?: Token;
  description?: ReactNode;
  chevronClassName?: string;
  isBaseToken?: boolean;
};

export const SelectTokenButton: FC<Props> = ({
  token,
  className,
  description,
  isBaseToken,
  chevronClassName = '',
  ...props
}) => {
  const testId = isBaseToken ? 'select-base-token' : 'select-quote-token';
  const text = isBaseToken ? 'Select base token' : 'Select quote token';

  return (
    <button
      type="button"
      data-testid={testId}
      className={cn(
        'rounded-12 hover:outline-background-400 flex items-center gap-8 p-10 hover:outline hover:outline-1',
        token?.symbol ? 'bg-black text-white' : 'bg-primary text-black',
        className,
      )}
      {...props}
    >
      {token?.symbol ? (
        <LogoImager
          alt="Token Logo"
          src={token?.logoURI}
          width="30"
          height="30"
        />
      ) : (
        <div className="size-30 grid place-items-center rounded-full bg-black">
          <IconPlus className="text-primary size-16 p-2" />
        </div>
      )}
      <div className="flex-1 text-left">
        {description && <p className="text-12 opacity-90">{description}</p>}
        <p className="flex items-center gap-4">
          {token?.isSuspicious && <SuspiciousToken />}
          {token?.symbol ?? text}
        </p>
      </div>
      <IconChevron className={cn('size-20', chevronClassName)} />
    </button>
  );
};
