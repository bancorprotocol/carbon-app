import { FC, useMemo } from 'react';
import { Imager } from 'components/common/imager/Imager';
import { ReactComponent as IconChevron } from 'assets/icons/chevron.svg';
import { ReactComponent as IconPlus } from 'assets/icons/plus.svg';
import { Button, ButtonHTMLProps } from 'components/common/button';
import { Tooltip } from '../tooltip/Tooltip';
import { useBreakpoints } from 'hooks/useBreakpoints';
import { useTranslation } from 'libs/translations';

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
  const { t } = useTranslation();
  const { belowBreakpoint } = useBreakpoints();

  const tooltipText = useMemo(() => {
    if (isBaseToken) {
      return symbol
        ? `${symbol}: ${address}`
        : t('pages.strategyCreate.step1.tooltips.tooltip1');
    }

    return symbol
      ? `${symbol}: ${address}`
      : t('pages.strategyCreate.step1.tooltips.tooltip2');
  }, [address, isBaseToken, symbol, t]);

  return (
    <Tooltip
      disabled={belowBreakpoint('md')}
      maxWidth={430}
      element={tooltipText}
      sendEventOnMount={{ buy: undefined }}
    >
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
              <IconPlus className={'h-16 w-16 p-2 text-green'} />
            </div>
          )}
          <div className={'flex flex-col items-start'}>
            <div className={'flex flex-col items-start'}>
              {description && (
                <div
                  className={`text-12 ${
                    symbol ? 'text-white/60' : 'text-black/60'
                  }`}
                >
                  {description}
                </div>
              )}
              <div>{symbol ? symbol : 'Select Token'}</div>
            </div>
          </div>
        </span>
        <IconChevron className="w-14" />
      </Button>
    </Tooltip>
  );
};
