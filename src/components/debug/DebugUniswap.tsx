import { useTokens } from 'hooks/useTokens';
import { useWagmi } from 'libs/wagmi';
import { useBatchTransaction } from 'libs/wagmi/batch-transaction';
import { FormEvent } from 'react';
import { parseUnits } from 'ethers';
import { createV2Position } from 'services/uniswap/v2/create';
import { createV3Position } from 'services/uniswap/v3/create';
import { getMarketPrice } from 'libs/queries/extApi/tokenPrice';
import { uniV2Configs, univ3Configs } from 'services/uniswap';
import config from 'config';
import { UniswapV2Config, UniswapV3Config } from 'services/uniswap/utils';

const dexes = ['uniswap', 'sushi', 'pancake'];

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
    const version = data.get('version');
    const dex = data.get('dex');
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
    if (version === 'v2') {
      const run = async (config: UniswapV2Config) => {
        const txsV2 = await createV2Position(
          config,
          signer,
          base.address,
          quote.address,
          baseAmount,
          quoteAmount,
        );
        await sendTransaction(txsV2);
      };
      if (dex === 'all') {
        for (const config of Object.values(uniV2Configs)) {
          await run(config);
        }
      } else {
        const key = `${dex}-v2` as keyof typeof uniV2Configs;
        await run(uniV2Configs[key]);
      }
    }
    if (version === 'v3') {
      const run = async (config: UniswapV3Config) => {
        const txsV3 = await createV3Position(
          config,
          signer,
          base.address,
          quote.address,
          baseAmount,
          quoteAmount,
          marketPrice,
          // fee, // NOT WORKING
        );
        await sendTransaction(txsV3);
      };
      if (dex === 'all') {
        for (const config of Object.values(univ3Configs)) {
          await run(config);
        }
      } else {
        const key = `${dex}-v3` as keyof typeof univ3Configs;
        await run(univ3Configs[key]);
      }
    }
  };
  return (
    <section className="rounded-3xl surface grid gap-20 p-20">
      <form className="grid gap-8" onSubmit={createV2}>
        <hgroup>
          <h2>Uniswap</h2>
          <p className="text-white/60">
            Create a uniswap/sushi/pancake position
          </p>
        </hgroup>
        <div className="grid gap-8">
          <label htmlFor="uni-version">Version</label>
          <select
            className="bg-main-900 px-16 py-8 rounded-2xl"
            id="uni-version"
            name="version"
            defaultValue="v2"
            required
          >
            <option value="v2">V2</option>
            <option value="v3">V3</option>
          </select>
        </div>
        <div className="grid gap-8">
          <label htmlFor="uni-dex">Dex</label>
          <select
            className="bg-main-900 px-16 py-8 rounded-2xl"
            id="uni-dex"
            name="dex"
            defaultValue="all"
            required
          >
            <option value="all">All</option>
            {dexes.map((dex) => (
              <option value={dex}>{dex}</option>
            ))}
          </select>
        </div>
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
                <option key={address} value={address}>
                  {symbol}
                </option>
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
                <option key={address} value={address}>
                  {symbol}
                </option>
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
          <label htmlFor="uni-quote-amount">
            Quote Amount (only if pool doesn't exist)
          </label>
          <input
            className="bg-main-900 px-16 py-8 rounded-2xl"
            id="uni-quote-amount"
            name="quote-amount"
            required
          />
        </div>
        {/*
        TODO: currently fee is not working
        <div className="grid gap-8">
          <label htmlFor="uni-fee">Fee in % (only for v3)</label>
          <input
            className="bg-main-900 px-16 py-8 rounded-2xl"
            id="uni-fee"
            name="fee"
            required
          />
        </div>
        */}
        <button className="btn-primary-gradient" type="submit">
          Create position
        </button>
      </form>
    </section>
  );
};
