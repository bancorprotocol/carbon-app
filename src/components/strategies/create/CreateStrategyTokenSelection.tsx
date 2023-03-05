import { m } from 'libs/motion';
import { ReactComponent as IconArrow } from 'assets/icons/arrowDown.svg';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { SelectTokenButton } from 'components/common/selectToken';
import { items } from './variants';

export const CreateStrategyTokenSelection = ({
  token0,
  token1,
  setToken0,
  setToken1,
  openTokenListModal,
}: any) => {
  return (
    <m.div variants={items} className="bg-secondary rounded-10 p-20">
      <div className="mb-14 flex items-center justify-between">
        <h2>Token Pair</h2>
        <Tooltip
          element={
            <div>
              Selecting the tokens you would like to create a strategy for.
              <br />
              <b>Buy or Sell token</b> (also called Base token) is the token you
              would like to buy or sell in the strategy.
              <br />
              <b>With token</b> (also called Quote token) is the token you would
              denominate the rates in.
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
                className={`w-12 ${token0 && token1 ? 'cursor-pointer' : ''}`}
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
  );
};
