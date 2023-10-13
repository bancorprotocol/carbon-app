import { FC } from 'react';
import { SafeDecimal } from 'libs/safedecimal';
import { cn, sanitizeNumberInput } from 'utils/helpers';
import { useFiatCurrency } from 'hooks/useFiatCurrency';
import { Tooltip } from '../tooltip/Tooltip';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';

interface Props {
  slippage: SafeDecimal;
}

const slippageColor = (slippage: SafeDecimal) => {
  if (slippage?.gt(0)) return 'text-green';
  if (slippage?.isZero()) return 'text-red';
  if (slippage?.lt(-3)) return 'text-red';
  return 'text-white/80';
};

export const Slippage: FC<Props> = ({ slippage }) => {
  const { selectedFiatCurrency } = useFiatCurrency();
  const slippageValue = sanitizeNumberInput(slippage.toString(), 2);
  const textColor = slippageColor(slippage);

  return (
    <Tooltip
      element={`The slippage is calculated based on the ${selectedFiatCurrency} value difference between the selected source and target tokens.`}
    >
      <span className={cn('flex flex-1 items-center gap-5', textColor)}>
        {slippage?.eq(0) && <IconWarning className="h-12 w-12" />}
        {slippage?.gt(0) && <>(+{slippageValue}%)</>}
        {slippage?.lt(0) && <>(-{slippageValue}%)</>}
        {slippage?.eq(0) && <>Notice: price & slippage are unknown</>}
        {slippage.lt(-3) && <IconWarning className="h-12 w-12" />}
      </span>
    </Tooltip>
  );
};
