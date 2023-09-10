import { FC } from 'react';
import Decimal from 'decimal.js';
import { sanitizeNumberInput } from 'utils/helpers';
import { useFiatCurrency } from 'hooks/useFiatCurrency';
import { Tooltip } from '../tooltip/Tooltip';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';

export const Slippage: FC<{ slippage: Decimal }> = ({ slippage }) => {
  const { selectedFiatCurrency } = useFiatCurrency();
  const isSlippagePositive = slippage?.gt(0);

  return (
    <Tooltip
      element={`The slippage is calculated based on the ${selectedFiatCurrency} value difference between the selected source and target tokens.`}
    >
      <div className="flex-end flex gap-5">
        <div
          className={`ml-4 ${
            slippage.gte(new Decimal(-3)) && slippage.lte(0)
              ? 'text-white/80'
              : isSlippagePositive
              ? 'text-green'
              : 'text-red'
          }`}
        >
          {slippage.isZero() ? (
            <div className="text-red">Notice, price & slippage are unknown</div>
          ) : (
            `(${isSlippagePositive ? '+' : '-'}${sanitizeNumberInput(
              slippage.toString(),
              2
            )}%)`
          )}
        </div>
        {(slippage.lt(-3) || slippage.isZero()) && (
          <IconWarning className="w-14 text-red" />
        )}
      </div>
    </Tooltip>
  );
};
