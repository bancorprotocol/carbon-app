import { Dispatch, FC, SetStateAction } from 'react';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { SelectTokenButton } from 'components/common/selectToken';
import { ReactComponent as IconArrow } from 'assets/icons/arrowDown.svg';
import { Token } from 'libs/tokens';
import { useModal } from 'hooks/useModal';
import { StrategyInputDispatch } from 'hooks/useStrategyInput';

interface Props {
  base: Token | undefined;
  quote: Token | undefined;
  dispatch: StrategyInputDispatch;
  setInitBuyRange: Dispatch<SetStateAction<boolean>>;
  setInitSellRange: Dispatch<SetStateAction<boolean>>;
}

export const SimInputTokenSelection: FC<Props> = ({
  base,
  quote,
  dispatch,
  setInitBuyRange,
  setInitSellRange,
}) => {
  const { openModal } = useModal();

  const swapTokens = () => {
    if (base && quote) {
      dispatch('baseToken', quote.address);
      dispatch('quoteToken', base.address);
    }
  };

  return (
    <section
      className="bg-secondary rounded-10 p-16"
      key="simulatorTokenSelection"
    >
      <header className="mb-16 flex items-center justify-between">
        <h2 className="m-0 text-18 font-weight-500">Token Pair</h2>
        <Tooltip
          iconClassName="h-18 w-18 text-white/60"
          element={<div>TBD</div>}
        />
      </header>
      <article className="flex flex-row items-center -space-x-10 font-weight-500">
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
          className="h-[50px] w-full pl-10 pr-20"
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
          className="relative z-10 grid h-40 w-40 flex-shrink-0 -rotate-90 place-items-center rounded-full border-[5px] border-silver bg-black"
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
          className="h-[50px] w-full pl-16 pr-16"
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
    </section>
  );
};
