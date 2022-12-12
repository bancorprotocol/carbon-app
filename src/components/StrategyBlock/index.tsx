import { FC } from 'react';
import { Strategy, StrategyStatus } from 'queries';
import { m, mItemVariant } from 'motion';
import { TokensOverlap } from 'components/TokensOverlap';
import { Imager } from 'elements/Imager';

type Props = { strategy: Strategy };

export const StrategyBlock: FC<Props> = ({ strategy }) => {
  return (
    <m.div
      variants={mItemVariant}
      className={`${
        strategy.status === StrategyStatus.Normal ||
        strategy.status === StrategyStatus.ToBeFilled
          ? 'bg-silver'
          : 'bg-content'
      } space-y-20 rounded-10 p-20`}
    >
      <div className={'flex space-x-10'}>
        <TokensOverlap
          className="h-40 w-40"
          tokens={[strategy.tokens.source, strategy.tokens.target]}
        />
        <div>
          <div className="flex">
            <span>{strategy.tokens.source.symbol}</span>
            <div>·</div>
            <span>{strategy.tokens.target.symbol}</span>
          </div>
          <div className="text-secondary">????</div>
        </div>
      </div>
      <hr className="border-silver dark:border-emphasis" />
      <OrderStatus strategy={strategy} />
      <BuySell strategy={strategy} />
      <Balances strategy={strategy} />
    </m.div>
  );
};

const OrderStatus: FC<Props> = ({ strategy }) => {
  return (
    <>
      {strategy.status !== StrategyStatus.Normal && (
        <>
          <Section
            title={<div className="text-secondary text-14">Order Status</div>}
            description={
              <div
                className={`${
                  strategy.status === StrategyStatus.Completed
                    ? 'text-success-500'
                    : strategy.status === StrategyStatus.NoAllocation ||
                      strategy.status === StrategyStatus.OffCurve
                    ? 'text-error-500'
                    : ''
                } `}
              >
                {strategy.status === StrategyStatus.ToBeFilled
                  ? 'To be fullfiled'
                  : strategy.status === StrategyStatus.Completed
                  ? 'Completed'
                  : strategy.status === StrategyStatus.NoAllocation
                  ? 'No Allocation · Inactive'
                  : 'Off Curve · Inactive'}
              </div>
            }
          />
          <hr className="border-silver dark:border-emphasis" />
        </>
      )}
    </>
  );
};

const BuySell: FC<Props> = ({ strategy }) => {
  return (
    <>
      {strategy.status !== StrategyStatus.Completed &&
        strategy.status !== StrategyStatus.OffCurve && (
          <>
            <Section
              title={<div className="text-14 text-success-500">Buy Price</div>}
              description={<div>????????? {strategy.tokens.target.symbol}</div>}
            />
            <hr className="border-silver dark:border-emphasis" />
            {strategy.status !== StrategyStatus.ToBeFilled && (
              <>
                <Section
                  title={
                    <div className="text-14 text-error-500">Sell Price</div>
                  }
                  description={
                    <div>????????? {strategy.tokens.target.symbol}</div>
                  }
                />
                <hr className="border-silver dark:border-emphasis" />
              </>
            )}
          </>
        )}
    </>
  );
};

const Balances: FC<Props> = ({ strategy }) => {
  return (
    <>
      {strategy.status !== StrategyStatus.NoAllocation && (
        <>
          <Section
            title={
              <div className="text-secondary flex items-center gap-5 text-14">
                <Imager
                  className="h-10 w-10"
                  src={strategy.tokens.source.logoURI}
                  alt="token"
                />
                {strategy.tokens.source.symbol}
              </div>
            }
            description={<div>????????? {strategy.tokens.source.symbol}</div>}
          />
          <hr className="border-silver dark:border-emphasis" />
          <Section
            title={
              <div className="text-secondary flex items-center gap-5 text-14">
                <Imager
                  className="h-10 w-10"
                  src={strategy.tokens.target.logoURI}
                  alt="token"
                />
                {strategy.tokens.target.symbol}
              </div>
            }
            description={<div>????????? {strategy.tokens.target.symbol}</div>}
          />
        </>
      )}
    </>
  );
};

const Section = ({
  title,
  description,
}: {
  title: JSX.Element;
  description: JSX.Element;
}) => {
  return (
    <div>
      {title}
      <div>{description}</div>
    </div>
  );
};
