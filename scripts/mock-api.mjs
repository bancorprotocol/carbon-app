import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { cwd } from 'process';
// Add more addresses for more mocks
const addresses = [
  '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // UDSC
];
const baseUrl = 'https://api.carbondefi.xyz/v1';

const marketRate = async (address) => {
  const url = new URL(`${baseUrl}/market-rate`);
  url.searchParams.set('address', address);
  url.searchParams.set('convert', 'USD,EUR,JPY,GBP,AUD,CAD,CHF,CNY,ETH');
  const res = await fetch(url);
  if (res.ok) return res.json();
  const err = await res.json();
  throw new Error(`[${res.status} ${res.statusText}] ${err.message ?? ''}`);
};

async function main() {
  /** @type Record<string, FiatPriceDict> */
  const record = {};
  const getAll = addresses.map(async (address) => {
    const dict = await marketRate(address);
    record[address] = dict;
  });
  await Promise.allSettled(getAll);

  const folder = join(cwd(), 'e2e/mocks');
  if (!existsSync(folder)) mkdirSync(folder, { recursive: true });
  writeFileSync(join(folder, 'market-rates.json'), JSON.stringify(record));
}

main()
  .then(() => {
    process.exit(1);
  })
  .catch((err) => {
    console.error(err);
    process.exit(0);
  });
