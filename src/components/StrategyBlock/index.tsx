import { FC } from 'react';
import { Order, Strategy, StrategyStatus } from 'queries';
import { m, mItemVariant } from 'motion';
import { TokensOverlap } from 'components/TokensOverlap';
import { Imager } from 'elements/Imager';
import { prettifyNumber } from 'utils/helpers';
import { ReactComponent as IconRangeGraph } from 'assets/icons/rangeGraph.svg';
import { ReactComponent as IconPriceGraph } from 'assets/icons/priceGraph.svg';

export const StrategyBlock: FC<{ strategy: Strategy }> = ({ strategy }) => {
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
      <BuySell title="Buy" order={strategy.order0} />
      <BuySell title="Sell" order={strategy.order1} />
      <OrderStatus status={strategy.status} />
    </m.div>
  );
};

const OrderStatus: FC<{ status: StrategyStatus }> = ({ status }) => {
  return (
    <div className="rounded-8 border border-emphasis p-15">
      <div className="text-secondary text-14">Order Status</div>
      <div
        className={`${
          status === StrategyStatus.Active
            ? 'text-success-500'
            : 'text-error-500'
        } `}
      >
        {status === StrategyStatus.Active
          ? 'Active'
          : status === StrategyStatus.NoBudget
          ? 'No Budget · Inactive'
          : status === StrategyStatus.OffCurve
          ? 'Off Curve · Inactive'
          : 'Inactive'}
      </div>
    </div>
  );
};

const BuySell: FC<{ order: Order; title: string }> = ({ order, title }) => {
  const limit = order.startRate === order.endRate;
  return (
    <div className="rounded-8 border border-emphasis p-15">
      <div className="flex items-center gap-6">
        {title}
        <Imager className="h-16 w-16" src={order.token.logoURI} alt="token" />
      </div>
      <hr className="my-12 border-silver dark:border-emphasis" />
      <div>
        <div className="mb-5 flex items-center justify-between">
          <div className={`${limit ? 'text-success-500' : 'text-error-500'}`}>
            {limit ? 'Limit Price' : 'Price Range'}
          </div>
          <div className="flex items-center gap-7">
            {prettifyNumber(order.startRate, {
              abbreviate: order.startRate.length > 10,
            })}

            {!limit &&
              ` - ${prettifyNumber(order.endRate, {
                abbreviate: order.endRate.length > 10,
              })}`}
            <Imager
              className="h-16 w-16"
              src={order.token.logoURI}
              alt="token"
            />
          </div>
        </div>
        <div className="mb-10 flex items-center justify-between">
          <div className="text-secondary !text-16">Budget</div>
          <div className="flex items-center gap-7">
            {prettifyNumber(order.balance, {
              abbreviate: order.balance.length > 10,
            })}
            <Imager
              className="h-16 w-16"
              src={order.token.logoURI}
              alt="token"
            />
          </div>
        </div>
        {limit ? (
          <IconPriceGraph className="text-success-500" />
        ) : (
          <IconRangeGraph className="text-error-500" />
        )}
      </div>
    </div>
  );
};
