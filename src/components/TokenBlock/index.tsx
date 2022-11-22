import { FC } from 'react';

type Props = {
  text: string;
  textSecondary: string;
  imgUrl: string;
};

export const TokenBlock: FC<Props> = ({ text, textSecondary }) => {
  return (
    <div className="bg-secondary flex w-full items-center space-x-10 rounded-12 p-10">
      <div className={'h-40 w-40 rounded-full bg-lightGrey dark:bg-darkGrey'} />
      <div>
        <div className={'text-20 font-weight-500'}>{text}</div>
        <div className="text-secondary">{textSecondary}</div>
      </div>
    </div>
  );
};
