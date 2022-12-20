import { FC, useState } from 'react';
import { Order, Strategy, StrategyStatus } from 'queries';
import { m, mItemVariant } from 'motion';
import { TokensOverlap } from 'components/TokensOverlap';
import { Imager } from 'elements/Imager';
import { prettifyNumber } from 'utils/helpers';
import { ReactComponent as IconRangeGraph } from 'assets/icons/rangeGraph.svg';
import { ReactComponent as IconPriceGraph } from 'assets/icons/priceGraph.svg';
import { ReactComponent as IconArrow } from 'assets/icons/arrow.svg';
import { Button } from 'components/Button';
import { DropdownMenu } from 'components/DropdownMenu';

export const StrategyBlock: FC<{ strategy: Strategy }> = ({ strategy }) => {
  const paddedID = String(strategy.id).padStart(9, '0');
  const [manage, setManage] = useState(false);
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
      <BuySell buy order={strategy.order0} otherOrder={strategy.order1} />
      <BuySell order={strategy.order1} otherOrder={strategy.order0} />
      <OrderStatus status={strategy.status} />
      <Manage manage={manage} setManage={setManage} />
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

const BuySell: FC<{ order: Order; otherOrder: Order; buy?: boolean }> = ({
  order,
  otherOrder,
  buy,
}) => {
  const limit = order.startRate === order.endRate;
  return (
    <div className="rounded-8 border border-emphasis p-15">
      <div className="flex items-center gap-6">
        {buy ? 'Buy' : 'Sell'}
        <Imager className="h-16 w-16" src={order.token.logoURI} alt="token" />
      </div>
      <hr className="my-12 border-silver dark:border-emphasis" />
      <div>
        <div className="mb-5 flex items-center justify-between">
          <div className={`${buy ? 'text-success-500' : 'text-error-500'}`}>
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
            {prettifyNumber(otherOrder.balance, {
              abbreviate: otherOrder.balance.length > 10,
            })}
            <Imager
              className="h-16 w-16"
              src={otherOrder.token.logoURI}
              alt="token"
            />
          </div>
        </div>
        {limit ? (
          <IconPriceGraph
            className={`${
              buy ? 'text-white text-success-500' : 'text-error-500'
            }`}
          />
        ) : (
          <IconRangeGraph
            className={`${buy ? 'text-success-500' : 'text-error-500'}`}
          />
        )}
      </div>
    </div>
  );
};

const Manage: FC<{ manage: boolean; setManage: (flag: boolean) => void }> = ({
  manage,
  setManage,
}) => {
  const items = ['Edit Strategy Name', 'Withdraw Funds', 'Delete Strategy'];

  return (
    <DropdownMenu
      isOpen={manage}
      setIsOpen={setManage}
      button={
        <Button
          className="flex items-center justify-center gap-8"
          size={'md'}
          fullWidth
          variant={'secondary'}
        >
          Manage
          <IconArrow className="w-12" />
        </Button>
      }
      className="w-full !p-10"
    >
      {items.map((item) => (
        <ManageItem title={item} setManage={setManage} />
      ))}
    </DropdownMenu>
  );
};

const ManageItem: FC<{ title: string; setManage: (flag: boolean) => void }> = ({
  title,
  setManage,
}) => {
  return (
    <div
      onClick={() => {
        setManage(false);
      }}
      className="hover:bg-body cursor-pointer rounded-6 p-12"
    >
      {title}
    </div>
  );
};
