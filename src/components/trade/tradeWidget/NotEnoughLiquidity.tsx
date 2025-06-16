import { Token } from 'libs/tokens';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { useNavigate } from 'libs/routing';
import { QueryObserverSuccessResult } from '@tanstack/react-query';

export type NotEnoughLiquidityProps = {
  source: Token;
  target: Token;
  query: QueryObserverSuccessResult<string>;
};

export const NotEnoughLiquidity = ({
  source,
  target,
  query,
}: NotEnoughLiquidityProps) => {
  const navigate = useNavigate();
  const duplicate = () => {
    const search = { base: source.address, quote: target.address };
    navigate({ to: '/trade', search });
  };

  return (
    <article className="t-grey mt-5 min-h-[228px] flex-1">
      <div className="rounded-12 border-error/100 text-14 font-weight-400 grid gap-8 place-items-center border px-[4rem] text-center p-16">
        <div className="size-38 bg-error/10 mb-16 flex items-center justify-center rounded-full">
          <IconWarning className="fill-error/100 size-16" />
        </div>
        <h2 className="font-weight-500 text-14 mb-8">No Liquidity Available</h2>
        <p>
          No available orders at this moment.
          <br />
          You can&nbsp;
          <button
            type="button"
            onClick={() => duplicate()}
            className="font-weight-500 cursor-pointer"
          >
            Create a Strategy.
          </button>
        </p>
        <button type="button" onClick={() => query.refetch()}>
          Refresh
        </button>
      </div>
    </article>
  );
};
