export const NoLiquidity = () => {
  return (
    <div className="grid gap-8 border-gradient rounded-8 p-16">
      <h3 className="text-gradient text-16">
        Swapping at market price is not available - yet!
      </h3>
      <p className="text-14">
        Create a limit/range strategy and let the built-in solver find the best
        time to fill it using chain-wide liquidity
      </p>
    </div>
  );
};
