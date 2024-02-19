import { FC } from 'react';

export const ModalTokenListError: FC = () => {
  return (
    <div className="flex-1">
      <div className="bg-error/30 flex h-60 w-full items-center justify-center rounded-10">
        Error: Unable to load token list
      </div>
    </div>
  );
};
