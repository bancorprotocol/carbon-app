import { FC } from 'react';
import { LogoImager } from 'components/common/imager/Imager';
import { ReactComponent as IconArrow } from 'assets/icons/arrow.svg';
import { ReactComponent as IconChevron } from 'assets/icons/chevron.svg';
import { shortenString } from 'utils/helpers';

interface Props {
  symbol0?: string;
  symbol1?: string;
  imgUrl0?: string;
  imgUrl1?: string;
  onClick0: Function;
  onClick1: Function;
  onMiddleClick?: Function;
  middleDisabled?: boolean;
}

export const SelectTokens: FC<Props> = ({
  symbol0,
  symbol1,
  imgUrl0,
  imgUrl1,
  onClick0,
  onClick1,
  onMiddleClick,
  middleDisabled,
}) => {
  return (
    <div className={'flex items-center justify-between'}>
      <button
        onClick={() => onClick0()}
        className={
          '-mr-13 flex w-[140px] flex-grow items-center rounded-12 bg-black py-10 px-18'
        }
      >
        <LogoImager alt={''} src={imgUrl0} className={'mr-8 h-30 w-30'} />
        <div className={'mr-auto text-16 font-weight-500'}>
          {symbol0 ? shortenString(symbol0, '...', 5) : 'Select'}
        </div>
        <IconChevron className="w-14" />
      </button>
      <button
        onClick={() => onMiddleClick?.()}
        disabled={middleDisabled}
        className={
          'z-20 flex h-30 w-30 flex-grow-0 items-center justify-center rounded-full bg-background-900 disabled:cursor-not-allowed'
        }
      >
        <IconArrow className={`${middleDisabled && 'opacity-25'}`} />
      </button>
      <button
        onClick={() => onClick1()}
        className={
          '-ml-13 flex w-[140px] flex-grow items-center rounded-12 bg-black py-10 px-18'
        }
      >
        <LogoImager
          alt={''}
          src={imgUrl1}
          className={'mr-8 h-30 w-30 rounded-full'}
        />
        <div className={'mr-auto text-16 font-weight-500'}>
          {symbol1 ? shortenString(symbol1, '...', 5) : 'Select'}
        </div>
        <IconChevron className="w-14" />
      </button>
    </div>
  );
};
