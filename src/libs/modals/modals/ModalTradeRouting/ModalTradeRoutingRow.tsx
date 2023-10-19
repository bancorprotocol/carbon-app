import { Action } from 'libs/sdk';
import { Token } from 'libs/tokens';
import { FC } from 'react';
import { useFiatCurrency } from 'hooks/useFiatCurrency';
import BigNumber from 'bignumber.js';
import { Checkbox } from 'components/common/Checkbox/Checkbox';
import { ModalTradeRoutingRowCell } from 'libs/modals/modals/ModalTradeRouting/ModalTradeRoutingRowCell';
import { ForwardArrow } from 'components/common/forwardArrow';
import { FiatPriceDict } from 'utils/carbonApi';

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
    <tr>
      <td className="border-t border-emphasis p-8">
        <Checkbox
          isChecked={isSelected}
          setIsChecked={onCheckboxClick}
          className="m-auto"
        />
      </td>
      <td className="border-t border-emphasis p-8">
        <ModalTradeRoutingRowCell
          amount={sourceAmount}
          fiatAmount={sourceAmountFiat}
          logoURI={source.logoURI}
          selectedFiatCurrency={selectedFiatCurrency}
        />
      </td>
      <td className="border-t border-emphasis">
        <ForwardArrow
          arrowType="full"
          className="inline h-18 w-18 rounded-full bg-silver p-4 text-white/60"
        />
      </td>
      <td className="border-t border-emphasis p-8">
        <ModalTradeRoutingRowCell
          amount={targetAmount}
          fiatAmount={targetAmountFiat}
          logoURI={target.logoURI}
          selectedFiatCurrency={selectedFiatCurrency}
        />
      </td>

      <td className="border-t border-emphasis p-8">
        <ModalTradeRoutingRowCell
          amount={averagePrice}
          fiatAmount={averagePriceFiat}
          logoURI={source.logoURI}
          selectedFiatCurrency={selectedFiatCurrency}
        />
      </td>
    </tr>
  );
};
