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
  return (
    <>
      <p className="inline-flex items-center gap-8">
        <LogoImager src={logoURI} alt="Token Logo" className="w-14" />
        <span className="text-14 font-weight-500 font-mono">
          {prettifyNumber(amount)}
        </span>
      </p>
      <p className="text-12 font-weight-500 font-mono text-white/60">
        {getFiatDisplayValue(fiatAmount, selectedFiatCurrency)}
      </p>
    </>
  );
};
