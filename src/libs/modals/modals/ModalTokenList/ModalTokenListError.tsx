import { FC } from 'react';

export const ModalTokenListError: FC = () => {
  return (
    <div className="flex-1">
      <div className="flex h-60 w-full items-center justify-center rounded-10 bg-red/30">
        Error: Unable to load token list
      </div>
    </div>
  );
};
