import { FC } from 'react';
import { useBreakpoints } from 'hooks/useBreakpoints';
import { LogoImager } from 'components/common/imager/Imager';
import { ButtonHTMLProps } from 'components/common/button';
import { Tooltip } from '../tooltip/Tooltip';
import { ReactComponent as IconChevron } from 'assets/icons/chevron.svg';
import { ReactComponent as IconPlus } from 'assets/icons/plus.svg';
import { cn } from 'utils/helpers';

type Props = ButtonHTMLProps & {
  symbol?: string;
  address?: string;
  imgUrl?: string;
  description?: string;
  isBaseToken?: boolean;
};

export const SelectTokenButton: FC<Props> = ({
  symbol,
  address,
  imgUrl,
  className,
  description,
  isBaseToken,
  ...props
}) => {
  const { belowBreakpoint } = useBreakpoints();

  const testId = isBaseToken ? 'select-base-token' : 'select-quote-token';
  const text = isBaseToken ? 'Select base token' : 'Select quote token';
  const getTooltipText = () => {
    if (isBaseToken) {
      return symbol
        ? `${symbol}: ${address}`
        : 'Select the Base token for the pair';
    }

    return symbol
      ? `${symbol}: ${address}`
      : 'Select the Quote token for the pair (i.e. when selecting USDC, all rates would be denominated in USDC)';
  };

  return (
    <Tooltip
      disabled={belowBreakpoint('md')}
      maxWidth={430}
      element={getTooltipText()}
      sendEventOnMount={{ buy: undefined }}
    >
      <button
        data-testid={testId}
        className={cn(
          'flex w-full items-center gap-8 rounded-12 p-10',
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
          {description && <p className="text-12 opacity-60">{description}</p>}
          <p>{symbol ?? text}</p>
        </div>
        <IconChevron className="h-20 w-20" />
      </button>
    </Tooltip>
  );
};
