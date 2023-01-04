type Props = {
  buy?: boolean;
  limit?: boolean;
};

export const BuySellPriceRangeIndicator = ({ buy, limit }: Props) => {
  return (
    <div
      className={`flex w-full justify-center rounded-b-6 bg-gradient-to-t ${
        buy ? 'from-success-500/10' : 'from-error-500/10'
      }`}
    >
      <div className={'flex items-end'}>
        <div className={'flex flex-col items-center'}>
          <div
            className={`h-4 w-4 rounded-full ${
              buy ? 'bg-success-500' : 'bg-error-500'
            }`}
          />
          <div
            className={`h-16 w-2 ${buy ? 'bg-success-500' : 'bg-error-500'}`}
          />
        </div>
        {!limit && (
          <>
            <div
              className={`-mx-2 h-14 w-100 ${
                buy ? 'bg-success-500/20' : 'bg-error-500/20'
              }`}
            />
            <div className={'flex flex-col items-center'}>
              <div
                className={`h-4 w-4 rounded-full ${
                  buy ? 'bg-success-500' : 'bg-error-500'
                }`}
              />
              <div
                className={`h-16 w-2 ${
                  buy ? 'bg-success-500' : 'bg-error-500'
                }`}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
