import { useEffect, useState } from 'react';
import { Button } from 'components/common/button';
import { m } from 'libs/motion';
import { useCreate } from './useCreateStrategy';
import { ReactComponent as IconChevron } from 'assets/icons/chevron.svg';
import { ReactComponent as IconArrow } from 'assets/icons/arrowDown.svg';
import { useLocation } from 'libs/routing';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { SelectTokenButton } from 'components/common/selectToken';
import { TradingviewChart } from 'components/tradingviewChart';
import { ReactComponent as IconX } from 'assets/icons/X.svg';
import { ReactComponent as IconCandles } from 'assets/icons/candles.svg';
import { StepTwo } from './stepTwo';
import { items, list } from './variants';

export const CreateStrategy = () => {
  const [showGraph, setShowGraph] = useState(false);
  const location = useLocation();

  const {
    token0,
    token1,
    setToken0,
    setToken1,
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
        <div className="w-[400px] space-y-20">
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
              <Tooltip
                element={
                  <div>
                    Selecting the tokens you would like to create a strategy
                    for.
                    <br />
                    <b>Buy or Sell token</b> (also called Base token) is the
                    token you would like to buy or sell in the strategy.
                    <br />
                    <b>With token</b> (also called Quote token) is the token you
                    would denominate the rates in.
                  </div>
                }
              />
            </div>
            <div className={'-space-y-15'}>
              <SelectTokenButton
                symbol={token0?.symbol}
                imgUrl={token0?.logoURI}
                address={token0?.address}
                description={'Buy or Sell'}
                onClick={() => openTokenListModal(true)}
                isBaseToken
              />
              {!!token0 && (
                <>
                  <div
                    className={
                      'relative z-10 mx-auto flex h-40 w-40 items-center justify-center rounded-full border-[5px] border border-silver bg-black'
                    }
                  >
                    <IconArrow
                      onClick={() => {
                        if (token0 && token1) {
                          const temp = token0;
                          setToken0(token1);
                          setToken1(temp);
                        }
                      }}
                      className={`w-12 ${
                        token0 && token1 ? 'cursor-pointer' : ''
                      }`}
                    />
                  </div>
                  <SelectTokenButton
                    symbol={token1?.symbol}
                    imgUrl={token1?.logoURI}
                    address={token1?.address}
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
              <TradingviewChart token0={token0} token1={token1} />
            </m.div>
          )}
        </div>
      </div>
    </m.div>
  );
};
