import { createV2Position } from 'components/uniswap/v2/create';
import { useTokens } from 'hooks/useTokens';
import { useWagmi } from 'libs/wagmi';
import { useBatchTransaction } from 'libs/wagmi/batch-transaction';
import { FormEvent } from 'react';
import { parseUnits } from 'ethers';
import { createV3Position } from 'components/uniswap/v3/create';
import { getMarketPrice } from 'libs/queries/extApi/tokenPrice';
import config from 'config';

export const DebugUniswap = () => {
  const { getTokenById } = useTokens();
  const { signer, sendTransaction, user } = useWagmi();
  const { canBatchTransactions } = useBatchTransaction();
  const createV2 = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) throw new Error('User Required');
    if (!signer) throw new Error('Signer Required');
    const canBatch = await canBatchTransactions(user);
    if (!canBatch) throw new Error('Uniswap create requires EIP7702');
    const data = new FormData(event.target as HTMLFormElement);
    const base = getTokenById(data.get('base') as string)!;
    const quote = getTokenById(data.get('quote') as string)!;
    const fee = Number(data.get('fee')!) * 1000;
    const marketPrice = await getMarketPrice(base, quote);
    const baseAmount = parseUnits(
      data.get('base-amount') as string,
      base.decimals,
    );
    const quoteAmount = parseUnits(
      data.get('quote-amount') as string,
      quote.decimals,
    );
    const txsV2 = await createV2Position(
      signer,
      base.address,
      quote.address,
      baseAmount,
    );
    const txsV3 = await createV3Position(
      signer,
      base.address,
      quote.address,
      baseAmount,
      quoteAmount,
      marketPrice,
      fee,
    );
    await sendTransaction([txsV3]);
  };
  return (
    <section className="rounded-3xl surface grid gap-20 p-20">
      <form className="grid gap-8" onSubmit={createV2}>
        <hgroup>
          <h2>Uniswap v2 & v3</h2>
          <p className="text-white/60">Create a uniswap v2 & v3 position</p>
        </hgroup>
        <div className="grid gap-8">
          <label htmlFor="uni-base">Base</label>
          <select
            className="bg-main-900 px-16 py-8 rounded-2xl"
            id="uni-base"
            name="base"
            required
          >
            {Object.entries(config.addresses.tokens).map(
              ([symbol, address]) => (
                <option value={address}>{symbol}</option>
              ),
            )}
          </select>
        </div>
        <div className="grid gap-8">
          <label htmlFor="uni-quote">Quote</label>
          <select
            className="bg-main-900 px-16 py-8 rounded-2xl"
            id="uni-quote"
            name="quote"
            required
          >
            {Object.entries(config.addresses.tokens).map(
              ([symbol, address]) => (
                <option value={address}>{symbol}</option>
              ),
            )}
          </select>
        </div>
        <div className="grid gap-8">
          <label htmlFor="uni-base-amount">Base Amount</label>
          <input
            className="bg-main-900 px-16 py-8 rounded-2xl"
            id="uni-base-amount"
            name="base-amount"
            required
          />
        </div>
        <div className="grid gap-8">
          <label htmlFor="uni-quote-amount">Quote Amount (only for v3)</label>
          <input
            className="bg-main-900 px-16 py-8 rounded-2xl"
            id="uni-quote-amount"
            name="quote-amount"
            required
          />
        </div>
        <div className="grid gap-8">
          <label htmlFor="uni-fee">Fee in % (only for v3)</label>
          <input
            className="bg-main-900 px-16 py-8 rounded-2xl"
            id="uni-fee"
            name="fee"
            required
          />
        </div>
        <button className="btn-primary-gradient" type="submit">
          Create position
        </button>
      </form>
    </section>
  );
};
