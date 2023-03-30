import { FC } from 'react';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { QueryKey, useIsFetching, useIsMutating } from 'libs/queries';

export const MainMenuRightLoading: FC = () => {
  const numberOfFetches = useIsFetching({ queryKey: QueryKey.sdk });
  const numberOfMutations = useIsMutating();

  const isBusy = numberOfFetches > 0 || numberOfMutations > 0;

  if (!isBusy) return null;

  return (
    <Tooltip element={<div>updating data</div>}>
      <div className={'relative'}>
        <span className="flex h-38 w-38 items-center justify-center rounded-full bg-silver">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/30"></span>
          <span className="relative flex h-38 w-38 items-center justify-center rounded-full">
            <CarbonLogoLoading className={'h-20 text-white'} strokeWidth="20" />
          </span>
        </span>
      </div>
    </Tooltip>
  );
};
