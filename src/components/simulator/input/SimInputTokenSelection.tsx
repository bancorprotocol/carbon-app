import { useNavigate } from '@tanstack/react-router';
import { useTokens } from 'hooks/useTokens';
import { FC } from 'react';
import { SelectTokenButton } from 'components/common/selectToken';
import { ReactComponent as IconArrow } from 'assets/icons/arrowDown.svg';
import { useModal } from 'hooks/useModal';

interface Props {
  baseToken?: string;
  quoteToken?: string;
}

export const SimInputTokenSelection: FC<Props> = ({
  baseToken,
  quoteToken,
}) => {
  const navigate = useNavigate({ from: '/simulate' });
  const { openModal } = useModal();
  const { getTokenById } = useTokens();
  const base = getTokenById(baseToken);
  const quote = getTokenById(quoteToken);

  return (
    <section className="grid gap-16 p-16" key="simulatorTokenSelection">
      <article className="font-weight-500 flex flex-row items-center -space-x-10">
        <SelectTokenButton
          chevronClassName="h-7.5 w-13"
          token={base}
          description={
            <span
              className={`${
                base ? 'text-white/60' : 'text-black'
              } font-weight-500`}
            >
              Buy or Sell
            </span>
          }
          className="h-[50px] flex-1 pl-10 pr-20"
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
          className="border-background-900 hover:bg-background-800 relative z-10 grid h-40 w-40 flex-shrink-0 -rotate-90 place-items-center rounded-full border-[5px] bg-black"
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
          token={quote}
          description={
            <span
              className={`${
                quote ? 'text-white/60' : 'text-black'
              } font-weight-500`}
            >
              With
            </span>
          }
          className="h-[50px] flex-1 pl-16 pr-16"
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
    </section>
  );
};
