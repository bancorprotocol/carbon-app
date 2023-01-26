import { Button } from 'components/common/button';
import { m, Variants } from 'libs/motion';
import { useCreate } from './useCreateStrategy';
import { BuySellBlock } from 'components/strategies/create/BuySellBlock';
import { ReactComponent as IconChevron } from 'assets/icons/chevron.svg';
import { useLocation, useNavigate } from 'libs/routing';
import { Tooltip } from 'components/common/tooltip';
import { NameBlock } from './NameBlock';
import { SelectTokenButton } from 'components/common/selectToken';
import { useCallback, useEffect } from 'react';
import { useDuplicateStrategy } from './useDuplicateStrategy';
import { OrderCreate } from './useOrder';
import { Order, Strategy } from 'libs/queries';

export const CreateStrategy = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    token0,
    setToken0,
    token1,
    setToken1,
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

  const { templateStrategy } = useDuplicateStrategy();

  const populateStrategy = useCallback(
    (templateStrategy: Strategy) => {
      setToken0(templateStrategy.token0);
      setToken1(templateStrategy.token1);
      updateOrder(order0, templateStrategy.order0);
      updateOrder(order1, templateStrategy.order1);
      navigate({
        search: undefined,
        replace: true,
      });
    },
    [navigate, order0, order1, setToken0, setToken1]
  );

  useEffect(() => {
    if (templateStrategy) {
      populateStrategy(templateStrategy);
    }
  }, [populateStrategy, templateStrategy]);

  const updateOrder = (order: OrderCreate, baseOrder: Order) => {
    order.setBudget(baseOrder.balance);
    const limit = baseOrder.startRate === baseOrder.endRate;
    if (limit) {
      order.setPrice(baseOrder.startRate);
    } else {
      order.setIsRange(true);
      order.setMin(baseOrder.startRate);
      order.setMax(baseOrder.endRate);
    }
  };

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

        <div className={'text-secondary mb-10'}>Base Token</div>
        <SelectTokenButton
          symbol={token0?.symbol}
          imgUrl={token0?.logoURI}
          onClick={() => openTokenListModal(true)}
        />
        {!!token0 && (
          <>
            <div className={'text-secondary my-10'}>Quote Token</div>
            <SelectTokenButton
              symbol={token1?.symbol}
              imgUrl={token1?.logoURI}
              onClick={() => openTokenListModal()}
            />
          </>
        )}
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
              variant={'white'}
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
