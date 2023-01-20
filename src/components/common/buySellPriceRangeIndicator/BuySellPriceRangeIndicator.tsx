type Props = {
  buy?: boolean;
  limit?: boolean;
};

export const BuySellPriceRangeIndicator = ({ buy, limit }: Props) => {
  return (
    <div
      className={`flex w-full justify-center rounded-b-6 bg-gradient-to-t ${
        buy ? 'from-green/10' : 'from-red/10'
      }`}
    >
      <div className={'flex items-end'}>
        <div className={'flex flex-col items-center'}>
          <div
            className={`h-4 w-4 rounded-full ${buy ? 'bg-green' : 'bg-red'}`}
          />
          <div className={`h-16 w-2 ${buy ? 'bg-green' : 'bg-red'}`} />
        </div>
        {!limit && (
          <>
            <div
              className={`-mx-2 h-14 w-100 ${
                buy ? 'bg-green/20' : 'bg-red/20'
              }`}
            />
            <div className={'flex flex-col items-center'}>
              <div
                className={`h-4 w-4 rounded-full ${
                  buy ? 'bg-green' : 'bg-red'
                }`}
              />
              <div className={`h-16 w-2 ${buy ? 'bg-green' : 'bg-red'}`} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
