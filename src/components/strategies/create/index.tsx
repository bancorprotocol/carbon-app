import { Button } from 'components/common/button';
import { m, Variants } from 'libs/motion';
import { useCreate } from './useCreateStrategy';
import { BuySellBlock } from 'components/strategies/create/BuySellBlock';
import { ReactComponent as IconChevron } from 'assets/icons/chevron.svg';
import { ReactComponent as IconArrow } from 'assets/icons/arrowDown.svg';
import { useLocation } from 'libs/routing';
import { Tooltip } from 'components/common/tooltip';
import { NameBlock } from './NameBlock';
import { SelectTokenButton } from 'components/common/selectToken';

export const CreateStrategy = () => {
  const location = useLocation();

  const {
    token0,
    token1,
    order0,
    order1,
    name,
    setName,
    createStrategy,
    openTokenListModal,
    showStep2,
    isCTAdisabled,
    token0BalanceQuery,
    token1BalanceQuery,
  } = useCreate();

  return (
    <m.div
      className={'space-y-20'}
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
      <m.div variants={items} className={'bg-secondary rounded-10 p-20'}>
        <div className="mb-14 flex items-center justify-between">
          <h2>Token Pair</h2>
          <Tooltip>
            Selecting the tokens you would like to create a strategy for. The
            Base token represents how much of the Quoted token is needed for you
            to get one unit of the Base token (i.e. 1 Base token = xxx Quote
            token).
          </Tooltip>
        </div>

        <div className={'-space-y-15'}>
          <SelectTokenButton
            symbol={token0?.symbol}
            imgUrl={token0?.logoURI}
            description={'Buy or Sell'}
            onClick={() => openTokenListModal(true)}
          />
          {!!token0 && (
            <>
              <div
                className={
                  'relative z-10 mx-auto flex h-40 w-40 items-center justify-center rounded-full border-[5px] border border-silver bg-black'
                }
              >
                <IconArrow className={'w-12'} />
              </div>
              <SelectTokenButton
                symbol={token1?.symbol}
                imgUrl={token1?.logoURI}
                description={'With'}
                onClick={() => openTokenListModal()}
              />
            </>
          )}
        </div>
      </m.div>
      {showStep2 && (
        <>
          <m.div variants={items}>
            <BuySellBlock
              token0={token0!}
              token1={token1!}
              order={order0}
              buy
              tokenBalanceQuery={token1BalanceQuery}
            />
          </m.div>

          <m.div variants={items}>
            <BuySellBlock
              token0={token0!}
              token1={token1!}
              order={order1}
              tokenBalanceQuery={token0BalanceQuery}
            />
          </m.div>

          <m.div variants={items}>
            <NameBlock name={name} setName={setName} />
          </m.div>

          <m.div variants={items}>
            <Button
              className="mb-80"
              variant={'success'}
              size={'lg'}
              fullWidth
              onClick={createStrategy}
              disabled={isCTAdisabled}
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
