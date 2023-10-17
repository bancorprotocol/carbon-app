import { FC } from 'react';
import BigNumber from 'bignumber.js';
import { LogoImager } from 'components/common/imager/Imager';
import { getFiatDisplayValue, prettifyNumber } from 'utils/helpers';
import { FiatSymbol } from 'utils/carbonApi';

export const ModalTradeRoutingRowCell: FC<{
  logoURI?: string;
  amount: string | BigNumber;
  fiatAmount: string | BigNumber;
  selectedFiatCurrency: FiatSymbol;
}> = ({ logoURI, amount, fiatAmount, selectedFiatCurrency }) => {
  return (
    <div className="inline-flex flex-col text-left">
      <p className="inline-flex items-center gap-8">
        <LogoImager src={logoURI} alt="Token Logo" className="w-14" />
        <span className="font-mono text-14 font-weight-500">
          {prettifyNumber(amount)}
        </span>
      </p>
      <p className="font-mono text-12 font-weight-500 text-white/60">
        {getFiatDisplayValue(fiatAmount, selectedFiatCurrency)}
      </p>
    </div>
  );
};
