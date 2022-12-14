import { Button } from 'components/Button';
import { m, Variants } from 'motion';
import { useCreate } from './useCreateStrategy';
import { SelectTokens } from 'components/SelectTokens';
import { BuySellBlock } from 'components/BuySellBlock';
import { ReactComponent as IconChevron } from 'assets/icons/chevron.svg';
import { useLocation } from 'routing';
import { Tooltip } from 'components/Tooltip';
import { FC } from 'react';

export const CreateStrategy = () => {
  const {
    source,
    target,
    name,
    setName,
    onCTAClick,
    openTokenListModal,
    showStep2,
  } = useCreate();
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
      {showStep2 && source.token && target.token && (
        <>
          <m.div variants={items}>
            <BuySellBlock
              title="Buy"
              buyToken={source.token}
              sellToken={target.token}
              balance={source.balanceQuery.data}
              isBalanceLoading={source.balanceQuery.isLoading}
              price={source.price}
              setPrice={source.setPrice}
              budget={source.budget}
              setBudget={source.setBudget}
              min={source.min}
              setMin={source.setMin}
              max={source.max}
              setMax={source.setMax}
            />
          </m.div>

          <m.div variants={items}>
            <BuySellBlock
              title="Sell"
              buyToken={source.token}
              sellToken={target.token}
              balance={target.balanceQuery.data}
              isBalanceLoading={target.balanceQuery.isLoading}
              price={target.price}
              setPrice={target.setPrice}
              budget={target.budget}
              setBudget={target.setBudget}
              min={target.min}
              setMin={target.setMin}
              max={target.max}
              setMax={target.setMax}
            />
          </m.div>

          <m.div variants={items}>
            <NameBlock name={name} setName={setName} />
          </m.div>

          <m.div variants={items}>
            <Button
              variant={'secondary'}
              size={'lg'}
              fullWidth
              onClick={onCTAClick}
            >
              Create Strategy
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

export const NameBlock: FC<{
  name: string;
  setName: (value: string) => void;
}> = ({ name, setName }) => {
  return (
    <div className={'bg-secondary space-y-10 rounded-18 p-20'}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8 text-18">
          Strategy Name
          <div className="text-secondary">Optional</div>
        </div>

        <Tooltip>??????</Tooltip>
      </div>

      <div className="bg-body rounded-14 p-16">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Eg. Carbon Strategy"
          className={'mb-8 w-full bg-transparent focus:outline-none'}
        />
        <div className="text-secondary !text-10">32 Characters Max</div>
      </div>
    </div>
  );
};
