import { Button } from 'components/Button';
import { m, Variants } from 'motion';
import { useCreate } from './useCreateStrategy';
import { AmountInputWithButtons } from 'components/AmountInputWithButtons';
import { SelectTokens } from 'components/SelectTokens';
import { BudgetBlock } from 'components/BudgetBlock';
import { ReactComponent as IconChevron } from 'assets/icons/chevron.svg';
import { useLocation } from 'routing';
import { Tooltip } from 'components/Tooltip';

export const CreateStrategy = () => {
  const { source, target, onCTAClick, openTokenListModal, showStep2 } =
    useCreate();
  const location = useLocation();

  return (
    <m.div
      className={'space-y-30'}
      variants={list}
      initial={'hidden'}
      animate={'visible'}
    >
      <div className="flex items-center gap-16 text-24">
        <button
          onClick={() => location.history.back()}
          className="h-40 w-40 rounded-full bg-emphasis"
        >
          <IconChevron className="mx-auto w-14 rotate-90" />
        </button>
        Create Strategy
      </div>
      <m.div variants={items} className={'bg-secondary rounded-18 p-20'}>
        <div className="mb-20 flex items-center justify-between">
          <h2>Token Pair</h2>
          <Tooltip>??????????</Tooltip>
        </div>

        <SelectTokens
          symbol0={source.token?.symbol}
          symbol1={target.token?.symbol}
          imgUrl0={source.token?.logoURI}
          imgUrl1={target.token?.logoURI}
          onClick0={() => openTokenListModal('source')}
          onClick1={() => openTokenListModal('target')}
        />
      </m.div>
      {showStep2 && (
        <>
          <m.div
            variants={items}
            className={'bg-secondary space-y-20 rounded-18 p-20'}
          >
            <h2>Buy</h2>

            <div className={'flex space-x-4'}>
              <div className={'bg-body rounded-l-14 px-20 py-14'}>
                <AmountInputWithButtons
                  label={`${source.token?.symbol} for ${target.token?.symbol}`}
                  amount={source.low}
                  setAmount={source.setLow}
                />
              </div>
              <div className={'bg-body rounded-r-14 px-20 py-14'}>
                <AmountInputWithButtons
                  label={`${source.token?.symbol} for ${target.token?.symbol}`}
                  amount={source.high}
                  setAmount={source.setHigh}
                />
              </div>
            </div>

            <h2>Sell</h2>

            <div className={'flex space-x-4'}>
              <div className={'bg-body rounded-l-14 px-20 py-14'}>
                <AmountInputWithButtons
                  label={`${target.token?.symbol} for ${source.token?.symbol}`}
                  amount={target.low}
                  setAmount={target.setLow}
                />
              </div>
              <div className={'bg-body rounded-r-14 px-20 py-14'}>
                <AmountInputWithButtons
                  label={`${target.token?.symbol} for ${source.token?.symbol}`}
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
              symbol={source.token?.symbol}
              logoURI={source.token?.logoURI}
              amount={source.liquidity}
              setAmount={source.setLiquidity}
              balance={source.balanceQuery.data}
              isBalanceLoading={source.balanceQuery.isLoading}
            />
            <BudgetBlock
              symbol={target.token?.symbol}
              logoURI={target.token?.logoURI}
              amount={target.liquidity}
              setAmount={target.setLiquidity}
              balance={target.balanceQuery.data}
              isBalanceLoading={target.balanceQuery.isLoading}
            />
          </m.div>

          <m.div variants={items}>
            <Button
              variant={'secondary'}
              size={'lg'}
              fullWidth
              onClick={onCTAClick}
            >
              Confirm Strategy
            </Button>
          </m.div>
        </>
      )}
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
