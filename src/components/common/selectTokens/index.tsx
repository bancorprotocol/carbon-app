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
  onClick0: () => any;
  onClick1: () => any;
  onMiddleClick?: () => any;
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
    <div className="flex items-center justify-between">
      <button
        onClick={() => onClick0()}
        className="-mr-13 rounded-12 px-18 flex w-[140px] flex-grow items-center bg-black py-10"
      >
        <LogoImager alt="" src={imgUrl0} className="h-30 w-30 mr-8" />
        <div className="text-16 font-weight-500 mr-auto">
          {symbol0 ? shortenString(symbol0, '...', 5) : 'Select'}
        </div>
        <IconChevron className="w-14" />
      </button>
      <button
        onClick={() => onMiddleClick?.()}
        disabled={middleDisabled}
        className="size-30 bg-background-900 z-20 flex flex-grow-0 items-center justify-center rounded-full disabled:cursor-not-allowed"
      >
        <IconArrow className={`${middleDisabled && 'opacity-25'}`} />
      </button>
      <button
        onClick={() => onClick1()}
        className="-ml-13 rounded-12 px-18 flex w-[140px] flex-grow items-center bg-black py-10"
      >
        <LogoImager
          alt=""
          src={imgUrl1}
          className="size-30 mr-8 rounded-full"
        />
        <div className="text-16 font-weight-500 mr-auto">
          {symbol1 ? shortenString(symbol1, '...', 5) : 'Select'}
        </div>
        <IconChevron className="w-14" />
      </button>
    </div>
  );
};
