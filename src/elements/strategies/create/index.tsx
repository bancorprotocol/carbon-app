import { Button } from 'components/Button';
import { m, Variants } from 'motion';
import { useCreate } from './useCreateStrategy';
import { AmountInputWithButtons } from 'components/AmountInputWithButtons';
import { SelectTokens } from 'components/SelectTokens';
import { BudgetBlock } from 'components/BudgetBlock';
import { useEffect } from 'react';

export interface Token {
  address: string;
  decimals: number;
  symbol: string;
}

export const CreateStrategy = () => {
  const { source, target, create, txBusy } = useCreate();

  useEffect(() => {
    console.log('effect');
    source.setToken({
      address: '0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C',
      decimals: 18,
      symbol: 'BNT',
    });
    target.setToken({
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      decimals: 6,
      symbol: 'USDC',
    });
  }, [source, target]);

  return (
    <m.div
      className={'space-y-30'}
      variants={list}
      initial={'hidden'}
      animate={'visible'}
    >
      <m.div variants={items} className={'bg-secondary rounded-18 p-20'}>
        <h2 className={'mb-20'}>Select Tokens</h2>

        <SelectTokens />
      </m.div>

      <m.div
        variants={items}
        className={'bg-secondary space-y-20 rounded-18 p-20'}
      >
        <h2>Buy</h2>

        <div className={'flex space-x-4'}>
          <div className={'bg-body rounded-l-14 px-20 py-14'}>
            <AmountInputWithButtons
              label={'TKN for TKN'}
              amount={source.low}
              setAmount={source.setLow}
            />
          </div>
          <div className={'bg-body rounded-r-14 px-20 py-14'}>
            <AmountInputWithButtons
              label={'TKN for TKN'}
              amount={source.high}
              setAmount={source.setHigh}
            />
          </div>
        </div>

        <div className={'bg-body h-[200px] rounded-14 p-20'}></div>

        <h2>Sell</h2>

        <div className={'flex space-x-4'}>
          <div className={'bg-body rounded-l-14 px-20 py-14'}>
            <AmountInputWithButtons
              label={'TKN for TKN'}
              amount={target.low}
              setAmount={target.setLow}
            />
          </div>
          <div className={'bg-body rounded-r-14 px-20 py-14'}>
            <AmountInputWithButtons
              label={'TKN for TKN'}
              amount={target.high}
              setAmount={target.setHigh}
            />
          </div>
        </div>
      </m.div>

      <m.div
        variants={items}
        className={'bg-secondary space-y-10 rounded-18 p-20'}
      >
        <h2 className={'mb-20'}>Budget</h2>

        <BudgetBlock
          amount={source.liquidity}
          setAmount={source.setLiquidity}
        />
        <BudgetBlock
          amount={target.liquidity}
          setAmount={target.setLiquidity}
        />
      </m.div>

      <div>{txBusy ? 'true' : 'false'}</div>

      <m.div variants={items}>
        <Button variant={'secondary'} size={'lg'} fullWidth onClick={create}>
          Confirm Strategy
        </Button>
      </m.div>
    </m.div>
  );
};

const list: Variants = {
  visible: {
    opacity: 1,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.1,
    },
  },
  hidden: {
    transition: {
      when: 'afterChildren',
    },
    opacity: 0,
  },
};

const items: Variants = {
  visible: {
    opacity: 1,
    scale: 1,
  },
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
};
