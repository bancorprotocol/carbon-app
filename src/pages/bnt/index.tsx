import { Button } from 'components/Button';

export const BntPage = () => {
  const selectedIndex = 2; //some calc
  const selectedStyle = (index: number) =>
    index === selectedIndex && 'text-black dark:text-white';

  return (
    <div className="mx-auto grid max-w-[900px] gap-70 p-10 md:grid-cols-2">
      <div className="text-secondary flex max-w-[365px] flex-col gap-30">
        <div className="text-30 text-black dark:text-white">Stake BNT</div>
        Stake BNT and get a reduced network fee and get a vote in the BancorDAO
        <div className="flex flex-col gap-5">
          <div className={`${selectedStyle(0)}`}>1. 10,000 BNT get 10% off</div>
          <div className={`${selectedStyle(1)}`}>
            2. 100,000 BNT get 20% off
          </div>
          <div className={`${selectedStyle(2)}`}>
            3. 1,000,000 BNT get 30% off
          </div>
          <div className={`${selectedStyle(3)}`}>
            4. 10,000,000 BNT get 40% off
          </div>
        </div>
      </div>
      <div className="max-w-[400px]">
        <div className="mb-10 rounded-10 p-30 dark:bg-charcoal">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-secondary">Available to Stake</div>
              100000000 BNT
            </div>
            <Button variant={'secondary'}>Stake</Button>
          </div>
          <hr className="border-grey my-30 dark:border-darkGrey" />
          <div className="flex items-center justify-between">
            <div>
              <div className="text-secondary">Staked Balance</div>
              100000000 BNT
            </div>
            <Button variant={'tertiary'}>Withdraw</Button>
          </div>
        </div>

        <div className="text-secondary border-grey flex justify-between rounded-10 border p-30 dark:border-darkGrey">
          <div className="max-w-[232px]">
            <div className="text-20 text-black dark:text-white">Vote</div>
            Make a difference and help shape the future of the Bancor Protocol
            and it's product.
          </div>
          <Button variant={'tertiary'}>→</Button>
        </div>
      </div>
    </div>
  );
};
