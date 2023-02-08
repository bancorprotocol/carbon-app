import { memo, useEffect, useState } from 'react';
import { Button } from 'components/common/button';
import { m, Variants } from 'libs/motion';
import { useCreate } from './useCreateStrategy';
import { ReactComponent as IconChevron } from 'assets/icons/chevron.svg';
import { ReactComponent as IconArrow } from 'assets/icons/arrowDown.svg';
import { useLocation } from 'libs/routing';
import { Tooltip } from 'components/common/tooltip';
import { SelectTokenButton } from 'components/common/selectToken';
import { Chart } from 'components/chart';
import { ReactComponent as IconX } from 'assets/icons/X.svg';
import { ReactComponent as IconCandles } from 'assets/icons/candles.svg';
import { StepTwo } from './stepTwo';

const MemoChart = memo(Chart);

export const CreateStrategy = () => {
  const [showGraph, setShowGraph] = useState(false);
  const location = useLocation();

  const {
    token0,
    token1,
    openTokenListModal,
    showStep2,
    order0,
    order1,
    createStrategy,
    isCTAdisabled,
    token0BalanceQuery,
    token1BalanceQuery,
  } = useCreate();

  useEffect(() => {
    if (showStep2) {
      setShowGraph(true);
    }
  }, [showStep2]);

  const showGraphToggle = () => {
    setShowGraph((prev) => !prev);
  };

  return (
    <m.div
      className={'space-y-20'}
      variants={list}
      initial={'hidden'}
      animate={'visible'}
    >
      <div
        className={`flex ${
          showGraph ? 'justify-between' : 'justify-center'
        } gap-20 p-20`}
      >
        <div className="min-w-[400px] space-y-20">
          <div className="flex flex-row justify-between">
            <div className="flex items-center gap-16 text-24">
              <button
                onClick={() => location.history.back()}
                className="h-40 w-40 rounded-full bg-emphasis"
              >
                <IconChevron className="mx-auto w-14 rotate-90" />
              </button>
              Create Strategy
            </div>
            {!showGraph && showStep2 && (
              <button
                onClick={showGraphToggle}
                className="h-40 w-40 self-end rounded-full bg-emphasis"
              >
                <IconCandles className="mx-auto w-14 " />
              </button>
            )}
          </div>
          <m.div variants={items} className="bg-secondary rounded-10 p-20">
            <div className="mb-14 flex items-center justify-between">
              <h2>Token Pair</h2>
              <Tooltip>
                Selecting the tokens you would like to create a strategy for.
                The Base token represents how much of the Quoted token is needed
                for you to get one unit of the Base token (i.e. 1 Base token =
                xxx Quote token).
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
            <StepTwo
              {...{
                token0,
                token1,
                order0,
                order1,
                createStrategy,
                isCTAdisabled,
                token0BalanceQuery,
                token1BalanceQuery,
              }}
            />
          )}
        </div>
        <div
          className={`flex flex-col ${
            showGraph ? 'flex-1' : 'absolute right-20'
          }`}
        >
          {showStep2 && showGraph && (
            <Button
              className={`mb-20 self-end`}
              variant="secondary"
              size={'md'}
              onClick={showGraphToggle}
            >
              <div className="flex items-center justify-center ">
                <IconX className={'mr-12 w-10'} />
                Close Graph
              </div>
            </Button>
          )}
          {showGraph && (
            <m.div
              variants={list}
              className="flex h-[550px] flex-col rounded-10 bg-silver p-20 pb-40"
            >
              <h2 className="mb-20 font-weight-500">Price</h2>
              <MemoChart token0={token0} token1={token1} />
            </m.div>
          )}
        </div>
      </div>
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

export const items: Variants = {
  visible: {
    opacity: 1,
    scale: 1,
  },
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
};
