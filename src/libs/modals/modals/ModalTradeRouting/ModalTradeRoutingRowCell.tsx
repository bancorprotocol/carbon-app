import { FC } from 'react';
import { SafeDecimal } from 'libs/safedecimal';
import { LogoImager } from 'components/common/imager/Imager';
import { getFiatDisplayValue, prettifyNumber } from 'utils/helpers';
import { FiatSymbol } from 'utils/carbonApi';

export const ModalTradeRoutingRowCell: FC<{
  logoURI?: string;
  amount: string | SafeDecimal;
  fiatAmount: string | SafeDecimal;
  selectedFiatCurrency: FiatSymbol;
}> = ({ logoURI, amount, fiatAmount, selectedFiatCurrency }) => {
  const isFiatAmountNotZero = new SafeDecimal(fiatAmount).gt(0);
  return (
    <>
      <p className="inline-flex items-center gap-8">
        <LogoImager src={logoURI} alt="Token Logo" className="w-14" />
        <span className="text-14 font-weight-500">
          {prettifyNumber(amount)}
        </span>
      </p>
      {isFiatAmountNotZero && (
        <p className="text-12 font-weight-500 text-white/60">
          {getFiatDisplayValue(fiatAmount, selectedFiatCurrency)}
        </p>
      )}
    </>
  );
};
