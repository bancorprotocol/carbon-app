import { FC } from 'react';
import { Imager } from 'components/common/imager/Imager';
import { ReactComponent as IconChevron } from 'assets/icons/chevron.svg';
import { Button, ButtonHTMLProps } from 'components/common/button';

type Props = ButtonHTMLProps & {
  symbol?: string;
  imgUrl?: string;
};

export const SelectTokenButton: FC<Props> = ({
  symbol,
  imgUrl,
  className,
  ...props
}) => {
  return (
    <Button
      variant={symbol ? 'black' : 'success'}
      className={`flex h-52 items-center justify-between rounded-12 px-14 ${className}`}
      fullWidth
      {...props}
    >
      <span className={'flex items-center text-16 font-weight-500'}>
        {symbol ? (
          <>
            <Imager
              alt={'Token Logo'}
              src={imgUrl}
              className={'mr-14 h-24 w-24 rounded-full'}
            />
            <span>{symbol}</span>
          </>
        ) : (
          'Select Token'
        )}
      </span>
      <IconChevron className="w-14" />
    </Button>
  );
};
