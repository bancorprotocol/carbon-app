import { Action } from 'libs/sdk';
import { Token } from 'libs/tokens';
import { FC } from 'react';
import { SafeDecimal } from 'libs/safedecimal';
import { Checkbox } from 'components/common/Checkbox/Checkbox';
import { ModalTradeRoutingRowCell } from 'libs/modals/modals/ModalTradeRouting/ModalTradeRoutingRowCell';
import { ForwardArrow } from 'components/common/forwardArrow';

type ModalTradeRoutingRowProps = {
  action: Action;
  source: Token;
  target: Token;
  sourceFiatPrice?: number;
  targetFiatPrice?: number;
  isSelected: boolean;
  handleClick: (id: string) => void;
  isBuy?: boolean;
};

export const ModalTradeRoutingRow: FC<ModalTradeRoutingRowProps> = ({
  action: { sourceAmount, targetAmount, id },
  source,
  target,
  sourceFiatPrice,
  targetFiatPrice,
  isSelected,
  isBuy,
  handleClick,
}) => {
  const sourceAmountFiat = new SafeDecimal(sourceAmount).times(
    sourceFiatPrice || 0,
  );

  const targetAmountFiat = new SafeDecimal(targetAmount).times(
    targetFiatPrice || 0,
  );

  const averageToken = isBuy ? source : target;
  const averageFiatPrice = isBuy ? sourceFiatPrice : targetFiatPrice;
  const averageAmount = isBuy
    ? new SafeDecimal(sourceAmount).div(targetAmount)
    : new SafeDecimal(targetAmount).div(sourceAmount);

  const averagePriceFiat = averageAmount.times(averageFiatPrice || 0);

  const onCheckboxClick = () => {
    handleClick(id);
  };

  return (
    <tr>
      <td className="border-main-800 border-t p-8">
        <Checkbox
          isChecked={isSelected}
          setIsChecked={onCheckboxClick}
          className="m-auto"
          aria-label={`${sourceAmount} ${source.name} per ${targetAmount} ${target.name}`}
          tabIndex={-1}
        />
      </td>
      <td className="border-main-800 border-t p-8">
        <ModalTradeRoutingRowCell
          amount={sourceAmount}
          fiatAmount={sourceAmountFiat}
          logoURI={source.logoURI}
        />
      </td>
      <td className="border-main-800 border-t">
        <ForwardArrow
          arrowType="full"
          className="size-18 bg-main-900 inline rounded-full p-4 text-white/60"
        />
      </td>
      <td className="border-main-800 border-t p-8">
        <ModalTradeRoutingRowCell
          amount={targetAmount}
          fiatAmount={targetAmountFiat}
          logoURI={target.logoURI}
        />
      </td>

      <td className="border-main-800 border-t p-8">
        <ModalTradeRoutingRowCell
          amount={averageAmount}
          fiatAmount={averagePriceFiat}
          logoURI={averageToken.logoURI}
        />
      </td>
    </tr>
  );
};
