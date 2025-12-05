import { FC } from 'react';
import { SafeDecimal } from 'libs/safedecimal';
import { LogoImager } from 'components/common/imager/Imager';
import { getUsdPrice, prettifyNumber } from 'utils/helpers';

export const ModalTradeRoutingRowCell: FC<{
  logoURI?: string;
  amount: string | SafeDecimal;
  fiatAmount: string | SafeDecimal;
}> = ({ logoURI, amount, fiatAmount }) => {
  const isFiatAmountNotZero = new SafeDecimal(fiatAmount).gt(0);
  return (
    <>
      <p className="inline-flex items-center gap-8">
        <LogoImager src={logoURI} alt="Token Logo" className="w-14" />
        <span className="text-14 font-medium">{prettifyNumber(amount)}</span>
      </p>
      {isFiatAmountNotZero && (
        <p className="text-12 font-medium text-white/60">
          {getUsdPrice(fiatAmount)}
        </p>
      )}
    </>
  );
};
