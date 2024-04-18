import { FC } from 'react';
import { ReactComponent as NoOrdersIcon } from 'assets/icons/bars.svg';

type NoOrdersProps = {
  text?: string;
};

export const NoOrders: FC<NoOrdersProps> = ({ text = 'No Orders' }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex size-48 items-center justify-center self-center rounded-full bg-white/10">
        <NoOrdersIcon className="w-18 aspect-square" />
      </div>
      <h2 className="text-18 font-weight-500 mt-14">{text}</h2>
    </div>
  );
};
