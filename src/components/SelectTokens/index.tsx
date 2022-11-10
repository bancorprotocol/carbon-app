export const SelectTokens = () => {
  return (
    <div className={'flex items-center justify-between'}>
      <div
        className={
          'bg-body -mr-13 flex flex-grow items-center space-x-10 rounded-l-14 px-20 py-10'
        }
      >
        <div className={'bg-secondary h-30 w-30 rounded-full'} />
        <div className={'text-20 font-weight-500'}>TKN</div>
      </div>
      <div
        className={
          'bg-secondary z-20 flex h-30 w-30 flex-grow-0 items-center justify-center rounded-full'
        }
      >
        {'->'}
      </div>
      <div
        className={
          'bg-body -ml-13 flex flex-grow items-center space-x-10 rounded-r-14 px-20 py-10'
        }
      >
        <div className={'bg-secondary h-30 w-30 rounded-full'} />
        <div className={'text-20 font-weight-500'}>TKN</div>
      </div>
    </div>
  );
};
