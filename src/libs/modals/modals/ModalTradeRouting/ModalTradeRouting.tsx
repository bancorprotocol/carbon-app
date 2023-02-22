import { Modal } from 'libs/modals/Modal';
import { ModalFC } from 'libs/modals/modals.types';
import { Action } from 'libs/sdk';
import { Token } from 'libs/tokens';
import { FC } from 'react';
import { getFiatValue, prettifyNumber } from 'utils/helpers';
import BigNumber from 'bignumber.js';
import { Imager } from 'components/common/imager/Imager';
import { useFiatCurrency } from 'hooks/useFiatCurrency';
import { FiatPriceDict, FiatSymbol } from 'store/useFiatCurrencyStore';
import { Button } from 'components/common/button';
import { TokenInputField } from 'components/common/TokenInputField';

export type ModalTradeRoutingData = {
  source: Token;
  target: Token;
  tradeActions: Action[];
};

const Muh2: FC<{
  logoURI?: string;
  amount: string | BigNumber;
  fiatAmount: string | BigNumber;
  selectedFiatCurrency: FiatSymbol;
}> = ({ logoURI, amount, fiatAmount, selectedFiatCurrency }) => {
  return (
    <div>
      <div className={'flex items-center space-x-8'}>
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

type MuhProps = {
  action: Action;
  source: Token;
  target: Token;
  sourceFiatPrice?: FiatPriceDict;
  targetFiatPrice?: FiatPriceDict;
};

const Muh: FC<MuhProps> = ({
  action: { sourceAmount, targetAmount },
  source,
  target,
  sourceFiatPrice,
  targetFiatPrice,
}) => {
  const { selectedFiatCurrency } = useFiatCurrency();
  const averagePrice = new BigNumber(sourceAmount).div(targetAmount);
  const averagePriceFiat = averagePrice.times(
    sourceFiatPrice?.[selectedFiatCurrency] || 0
  );
  const sourceAmountFiat = new BigNumber(sourceAmount).times(
    sourceFiatPrice?.[selectedFiatCurrency] || 0
  );
  const targetAmountFiat = new BigNumber(targetAmount).times(
    targetFiatPrice?.[selectedFiatCurrency] || 0
  );

  return (
    <>
      <Muh2
        amount={sourceAmount}
        fiatAmount={sourceAmountFiat}
        logoURI={source.logoURI}
        selectedFiatCurrency={selectedFiatCurrency}
      />

      <div>{'->'}</div>

      <Muh2
        amount={targetAmount}
        fiatAmount={targetAmountFiat}
        logoURI={target.logoURI}
        selectedFiatCurrency={selectedFiatCurrency}
      />

      <Muh2
        amount={averagePrice}
        fiatAmount={averagePriceFiat}
        logoURI={source.logoURI}
        selectedFiatCurrency={selectedFiatCurrency}
      />
    </>
  );
};

export const ModalTradeRouting: ModalFC<ModalTradeRoutingData> = ({
  id,
  data: { tradeActions, source, target },
}) => {
  const { useGetTokenPrice } = useFiatCurrency();
  const sourceFiatPrice = useGetTokenPrice(source.symbol);
  const targetFiatPrice = useGetTokenPrice(target.symbol);

  return (
    <Modal id={id} title="Trade Routing" size={'md'}>
      <div className="mt-20 grid grid-cols-4 gap-10 rounded-8 bg-black p-10">
        <div>{source.symbol}</div>
        <div></div>
        <div>{target.symbol}</div>
        <div>Average Price</div>

        {tradeActions.map((action, index) => (
          <Muh
            key={index}
            action={action}
            source={source}
            target={target}
            sourceFiatPrice={sourceFiatPrice.data}
            targetFiatPrice={targetFiatPrice.data}
          />
        ))}
      </div>

      <div className={'my-20 space-y-10'}>
        <div className={'rounded-12 bg-black p-16'}>
          <TokenInputField value={'123'} token={source} disabled />
        </div>
        <div className={'rounded-12 bg-black p-16'}>
          <TokenInputField value={'456'} token={target} disabled />
        </div>
      </div>

      <div className={'flex w-full space-x-10'}>
        <Button variant={'secondary'} fullWidth>
          Cancel
        </Button>
        <Button fullWidth>Confirm</Button>
      </div>
    </Modal>
  );
};
