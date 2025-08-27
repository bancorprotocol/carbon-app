import { FC } from 'react';

export const ModalTokenListError: FC = () => {
  return (
    <div className="flex-1">
      <div className="rounded-lg bg-error/30 flex h-60 w-full items-center justify-center">
        Error: Unable to load token list
      </div>
    </div>
  );
};
