import { FC } from 'react';
import BigNumber from 'bignumber.js';
import { sanitizeNumberInput } from 'utils/helpers';
import { useFiatCurrency } from 'hooks/useFiatCurrency';
import { Tooltip } from '../tooltip/Tooltip';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';

export const Slippage: FC<{ slippage: BigNumber }> = ({ slippage }) => {
  const { selectedFiatCurrency } = useFiatCurrency();
  const isSlippagePositive = slippage?.isGreaterThan(0);

  return (
    <Tooltip
      element={`The slippage is calculated based on the ${selectedFiatCurrency} value difference between the selected source and target tokens.`}
    >
      <div className="flex-end flex gap-5">
        <div
          className={`ml-4 ${
            slippage.gte(new BigNumber(-1)) && slippage.lte(new BigNumber(0))
              ? 'text-white/80'
              : isSlippagePositive
              ? 'text-green'
              : 'text-red'
          }`}
        >
          {slippage.isEqualTo(0) ? (
            <div className="text-red">Notice, price & slippage are unknown</div>
          ) : (
            `(${isSlippagePositive ? '+' : '-'}${sanitizeNumberInput(
              slippage.toString(),
              2
            )}%)`
          )}
        </div>
        {(slippage.lt(-1) || slippage.isEqualTo(0)) && (
          <IconWarning className="w-14 text-red" />
        )}
      </div>
    </Tooltip>
  );
};
