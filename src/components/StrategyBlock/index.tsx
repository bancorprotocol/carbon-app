export const StrategyBlock = () => {
  return (
    <div className="bg-content space-y-20 rounded-10 p-20">
      <div className={'flex space-x-20'}>
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-secondary flex w-full items-center space-x-10 rounded-12 p-10"
          >
            <div
              className={'h-40 w-40 rounded-full bg-lightGrey dark:bg-darkGrey'}
            />
            <div>
              <div>TKN</div>
              <div className="text-secondary">????????</div>
            </div>
          </div>
        ))}
      </div>
      {[1, 2].map((i) => (
        <div key={i} className="bg-secondary relative rounded-12 p-10">
          <div className={'absolute right-20 top-0 flex h-full items-center'}>
            <div
              className={
                'rounded-full bg-primary-500/20 px-16 py-3 text-primary-400'
              }
            >
              Simple
            </div>
          </div>
          <div className="text-secondary">Sell 1 TKN for</div>
          <div>100,000,000 TKN</div>
        </div>
      ))}
    </div>
  );
};
