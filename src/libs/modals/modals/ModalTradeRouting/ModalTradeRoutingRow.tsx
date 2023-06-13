import { Action } from 'libs/sdk';
import { Token } from 'libs/tokens';
import { FiatPriceDict } from 'store/useFiatCurrencyStore';
import { FC } from 'react';
import { useFiatCurrency } from 'hooks/useFiatCurrency';
import BigNumber from 'bignumber.js';
import { Checkbox } from 'components/common/Checkbox/Checkbox';
import { ModalTradeRoutingRowCell } from 'libs/modals/modals/ModalTradeRouting/ModalTradeRoutingRowCell';
import { ReactComponent as IconArrow } from 'assets/icons/arrow.svg';

type ModalTradeRoutingRowProps = {
  action: Action;
  source: Token;
  target: Token;
  sourceFiatPrice?: FiatPriceDict;
  targetFiatPrice?: FiatPriceDict;
  isSelected: boolean;
  handleClick: (id: string) => void;
};

export const ModalTradeRoutingRow: FC<ModalTradeRoutingRowProps> = ({
  action: { sourceAmount, targetAmount, id },
  source,
  target,
  sourceFiatPrice,
  targetFiatPrice,
  isSelected,
  handleClick,
}) => {
  const { selectedFiatCurrency } = useFiatCurrency();
  const averagePrice = new BigNumber(sourceAmount).div(targetAmount);
  const averagePriceFiat = averagePrice.times(
    sourceFiatPrice?.[selectedFiatCurrency] || 0
  );
  const sourceAmountFiat = new BigNumber(sourceAmount).times(
    sourceFiatPrice?.[selectedFiatCurrency] || 0
  );
  const targetAmountFiat = new BigNumber(targetAmount).times(
    targetFiatPrice?.[selectedFiatCurrency] || 0
  );

  const onCheckboxClick = () => {
    handleClick(id);
  };

  return (
    <>
      <div className={'space-s-20 flex items-center'}>
        <Checkbox isChecked={isSelected} setIsChecked={onCheckboxClick} />

        <ModalTradeRoutingRowCell
          amount={sourceAmount}
          fiatAmount={sourceAmountFiat}
          logoURI={source.logoURI}
          selectedFiatCurrency={selectedFiatCurrency}
        />
      </div>
      <div className={'space-s-10 flex items-center'}>
        <div
          className={
            'flex h-18 w-18 items-center justify-center rounded-full bg-silver'
          }
        >
          <IconArrow className={'w-8'} />
        </div>

        <ModalTradeRoutingRowCell
          amount={targetAmount}
          fiatAmount={targetAmountFiat}
          logoURI={target.logoURI}
          selectedFiatCurrency={selectedFiatCurrency}
        />
      </div>

      <ModalTradeRoutingRowCell
        amount={averagePrice}
        fiatAmount={averagePriceFiat}
        logoURI={source.logoURI}
        selectedFiatCurrency={selectedFiatCurrency}
      />
    </>
  );
};
