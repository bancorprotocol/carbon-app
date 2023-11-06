import { Action } from 'libs/sdk';
import { Token } from 'libs/tokens';
import { FC } from 'react';
import { useFiatCurrency } from 'hooks/useFiatCurrency';
import { SafeDecimal } from 'libs/safedecimal';
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
  buy?: boolean;
};

export const ModalTradeRoutingRow: FC<ModalTradeRoutingRowProps> = ({
  action: { sourceAmount, targetAmount, id },
  source,
  target,
  sourceFiatPrice,
  targetFiatPrice,
  isSelected,
  buy,
  handleClick,
}) => {
  const { selectedFiatCurrency } = useFiatCurrency();

  const sourceAmountFiat = new SafeDecimal(sourceAmount).times(
    sourceFiatPrice?.[selectedFiatCurrency] || 0
  );

  const targetAmountFiat = new SafeDecimal(targetAmount).times(
    targetFiatPrice?.[selectedFiatCurrency] || 0
  );

  const averageToken = buy ? source : target;
  const averageFiatPrice = buy ? sourceFiatPrice : targetFiatPrice;
  const averageAmount = buy
    ? new SafeDecimal(sourceAmount).div(targetAmount)
    : new SafeDecimal(targetAmount).div(sourceAmount);

  const averagePriceFiat = averageAmount.times(
    averageFiatPrice?.[selectedFiatCurrency] || 0
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
          aria-label={`${sourceAmount} ${source.name} per ${targetAmount} ${target.name}`}
          tabIndex={-1}
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
          amount={averageAmount}
          fiatAmount={averagePriceFiat}
          logoURI={averageToken.logoURI}
          selectedFiatCurrency={selectedFiatCurrency}
        />
      </td>
    </tr>
  );
};
