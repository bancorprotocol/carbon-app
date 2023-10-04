import { FC } from 'react';
import Decimal from 'decimal.js';
import { LogoImager } from 'components/common/imager/Imager';
import { getFiatDisplayValue, prettifyNumber } from 'utils/helpers';
import { FiatSymbol } from 'utils/carbonApi';

export const ModalTradeRoutingRowCell: FC<{
  logoURI?: string;
  amount: string | Decimal;
  fiatAmount: string | Decimal;
  selectedFiatCurrency: FiatSymbol;
}> = ({ logoURI, amount, fiatAmount, selectedFiatCurrency }) => {
  return (
    <div>
      <div className={'flex items-center space-x-8 '}>
        <LogoImager src={logoURI} alt={'Token Logo'} className={'w-14'} />
        <span className={'font-mono text-14 font-weight-500'}>
          {prettifyNumber(amount)}
        </span>
      </div>
      <div className={'text-secondary'}>
        {getFiatDisplayValue(fiatAmount, selectedFiatCurrency)}
      </div>
    </div>
  );
};
