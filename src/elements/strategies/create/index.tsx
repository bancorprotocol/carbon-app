import { Button } from 'components/Button';

export const CreateStrategy = () => {
  return (
    <div className={'max-w-[514px] space-y-30'}>
      <div className={'bg-secondary rounded-18 p-20'}>
        <h2 className={'mb-20'}>Select Tokens</h2>

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
      </div>

      <div className={'bg-secondary space-y-20 rounded-18 p-20'}>
        <h2>Buy</h2>

        <div
          className={
            'bg-body flex items-center space-x-10 rounded-14 px-20 py-14'
          }
        >
          <div
            className={
              'bg-secondary flex h-30 w-30 flex-grow-0 items-center justify-center rounded-full'
            }
          >
            -
          </div>
          <div className={'flex-grow space-y-6 text-center'}>
            <div className={'text-12 text-success-500'}>DAI per LINK</div>
            <div className={'font-weight-500'}>100.000.56678</div>
          </div>
          <div
            className={
              'bg-secondary flex h-30 w-30 flex-grow-0 items-center justify-center rounded-full'
            }
          >
            +
          </div>
        </div>

        <div className={'bg-body h-[200px] rounded-14 p-20'}></div>

        <h2>Sell</h2>

        <div className={'flex space-x-4'}>
          <div
            className={
              'bg-body flex w-full items-center space-x-10 rounded-l-14 px-20 py-14'
            }
          >
            <div
              className={
                'bg-secondary flex h-30 w-30 flex-grow-0 items-center justify-center rounded-full'
              }
            >
              -
            </div>
            <div className={'flex-grow space-y-6 text-center'}>
              <div className={'text-12 text-error-500'}>DAI per LINK</div>
              <div className={'font-weight-500'}>100.000.56678</div>
            </div>
            <div
              className={
                'bg-secondary flex h-30 w-30 flex-grow-0 items-center justify-center rounded-full'
              }
            >
              +
            </div>
          </div>
          <div
            className={
              'bg-body flex w-full items-center space-x-10 rounded-r-14 px-20 py-14'
            }
          >
            <div
              className={
                'bg-secondary flex h-30 w-30 flex-grow-0 items-center justify-center rounded-full'
              }
            >
              -
            </div>
            <div className={'flex-grow space-y-6 text-center'}>
              <div className={'text-12 text-error-500'}>DAI per LINK</div>
              <div className={'font-weight-500'}>100.000.56678</div>
            </div>
            <div
              className={
                'bg-secondary flex h-30 w-30 flex-grow-0 items-center justify-center rounded-full'
              }
            >
              +
            </div>
          </div>
        </div>
      </div>

      <div className={'bg-secondary space-y-10 rounded-18 p-20'}>
        <h2 className={'mb-20'}>Budget</h2>

        <div className={'bg-body space-y-10 rounded-14 p-20'}>
          <div className={'flex items-center justify-between'}>
            <div
              className={
                'bg-secondary flex items-center space-x-6 rounded-full p-4 pr-20'
              }
            >
              <div className={'bg-body h-30 w-30 rounded-full'} />
              <div>DAI</div>
            </div>
            <div className={'text-22'}>100.000.000</div>
          </div>
          <div className={'flex items-center justify-between'}>
            <div className={'text-secondary text-12'}>
              Balance: 100.000.000 (MAX)
            </div>
            <div className={'text-secondary text-12'}>$100.000.000</div>
          </div>
        </div>
        <div className={'bg-body space-y-10 rounded-14 p-20'}>
          <div className={'flex items-center justify-between'}>
            <div
              className={
                'bg-secondary flex items-center space-x-6 rounded-full p-4 pr-20'
              }
            >
              <div className={'bg-body h-30 w-30 rounded-full'} />
              <div>DAI</div>
            </div>
            <div className={'text-22'}>100.000.000</div>
          </div>
          <div className={'flex items-center justify-between'}>
            <div className={'text-secondary text-12'}>
              Balance: 100.000.000 (MAX)
            </div>
            <div className={'text-secondary text-12'}>$100.000.000</div>
          </div>
        </div>
      </div>

      <Button variant={'secondary'} size={'lg'} fullWidth>
        Confirm Strategy
      </Button>
    </div>
  );
};
