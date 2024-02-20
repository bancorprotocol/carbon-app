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
    navigate({ to: '/strategies/create', search });
  };

  return (
    <div className="t-grey mt-5 min-h-[228px] flex-1">
      <div
        className={`flex h-full flex-col items-center
          justify-center rounded-12 border border-error/100 px-[4rem] text-center text-14 font-weight-400`}
      >
        <div className="mb-16 flex flex h-38 w-38 items-center justify-center rounded-full bg-error/10">
          <IconWarning className="h-16 w-16 fill-error/100" />
        </div>
        <div className="mb-8 font-weight-500">No Liquidity Available</div>
        <div>No available orders at this moment.</div>
        <div>
          You can&nbsp;
          <span
            onClick={() => duplicate()}
            className="cursor-pointer font-weight-500"
          >
            Create a Strategy.
          </span>
        </div>
      </div>
    </div>
  );
};
