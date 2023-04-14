import { FC } from 'react';
import { Imager } from 'components/common/imager/Imager';
import { ReactComponent as IconChevron } from 'assets/icons/chevron.svg';
import { ReactComponent as IconPlus } from 'assets/icons/plus.svg';
import { Button, ButtonHTMLProps } from 'components/common/button';
import { Tooltip } from '../tooltip/Tooltip';

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
    <Button
      variant={symbol ? 'black' : 'success'}
      className={`flex h-52 items-center justify-between rounded-12 px-14 ${className}`}
      fullWidth
      {...props}
    >
      <span className={'flex items-center text-16 font-weight-500'}>
        {symbol ? (
          <Imager
            alt={'Token Logo'}
            src={imgUrl}
            className={'mr-14 h-24 w-24 rounded-full'}
          />
        ) : (
          <div
            className={
              'mr-14 flex h-24 w-24 items-center justify-center rounded-full bg-black'
            }
          >
            <IconPlus className={'h-16 w-16 text-green'} />
          </div>
        )}
        <div className={'flex flex-col items-start'}>
          {description && (
            <Tooltip
              sendEventOnMount={{ buy: undefined }}
              maxWidth={430}
              interactive={false}
              element={getTooltipText()}
            >
              <div
                className={`text-12 ${
                  symbol ? 'text-white/60' : 'text-black/60'
                }`}
              >
                {description}
              </div>
            </Tooltip>
          )}
          <div>{symbol ? symbol : 'Select Token'}</div>
        </div>
      </span>
      <IconChevron className="w-14" />
    </Button>
  );
};
