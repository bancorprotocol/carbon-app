import { Token } from 'libs/tokens';
import { useDuplicateStrategy } from 'components/strategies/create/useDuplicateStrategy';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';

export type NotEnoughLiquidityProps = {
  source: Token;
  target: Token;
};

export const NotEnoughLiquidity = ({
  source,
  target,
}: NotEnoughLiquidityProps) => {
  const { duplicate } = useDuplicateStrategy();

  return (
    <div className="t-grey mt-5 min-h-[228px] flex-1">
      <div
        className={`border-error/100 flex h-full flex-col
          items-center justify-center rounded-12 border px-[4rem] text-center text-14 font-weight-400`}
      >
        <div className="bg-error/10 mb-16 flex flex h-38 w-38 items-center justify-center rounded-full">
          <IconWarning className="fill-error/100 h-16 w-16" />
        </div>
        <div className="mb-8 font-weight-500">No Liquidity Available</div>
        <div>No available orders at this moment.</div>
        <div>
          {`You can `}
          <span
            onClick={() => duplicate({ base: source, quote: target })}
            className="cursor-pointer font-weight-500"
          >
            Create a Strategy.
          </span>
        </div>
      </div>
    </div>
  );
};
