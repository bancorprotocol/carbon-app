import { FC } from 'react';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { prettifyNumber } from 'utils/helpers';
import { ReactComponent as IconArrow } from 'assets/icons/arrowDown.svg';

type Props = {
  rate: string;
  fiatRate?: string;
  buy?: boolean;
  isLoading?: boolean;
};

export const OrderBookWidgetRate: FC<Props> = ({
  rate,
  buy,
  fiatRate,
  isLoading,
}) => {
  return (
    <div
      className={`-mx-10 my-10 flex items-center rounded-8 bg-silver px-10 py-10 text-16`}
    >
      <Tooltip element={'The mid-market price based on the last trade'}>
        <span className="flex items-center ">
          {prettifyNumber(rate)}
          {!isLoading && (
            <div
              className={`${
                buy ? 'rotate-180 bg-green/25' : 'bg-red/25'
              } ml-8 flex h-20 w-20 items-center justify-center rounded-full`}
            >
              <IconArrow
                className={`${buy ? 'text-green' : 'text-red'} w-10`}
              />
            </div>
          )}
          {fiatRate && <span className="ml-8 text-white/60">{fiatRate}</span>}
        </span>
      </Tooltip>
    </div>
  );
};
