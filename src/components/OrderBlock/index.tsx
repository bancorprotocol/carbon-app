import { FC } from 'react';

type Props = {
  text: string;
  textSecondary: string;
};

export const OrderBlock: FC<Props> = ({ text, textSecondary }) => {
  return (
    <div className="bg-secondary rounded-12 relative p-10">
      <div className={'absolute right-20 top-0 flex h-full items-center'}>
        <div
          className={
            'rounded-full bg-primary-500/20 px-16 py-3 text-14 text-primary-400'
          }
        >
          Simple
        </div>
      </div>
      <div className="text-secondary text-12">{textSecondary}</div>
      <div className={'text-18 font-weight-500'}>{text}</div>
    </div>
  );
};
