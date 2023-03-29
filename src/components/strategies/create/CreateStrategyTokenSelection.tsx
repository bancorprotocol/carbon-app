import { m } from 'libs/motion';
import { ReactComponent as IconArrow } from 'assets/icons/arrowDown.svg';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { SelectTokenButton } from 'components/common/selectToken';
import { items } from './variants';
import { sendEvent } from 'services/googleTagManager';
import { Token } from 'libs/tokens';

export const CreateStrategyTokenSelection = ({
  base,
  quote,
  setBase,
  setQuote,
  openTokenListModal,
}: {
  base: Token | undefined;
  quote: Token | undefined;
  setBase: (token: Token | undefined) => void;
  setQuote: (token: Token | undefined) => void;
  openTokenListModal: (isSource?: boolean) => void;
}) => {
  return (
    <m.div variants={items} className="bg-secondary rounded-10 p-20">
      <div className="mb-14 flex items-center justify-between">
        <h2>Token Pair</h2>
        <Tooltip
          element={
            <div>
              Selecting the tokens you would like to create a strategy for.
              <br />
              <b>Buy or Sell token</b> (also called Base token) is the token you
              would like to buy or sell in the strategy.
              <br />
              <b>With token</b> (also called Quote token) is the token you would
              denominate the rates in.
            </div>
          }
        />
      </div>
      <div className={'-space-y-15'}>
        <SelectTokenButton
          symbol={base?.symbol}
          imgUrl={base?.logoURI}
          address={base?.address}
          description="Buy or Sell"
          onClick={() => openTokenListModal(true)}
          isBaseToken
        />
        {!!base && (
          <>
            <div
              className={
                'relative z-10 mx-auto flex h-40 w-40 items-center justify-center rounded-full border-[5px] border border-silver bg-black'
              }
            >
              <IconArrow
                onClick={() => {
                  if (base && quote) {
                    sendEvent('strategy', 'strategy_token_swap', {
                      tokenPairFrom: `${base.symbol}/${quote.symbol}`,
                      tokenPair: `${quote.symbol}/${base.symbol}`,
                    });
                    const temp = base;
                    setBase(quote);
                    setQuote(temp);
                  }
                }}
                className={`w-12 ${base && quote ? 'cursor-pointer' : ''}`}
              />
            </div>
            <SelectTokenButton
              symbol={quote?.symbol}
              imgUrl={quote?.logoURI}
              address={quote?.address}
              description={'With'}
              onClick={() => openTokenListModal()}
            />
          </>
        )}
      </div>
    </m.div>
  );
};
