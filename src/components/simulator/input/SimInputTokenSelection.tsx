import { Dispatch, FC, SetStateAction } from 'react';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { SelectTokenButton } from 'components/common/selectToken';
import { ReactComponent as IconArrow } from 'assets/icons/arrowDown.svg';
import { Token } from 'libs/tokens';
import { useModal } from 'hooks/useModal';
import { StrategyInputDispatch } from 'hooks/useStrategyInput';
import { WarningMessageWithIcon } from 'components/common/WarningMessageWithIcon';
import { cn } from 'utils/helpers';

interface Props {
  base: Token | undefined;
  quote: Token | undefined;
  noPriceHistory: boolean;
  dispatch: StrategyInputDispatch;
  setInitBuyRange: Dispatch<SetStateAction<boolean>>;
  setInitSellRange: Dispatch<SetStateAction<boolean>>;
}

export const SimInputTokenSelection: FC<Props> = ({
  base,
  quote,
  noPriceHistory,
  dispatch,
  setInitBuyRange,
  setInitSellRange,
}) => {
  const { openModal } = useModal();

  const swapTokens = () => {
    if (base && quote) {
      dispatch('baseToken', quote.address);
      dispatch('quoteToken', base.address);
      dispatch('buyMax', '');
      dispatch('buyMin', '');
      dispatch('sellMax', '');
      dispatch('sellMin', '');
      dispatch('buyBudget', '');
      dispatch('sellBudget', '');
      setInitBuyRange(true);
      setInitSellRange(true);
    }
  };

  return (
    <section
      className="rounded-10 bg-background-900 flex flex-col gap-16 p-16"
      key="simulatorTokenSelection"
    >
      <header className="flex items-center justify-between">
        <h2 className="text-18 font-weight-500 m-0">Token Pair</h2>
        <Tooltip
          iconClassName="size-18 text-white/60"
          element={
            <p>
              Selecting the tokens you would like to create a simulation for.
              <br />
              <b>Buy or Sell</b> token (also called <b>Base</b> token) is the
              token you would like to buy or sell in the strategy.
              <br />
              <b>With</b> token (also called <b>Quote</b> token) is the token
              you would denominate the rates in.
            </p>
          }
        />
      </header>
      <article className="font-weight-500 flex flex-row items-center -space-x-10">
        <SelectTokenButton
          chevronClassName="h-7.5 w-13"
          symbol={base?.symbol}
          imgUrl={base?.logoURI}
          description={
            <span
              className={`${
                base ? 'text-white/60' : 'text-black'
              } font-weight-500`}
            >
              Buy or Sell
            </span>
          }
          className={cn(
            'h-[50px] flex-1 pl-10 pr-20',
            noPriceHistory && 'border-warning border-2'
          )}
          onClick={() => {
            openModal('tokenLists', {
              onClick: (token) => {
                dispatch('baseToken', token.address);
                dispatch('buyMax', '');
                dispatch('buyMin', '');
                dispatch('sellMax', '');
                dispatch('sellMin', '');
                dispatch('buyBudget', '');
                dispatch('sellBudget', '');
                setInitBuyRange(true);
                setInitSellRange(true);
              },
              excludedTokens: [quote?.address ?? ''],
              isBaseToken: true,
            });
          }}
          isBaseToken
        />
        <button
          type="button"
          className="border-background-900 relative z-10 grid size-40 flex-shrink-0 -rotate-90 place-items-center rounded-full border-[5px] bg-black"
          onClick={swapTokens}
          disabled={!base || !quote}
        >
          <IconArrow className="h-10.8 w-12" />
        </button>
        <SelectTokenButton
          chevronClassName="h-7.5 w-13"
          symbol={quote?.symbol}
          imgUrl={quote?.logoURI}
          description={
            <span
              className={`${
                quote ? 'text-white/60' : 'text-black'
              } font-weight-500`}
            >
              With
            </span>
          }
          className={cn(
            'h-[50px] flex-1 pl-16 pr-16',
            noPriceHistory && 'border-warning border-2'
          )}
          onClick={() => {
            openModal('tokenLists', {
              onClick: (token) => {
                dispatch('quoteToken', token.address);
                dispatch('buyMax', '');
                dispatch('buyMin', '');
                dispatch('sellMax', '');
                dispatch('sellMin', '');
                dispatch('buyBudget', '');
                dispatch('sellBudget', '');
                setInitBuyRange(true);
                setInitSellRange(true);
              },
              excludedTokens: [base?.address ?? ''],
              isBaseToken: false,
            });
          }}
        />
      </article>
      {noPriceHistory && (
        <WarningMessageWithIcon className="font-weight-500">
          The pair lacks price history and cannot be simulated.
        </WarningMessageWithIcon>
      )}
    </section>
  );
};
