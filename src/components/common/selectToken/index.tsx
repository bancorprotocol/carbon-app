import { FC } from 'react';
import { LogoImager } from 'components/common/imager/Imager';
import { ButtonHTMLProps } from 'components/common/button';
import { ReactComponent as IconChevron } from 'assets/icons/chevron.svg';
import { ReactComponent as IconPlus } from 'assets/icons/plus.svg';
import { cn } from 'utils/helpers';

type Props = ButtonHTMLProps & {
  symbol?: string;
  imgUrl?: string;
  description?: string;
  isBaseToken?: boolean;
};

export const SelectTokenButton: FC<Props> = ({
  symbol,
  imgUrl,
  className,
  description,
  isBaseToken,
  ...props
}) => {
  const testId = isBaseToken ? 'select-base-token' : 'select-quote-token';
  const text = isBaseToken ? 'Select base token' : 'Select quote token';

  return (
    <button
      data-testid={testId}
      className={cn(
        'flex items-center gap-8 rounded-12 p-10',
        symbol ? 'bg-black text-white' : 'bg-green text-black',
        className
      )}
      {...props}
    >
      {symbol ? (
        <LogoImager alt="Token Logo" src={imgUrl} width="30" height="30" />
      ) : (
        <div className="grid h-30 w-30 place-items-center rounded-full bg-black">
          <IconPlus className="h-16 w-16 p-2 text-green" />
        </div>
      )}
      <div className="flex-1 text-left">
        {description && <p className="text-12 opacity-90">{description}</p>}
        <p>{symbol ?? text}</p>
      </div>
      <IconChevron className="h-20 w-20" />
    </button>
  );
};
