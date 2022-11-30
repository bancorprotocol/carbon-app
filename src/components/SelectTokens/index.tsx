import { FC } from 'react';
import { Imager } from 'elements/Imager';

interface Props {
  symbol0?: string;
  symbol1?: string;
  imgUrl0?: string;
  imgUrl1?: string;
  onClick0: Function;
  onClick1: Function;
  onMiddleClick?: Function;
}

export const SelectTokens: FC<Props> = ({
  symbol0,
  symbol1,
  imgUrl0,
  imgUrl1,
  onClick0,
  onClick1,
  onMiddleClick,
}) => {
  return (
    <div className={'flex items-center justify-between'}>
      <button
        onClick={() => onClick0()}
        className={
          'bg-body -mr-13 flex flex-grow items-center space-x-10 rounded-l-14 px-20 py-10'
        }
      >
        <Imager alt={''} src={imgUrl0} className={'h-30 w-30 rounded-full'} />
        <div className={'text-20 font-weight-500'}>{symbol0 ?? 'select'}</div>
      </button>
      <button
        onClick={() => onMiddleClick?.()}
        className={
          'bg-secondary z-20 flex h-30 w-30 flex-grow-0 items-center justify-center rounded-full'
        }
      >
        {'->'}
      </button>
      <button
        onClick={() => onClick1()}
        className={
          'bg-body -ml-13 flex flex-grow items-center space-x-10 rounded-r-14 px-20 py-10'
        }
      >
        <Imager alt={''} src={imgUrl1} className={'h-30 w-30 rounded-full'} />
        <div className={'text-20 font-weight-500'}>{symbol1 ?? 'select'}</div>
      </button>
    </div>
  );
};
