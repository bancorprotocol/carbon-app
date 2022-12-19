import { FC } from 'react';

export const ModalTokenListError: FC = () => {
  return (
    <div className={'h-[430px] overflow-scroll'}>
      <div
        className={
          'mt-20 flex h-60 w-full items-center justify-center rounded-10 bg-error-500/30'
        }
      >
        Error: Unable to load token list
      </div>
    </div>
  );
};
