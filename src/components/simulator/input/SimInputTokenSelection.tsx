import { useNavigate } from '@tanstack/react-router';
import { useTokens } from 'hooks/useTokens';
import { FC } from 'react';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { SelectTokenButton } from 'components/common/selectToken';
import { ReactComponent as IconArrow } from 'assets/icons/arrowDown.svg';
import { useModal } from 'hooks/useModal';
import { WarningMessageWithIcon } from 'components/common/WarningMessageWithIcon';
import { cn } from 'utils/helpers';

interface Props {
  baseToken?: string;
  quoteToken?: string;
  noPriceHistory: boolean;
}

export const SimInputTokenSelection: FC<Props> = ({
  baseToken,
  quoteToken,
  noPriceHistory,
}) => {
  const navigate = useNavigate();
  const { openModal } = useModal();
  const { getTokenById } = useTokens();
  const base = getTokenById(baseToken);
  const quote = getTokenById(quoteToken);

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
                navigate({
                  search: { baseToken: token.address, quoteToken },
                  params: {},
                });
              },
              excludedTokens: [quote?.address ?? ''],
              isBaseToken: true,
            });
          }}
          isBaseToken
        />
        <button
          type="button"
          className="border-background-900 relative z-10 grid h-40 w-40 flex-shrink-0 -rotate-90 place-items-center rounded-full border-[5px] bg-black"
          onClick={() => {
            navigate({
              search: { baseToken: quoteToken, quoteToken: baseToken },
              params: {},
            });
          }}
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
                navigate({
                  search: { baseToken, quoteToken: token.address },
                  params: {},
                });
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
