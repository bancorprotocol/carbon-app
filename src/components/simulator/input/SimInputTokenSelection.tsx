import { useNavigate } from '@tanstack/react-router';
import { useTokens } from 'hooks/useTokens';
import { FC } from 'react';
import { SelectTokenButton } from 'components/common/selectToken';
import { ReactComponent as IconArrow } from 'assets/icons/arrowDown.svg';
import { useModal } from 'hooks/useModal';
import { Warning } from 'components/common/WarningMessageWithIcon';
import { cn } from 'utils/helpers';

interface Props {
  base?: string;
  quote?: string;
  noPriceHistory: boolean;
}

export const SimInputTokenSelection: FC<Props> = (props) => {
  const navigate = useNavigate({ from: '/simulate' });
  const { openModal } = useModal();
  const { getTokenById } = useTokens();
  const base = getTokenById(props.base);
  const quote = getTokenById(props.quote);

  const invertTokens = () => {
    navigate({
      search: (s) => ({
        base: s.quote,
        quote: s.base,
        start: s.start,
        end: s.end,
      }),
    });
  };

  return (
    <section className="grid gap-16 p-16" key="simulatorTokenSelection">
      <article className="font-medium flex flex-row items-center -space-x-10">
        <SelectTokenButton
          chevronClassName="h-7.5 w-13"
          token={base}
          description={
            <span
              className={`${base ? 'text-white/60' : 'text-black'} font-medium`}
            >
              Buy or Sell
            </span>
          }
          className={cn(
            'h-[50px] flex-1 pl-10 pr-20',
            props.noPriceHistory &&
              'outline-warning outline-solid outline-2 md:outline-hidden',
          )}
          onClick={() => {
            openModal('tokenLists', {
              onClick: (token) => {
                navigate({
                  search: { base: token.address, quote: props.quote },
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
          className="border-background-900 hover:bg-background-800 relative z-10 grid h-40 w-40 flex-shrink-0 -rotate-90 place-items-center rounded-full border-[5px] bg-black-gradient"
          onClick={invertTokens}
          disabled={!base || !quote}
        >
          <IconArrow className="h-10.8 w-12" />
        </button>
        <SelectTokenButton
          chevronClassName="h-7.5 w-13"
          token={quote}
          description={
            <span
              className={`${
                quote ? 'text-white/60' : 'text-black'
              } font-medium`}
            >
              With
            </span>
          }
          className={cn(
            'h-[50px] flex-1 pl-16 pr-16',
            props.noPriceHistory &&
              'outline-warning outline-solid outline-2 md:outline-hidden',
          )}
          onClick={() => {
            openModal('tokenLists', {
              onClick: (token) => {
                navigate({
                  search: { base: props.base, quote: token.address },
                  params: {},
                });
              },
              excludedTokens: [base?.address ?? ''],
              isBaseToken: false,
            });
          }}
        />
      </article>
      {props.noPriceHistory && (
        <Warning className="font-medium md:hidden">
          The pair lacks price data and cannot be simulated
        </Warning>
      )}
    </section>
  );
};
