import { FC, FormEvent, useEffect, useState } from 'react';
import { useDialog } from 'hooks/useDialog';
import { useWagmi } from 'libs/wagmi';
import { useNotifications } from 'hooks/useNotifications';
import { useQueryClient } from '@tanstack/react-query';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { parseUnits, TransactionRequest } from 'ethers';
import { withdrawPosition } from 'services/uniswap';
import {
  getMaxSpread,
  isMaxBelowMarket,
  isMinAboveMarket,
} from 'components/strategies/overlapping/utils';
import { getFullRangesPrices } from 'components/strategies/common/utils';
import { calculateOverlappingPrices } from '@bancor/carbon-sdk/strategy-management';
import { SafeDecimal } from 'libs/safedecimal';
import { carbonSDK } from 'libs/sdk';
import { MigratedPosition } from './type';
import { QueryKey } from 'libs/queries';
import IconClose from 'assets/icons/X.svg?react';
import config from 'config';
import { MigrationCard } from './MigrationCard';

interface Props {
  position: MigratedPosition;
  onClose: () => void;
}

export const PositionDialog: FC<Props> = (props) => {
  const { ref, open, lightDismiss, close } = useDialog();
  const { user, signer, sendTransaction } = useWagmi();
  const p = props.position;

  // TODO: This should be done by the `useCreateStrategy` once the approval is centralized
  const [status, setStatus] = useState<string>();
  const { dispatchNotification } = useNotifications();
  const cache = useQueryClient();

  const marketPriceQuery = useMarketPrice(p);

  useEffect(() => {
    open();
  }, [open]);

  const migrateOne = async (position: MigratedPosition) => {
    if (!signer) throw new Error('No Signer found');

    // Copy because we mutate it later
    const { base, quote, buy, sell } = structuredClone(position);

    const marketPrice = marketPriceQuery.marketPrice?.toString();
    if (!marketPrice) throw new Error('No market price available');
    const transactions: TransactionRequest[] = [];

    const withdrawTxs = await withdrawPosition(
      signer,
      position.dex,
      position.id,
    );
    for (const tx of withdrawTxs) {
      transactions.push(tx);
    }

    // Check Spread
    const maxSpread = getMaxSpread(Number(buy.min), Number(sell.max));
    const spread = Math.min(maxSpread, Number(position.spread)).toString();

    // Check fullrange
    const isFullRange = buy.min === '0' && sell.max === 'Infinity';
    const fullrange = getFullRangesPrices(
      marketPrice,
      base.decimals,
      quote.decimals,
    );
    if (isFullRange) buy.min = fullrange.min;
    if (isFullRange) sell.max = fullrange.max;

    // Calculate prices
    const prices = calculateOverlappingPrices(
      buy.min,
      sell.max,
      marketPrice,
      spread,
    );
    buy.marginalPrice = prices.buyPriceMarginal;
    buy.max = prices.buyPriceHigh;
    sell.min = prices.sellPriceLow;
    sell.marginalPrice = prices.sellPriceMarginal;

    // Calculate budget
    buy.budget = new SafeDecimal(buy.budget).add(buy.fee).toString();
    sell.budget = new SafeDecimal(sell.budget).add(sell.fee).toString();
    if (isMinAboveMarket(buy)) {
      buy.budget = '0';
    } else if (isMaxBelowMarket(sell)) {
      sell.budget = '0';
    }

    const unsignedTx = await carbonSDK.createBuySellStrategy(
      base.address,
      quote.address,
      buy.min,
      buy.marginalPrice,
      buy.max,
      buy.budget,
      sell.min,
      sell.marginalPrice,
      sell.max,
      sell.budget,
    );
    unsignedTx.customData = {
      spender: config.addresses.carbon.carbonController,
      assets: [
        {
          address: base.address,
          rawAmount: parseUnits(sell.budget, base.decimals).toString(),
        },
        {
          address: quote.address,
          rawAmount: parseUnits(buy.budget, quote.decimals).toString(),
        },
      ],
    };
    transactions.push(unsignedTx);
    return transactions;
  };

  const migrate = async (event: FormEvent) => {
    event.preventDefault();
    if (!user) throw new Error('No User connected for migration');
    try {
      const txs = await migrateOne(p);
      setStatus('Withdraw funds and create strategy');
      const tx = await sendTransaction(txs);
      setStatus('Waiting for block to be mined');
      await tx.wait();
      dispatchNotification('createStrategy', { txHash: tx.hash });
      const queryKey = [
        QueryKey.strategiesByUser(user),
        QueryKey.balance(user, p.base.address),
        QueryKey.balance(user, p.quote.address),
      ];
      cache.invalidateQueries({ queryKey });
      cache.refetchQueries({
        queryKey: QueryKey.migrationPositions(user),
      });
      close();
    } finally {
      setStatus('');
    }
  };

  return (
    <dialog
      key={p.id}
      ref={ref}
      className="modal center"
      onClick={lightDismiss}
      onClose={() => props.onClose()}
    >
      <form method="dialog" className="grid gap-16" onSubmit={migrate}>
        <header className="flex items-center justify-between">
          <h3>Migrate Position + Fees</h3>
          <button type="button" onClick={() => close()}>
            <IconClose className="size-14" />
          </button>
        </header>
        <MigrationCard position={p} />
        <p className="text-14 text-center">
          NOTE: Any unused funds will be sent back to your wallet
        </p>
        <button
          className="btn-primary-gradient"
          type="submit"
          disabled={!!status}
        >
          {status || 'Migrate'}
        </button>
      </form>
    </dialog>
  );
};
