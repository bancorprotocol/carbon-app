export const NoLiquidity = () => {
  return (
    <div className="grid gap-8 border-gradient rounded-8 p-16">
      <h3 className="text-gradient text-16">
        Liquidity to spot trade this pair isn't available — yet.
      </h3>
      <p className="text-14">
        Create a different strategy - the built-in solver system fills your
        trades usings chain-wide liquidity.
      </p>
    </div>
  );
};
