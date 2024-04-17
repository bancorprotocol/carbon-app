import { FC } from 'react';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { prettifyNumber } from 'utils/helpers';
import { ReactComponent as IconArrow } from 'assets/icons/arrowDown.svg';
import { useFiatCurrency } from 'hooks/useFiatCurrency';

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
  const { selectedFiatCurrency: currentCurrency } = useFiatCurrency();
  return (
    <div className="rounded-8 bg-background-900 text-16 -mx-10 my-10 flex items-center px-10 py-10">
      <Tooltip element="The mid-market price based on the last trade">
        <span className="flex items-center ">
          {prettifyNumber(rate, { decimals: 6 })}
          {!isLoading && (
            <div
              className={`${
                buy ? 'bg-buy/25 rotate-180' : 'bg-sell/25'
              } size-20 ml-8 flex items-center justify-center rounded-full`}
            >
              <IconArrow className={`${buy ? 'text-buy' : 'text-sell'} w-10`} />
            </div>
          )}
          {fiatRate && (
            <span className="ml-8 text-white/60">
              {prettifyNumber(fiatRate, { decimals: 6, currentCurrency })}
            </span>
          )}
        </span>
      </Tooltip>
    </div>
  );
};
