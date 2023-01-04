import { FC } from 'react';

export const ModalTokenListLoading: FC = () => {
  return (
    <div className={'h-[430px] overflow-scroll'}>
      <div
        className={
          'mt-20 mb-8 h-12 w-[180px] animate-pulse rounded-full bg-silver'
        }
      ></div>
      <div className={'space-y-8'}>
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className={'h-60 w-full animate-pulse rounded-10 bg-silver'}
          ></div>
        ))}
      </div>
    </div>
  );
};
