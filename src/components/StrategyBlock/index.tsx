import { FC } from 'react';
import { Strategy, StrategyStatus } from 'queries';
import { m, mItemVariant } from 'motion';
import { TokensOverlap } from 'components/TokensOverlap';

type Props = { strategy: Strategy };

export const StrategyBlock: FC<Props> = ({ strategy }) => {
  const paddedID = String(strategy.id).padStart(9, '0');
  return (
    <m.div
      variants={mItemVariant}
      className={`${
        strategy.status === StrategyStatus.Active ? 'bg-silver' : 'bg-content'
      } space-y-20 rounded-10 p-20`}
    >
      <div className={'flex space-x-10'}>
        <TokensOverlap
          className="h-40 w-40"
          tokens={[strategy.order0.token, strategy.order1.token]}
        />
        <div>
          {strategy.name ? (
            <>{strategy.name}</>
          ) : (
            <div className="flex gap-6">
              <span>{strategy.order0.token.symbol}</span>
              <div className="text-secondary">/</div>
              <span>{strategy.order1.token.symbol}</span>
            </div>
          )}

          <div className="text-secondary flex gap-8">
            <span>{paddedID.slice(0, 3)}</span>
            <span>{paddedID.slice(3, 6)}</span>
            <span>{paddedID.slice(6, 9)}</span>
            {strategy.name && (
              <>
                <div>·</div>
                <div className="flex gap-4">
                  <span>{strategy.order0.token.symbol}</span>
                  <div>/</div>
                  <span>{strategy.order1.token.symbol}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <hr className="border-silver dark:border-emphasis" />
      <OrderStatus strategy={strategy} />
    </m.div>
  );
};

const OrderStatus: FC<Props> = ({ strategy }) => {
  return (
    <div className="rounded-8 border border-emphasis p-15">
      <div className="text-secondary text-14">Order Status</div>
      <div
        className={`${
          strategy.status === StrategyStatus.Active
            ? 'text-success-500'
            : 'text-error-500'
        } `}
      >
        {strategy.status === StrategyStatus.Active
          ? 'Active'
          : strategy.status === StrategyStatus.NoBudget
          ? 'No Budget · Inactive'
          : strategy.status === StrategyStatus.OffCurve
          ? 'Off Curve · Inactive'
          : 'Inactive'}
      </div>
    </div>
  );
};
