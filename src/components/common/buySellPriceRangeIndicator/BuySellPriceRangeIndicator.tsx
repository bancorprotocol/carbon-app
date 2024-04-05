type Props = {
  buy?: boolean;
  limit?: boolean;
};

export const BuySellPriceRangeIndicator = ({ buy, limit }: Props) => {
  const background = buy ? 'bg-buy' : 'bg-sell';
  return (
    <div
      className={`flex w-full justify-center rounded-b-6 bg-gradient-to-t ${
        buy ? 'from-buy/10' : 'from-sell/10'
      }`}
    >
      <div className={'flex items-end'}>
        <div className={'flex flex-col items-center'}>
          <div className={`h-4 w-4 rounded-full ${background}`} />
          <div className={`h-16 w-2 ${background}`} />
        </div>
        {!limit && (
          <>
            <div
              className={`-mx-2 h-14 w-100 ${buy ? 'bg-buy/20' : 'bg-sell/20'}`}
            />
            <div className={'flex flex-col items-center'}>
              <div className={`h-4 w-4 rounded-full ${background}`} />
              <div className={`h-16 w-2 ${background}`} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
