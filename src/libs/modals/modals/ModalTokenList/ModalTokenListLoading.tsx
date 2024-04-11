import { FC } from 'react';

export const ModalTokenListLoading: FC = () => {
  return (
    <div className="flex-1 overflow-auto">
      <div className="mb-8 h-12 w-[180px] animate-pulse rounded-full bg-black"></div>
      <ul className="flex flex-col gap-8">
        {Array.from({ length: 10 }).map((_, i) => (
          <li key={i} className="h-55 rounded-10 animate-pulse bg-black"></li>
        ))}
      </ul>
    </div>
  );
};
