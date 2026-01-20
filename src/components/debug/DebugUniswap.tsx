import { createV2Position } from 'components/uniswap/v2/create';
import { useTokens } from 'hooks/useTokens';
import { useWagmi } from 'libs/wagmi';
import { useBatchTransaction } from 'libs/wagmi/batch-transaction';
import { FormEvent } from 'react';
import { parseUnits } from 'ethers';
import { createV3Position } from 'components/uniswap/v3/create';

export const DebugUniswap = () => {
  const { getTokenById } = useTokens();
  const { signer, sendTransaction, user } = useWagmi();
  const { canBatchTransactions } = useBatchTransaction();
  const createV2 = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(event);
    if (!user) throw new Error('User Required');
    if (!signer) throw new Error('Signer Required');
    const canBatch = await canBatchTransactions(user);
    if (!canBatch) throw new Error('Uniswap create requires EIP7702');
    const data = new FormData(event.target as HTMLFormElement);
    const base = getTokenById(data.get('base') as string)!;
    const quote = getTokenById(data.get('quote') as string)!;
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
    );
    await sendTransaction([txsV2, txsV3]);
  };
  return (
    <section className="rounded-3xl surface grid gap-20 p-20">
      <form className="grid gap-8" onSubmit={createV2}>
        <h2 className="text-center">Uniswap v2 & v3</h2>
        <div className="grid gap-8">
          <label htmlFor="uni-base">Base</label>
          <input
            className="bg-main-900 px-16 py-8 rounded-2xl"
            id="uni-base"
            name="base"
            required
          />
        </div>
        <div className="grid gap-8">
          <label htmlFor="uni-quote">Quote</label>
          <input
            className="bg-main-900 px-16 py-8 rounded-2xl"
            id="uni-quote"
            name="quote"
            required
          />
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
          <label htmlFor="uni-quote-amount">Quote Amount</label>
          <input
            className="bg-main-900 px-16 py-8 rounded-2xl"
            id="uni-quote-amount"
            name="quote-amount"
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
