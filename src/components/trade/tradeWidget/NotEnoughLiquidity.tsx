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
    navigate({ to: '/trade/activity/type', search });
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
        <div className="font-weight-500 mb-8">No Liquidity Available</div>
        <div>No available orders at this moment.</div>
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
