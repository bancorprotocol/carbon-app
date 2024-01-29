import { SimulatorSearch } from 'libs/routing';
import { FC } from 'react';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { SelectTokenButton } from 'components/common/selectToken';
import { ReactComponent as IconArrow } from 'assets/icons/arrowDown.svg';
import { Token } from 'libs/tokens';
import { useModal } from 'hooks/useModal';

interface Props {
  base: Token | undefined;
  quote: Token | undefined;
  setBaseToken: React.Dispatch<React.SetStateAction<Token | undefined>>;
  setQuoteToken: React.Dispatch<React.SetStateAction<Token | undefined>>;
  params: SimulatorSearch;
  setParams: React.Dispatch<React.SetStateAction<SimulatorSearch>>;
}

export const SimulatorTokenSelection: FC<Props> = ({
  base,
  quote,
  setBaseToken,
  setQuoteToken,
  params,
  setParams,
}) => {
  const { openModal } = useModal();

  const swapTokens = () => {
    if (base && quote) {
      setBaseToken(quote);
      setQuoteToken(base);
      setParams({
        ...params,
        baseToken: quote.address,
        quoteToken: base.address,
      });
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
                base ? 'text-white/30' : 'text-black'
              } font-weight-500`}
            >
              Buy or Sell
            </span>
          }
          className="h-[50px] w-full pl-10 pr-20"
          onClick={() => {
            openModal('tokenLists', {
              onClick: (token) => {
                setBaseToken(token);
                setParams({ ...params, baseToken: token.address });
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
                quote ? 'text-white/30' : 'text-black'
              } font-weight-500`}
            >
              With
            </span>
          }
          className="h-[50px] w-full pl-16 pr-16"
          onClick={() => {
            openModal('tokenLists', {
              onClick: (token) => {
                setQuoteToken(token);
                setParams({ ...params, quoteToken: token.address });
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
