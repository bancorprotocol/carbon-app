import { FC } from 'react';
import BigNumber from 'bignumber.js';
import { FiatSymbol } from 'store/useFiatCurrencyStore';
import { Imager } from 'components/common/imager/Imager';
import { getFiatValue, prettifyNumber } from 'utils/helpers';

export const ModalTradeRoutingRowCell: FC<{
  logoURI?: string;
  amount: string | BigNumber;
  fiatAmount: string | BigNumber;
  selectedFiatCurrency: FiatSymbol;
}> = ({ logoURI, amount, fiatAmount, selectedFiatCurrency }) => {
  return (
    <div>
      <div className={'flex items-center space-x-8 '}>
        <Imager src={logoURI} alt={'Token Logo'} className={'w-14'} />
        <span className={'font-mono text-14 font-weight-500'}>
          {prettifyNumber(amount)}
        </span>
      </div>
      <div className={'text-secondary'}>
        {getFiatValue(fiatAmount, selectedFiatCurrency)}
      </div>
    </div>
  );
};
