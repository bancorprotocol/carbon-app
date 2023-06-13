import { FC } from 'react';
import BigNumber from 'bignumber.js';
import { FiatSymbol } from 'store/useFiatCurrencyStore';
import { Imager } from 'components/common/imager/Imager';
import { getFiatDisplayValue, prettifyNumber } from 'utils/helpers';

export const ModalTradeRoutingRowCell: FC<{
  logoURI?: string;
  amount: string | BigNumber;
  fiatAmount: string | BigNumber;
  selectedFiatCurrency: FiatSymbol;
}> = ({ logoURI, amount, fiatAmount, selectedFiatCurrency }) => {
  return (
    <div>
      <div className={'space-s-8 flex items-center '}>
        <Imager src={logoURI} alt={'Token Logo'} className={'w-14'} />
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
