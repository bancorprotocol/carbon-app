type Props = {
  isBuy?: boolean;
  limit?: boolean;
};

export const BuySellPriceRangeIndicator = ({ isBuy, limit }: Props) => {
  const background = isBuy ? 'bg-buy' : 'bg-sell';
  return (
    <div
      className={`rounded-b-6 flex w-full justify-center bg-linear-to-t ${
        isBuy ? 'from-buy/10' : 'from-sell/10'
      }`}
    >
      <div className="flex items-end">
        <div className="flex flex-col items-center">
          <div className={`size-4 rounded-full ${background}`} />
          <div className={`h-16 w-2 ${background}`} />
        </div>
        {!limit && (
          <>
            <div
              className={`w-100 -mx-2 h-14 ${
                isBuy ? 'bg-buy/20' : 'bg-sell/20'
              }`}
            />
            <div className="flex flex-col items-center">
              <div className={`size-4 rounded-full ${background}`} />
              <div className={`h-16 w-2 ${background}`} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
