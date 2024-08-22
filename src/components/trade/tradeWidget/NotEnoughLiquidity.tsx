import { Token } from 'libs/tokens';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { useNavigate } from 'libs/routing';

export type NotEnoughLiquidityProps = {
  source: Token;
  target: Token;
};

export const NotEnoughLiquidity = ({
  source,
  target,
}: NotEnoughLiquidityProps) => {
  const navigate = useNavigate();
  const duplicate = () => {
    const search = { base: source.address, quote: target.address };
    navigate({ to: '/trade/disposable', search });
  };

  return (
    <div className="t-grey mt-5 min-h-[228px] flex-1">
      <div
        className={`rounded-12 border-error/100 text-14 font-weight-400
          flex h-full flex-col items-center justify-center border px-[4rem] text-center`}
      >
        <div className="size-38 bg-error/10 mb-16 flex items-center justify-center rounded-full">
          <IconWarning className="fill-error/100 size-16" />
        </div>
        <h2 className="font-weight-500 mb-8">No Liquidity Available</h2>
        <p>
          Looks like there isn't sufficient liquidity to execute your trade, but
          don't worry, here's a pro tip:
          <br />
          Set your own price with a limit/range order and the built-in solver
          system will search chain-wide liquidity to help efficiently fill you
          order, all while you enjoy MEV sandwich attack resistance, zero
          slippage, and zero fees!
        </p>
        <div>
          You can&nbsp;
          <span
            onClick={() => duplicate()}
            className="font-weight-500 cursor-pointer"
          >
            Create a Strategy.
          </span>
        </div>
      </div>
    </div>
  );
};
