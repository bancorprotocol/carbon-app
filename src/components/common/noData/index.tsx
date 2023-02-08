import { FC } from 'react';
import { ReactComponent as NoDataIcon } from 'assets/icons/noData.svg';

export const NoData: FC = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex h-48 w-48 items-center justify-center self-center rounded-full bg-white/10">
        <NoDataIcon className="aspect-square w-18" />
      </div>
      <div className="mt-14 text-18 font-weight-500">No Data</div>
    </div>
  );
};
