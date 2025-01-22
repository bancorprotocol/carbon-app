/**
 * Get the latest market rate & roi and write it in e2e/mocks
 * Run this script **only** if you need to update the mocked data for E2E tests
 * How to run: `node ./scripts/mock-api.mjs`
 *
 * ⚠️ If you run the script:
 * - E2E tests will likely fail for value based on these mocks, so you'll need to update them.
 * - visual tests will fail too
 *
 * Last ran on:
 * ROI: 18th Sep 2023
 * Market Rate: 18th Sep 2023
 * History Prices: 29th Feb 2024
 * Simulator Results: 29th Feb 2024
 */

import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { cwd } from 'process';
import dayjs from 'dayjs';

export const tokenListsToMock = [
  // Bancor
  '/tokens/ethereum/list.json',
  // CoinGecko
  'https://tokens.coingecko.com/ethereum/all.json',
];

// Add more addresses for more mocks
const addresses = [
  '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
  '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  '0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C',
  '0xae78736Cd615f374D3085123A210448E74Fc6393',
  '0x6982508145454Ce325dDbE47a25d4ec3d2311933',
  '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
  '0x48Fb253446873234F2fEBbF9BdeAA72d9d387f94',
  '0x514910771AF9Ca656af840dff83E8264EcF986CA',
  '0x64aa3364F17a4D01c6f1751Fd97C2BD3D7e7f1D5',
  '0xB4272071eCAdd69d933AdcD19cA99fe80664fc08',
  '0xD33526068D116cE69F19A9ee46F0bd304F21A51f',
  '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
  '0xB50721BCf8d664c30412Cfbc6cf7a15145234ad1',
  '0xc5fB36dd2fb59d3B98dEfF88425a3F425Ee469eD',
  '0xC98835e792553e505AE46e73a6fD27a23985aCcA',
  '0xA8b919680258d369114910511cc87595aec0be6D',
  '0xe76C6c83af64e4C60245D8C7dE953DF673a7A33D',
  '0xbd15Ad921e1B480209AF549874a2fCb80DC312Bf',
  '0x6f80310CA7F2C654691D1383149Fa1A57d8AB1f8',
  '0x5a3e6A77ba2f983eC0d371ea3B475F8Bc0811AD5',
  '0xB17548c7B510427baAc4e267BEa62e800b247173',
  '0xA9E8aCf069C58aEc8825542845Fd754e41a9489A',
  '0xDA7C0810cE6F8329786160bb3d1734cf6661CA6E',
  '0xbae9992488AE7f7c1EDB34Ed74c213B28d928991',
  '0x0414D8C87b271266a5864329fb4932bBE19c0c49',
  '0x178c820f862B14f316509ec36b13123DA19A6054',
  '0xD533a949740bb3306d119CC777fa900bA034cd52',
  '0x9DB0FB0Aebe6A925B7838D16e3993A3976A64AaB',
  '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  '0xAa6E8127831c9DE45ae56bB1b0d4D4Da6e5665BD',
  '0x5218E472cFCFE0b64A064F055B43b4cdC9EfD3A6',
  '0xfB7B4564402E5500dB5bB6d63Ae671302777C75a',
  '0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39',
  '0x49D72e3973900A195A155a46441F0C08179FdB64',
  '0x25127685dC35d4dc96C7fEAC7370749d004C5040',
  '0x45804880De22913dAFE09f4980848ECE6EcbAf78',
  '0xCeDefE438860D2789dA6419b3a19cEcE2A41038d',
  '0xb794Ad95317f75c44090f64955954C3849315fFe',
  '0x4e3FBD56CD56c3e72c1403e103b45Db9da5B9D2B',
  '0xA35923162C49cF95e6BF26623385eb431ad920D3',
  '0x814e0908b12A99FeCf5BC101bB5d0b8B5cDf7d26',
  '0xdfba8e8fFCc348B006e893e78De233B8597076d5',
  '0x198d7387Fa97A73F05b8578CdEFf8F2A1f34Cd1F',
  '0xC0c293ce456fF0ED870ADd98a0828Dd4d2903DBF',
  '0x853d955aCEf822Db058eb8505911ED77F175b99e',
  '0x4C4F2B9DEB3c91006719Bb3232DD4eb39977307c',
  '0x9D65fF81a3c488d585bBfb0Bfe3c7707c7917f54',
  '0x00282FD551D03dC033256C4bf119532e8C735D8a',
  '0x5f98805A4E8be255a32880FDeC7F6728C6568bA0',
  '0x6f49694827d46A14Baf2a7b1eAC3e6eB3526A84f',
  '0xc944E90C64B2c07662A292be6244BDf05Cda44a7',
  '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e',
  '0xc00e94Cb662C3520282E6f5717214004A7f26888',
  '0x1a7e4e63778B4f12a199C062f3eFdD288afCBce8',
  '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
  '0xc8De43Bfe33FF496Fa14c270D9CB29Bda196B9B5',
  '0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0',
  '0x47daC6BD80f024575a6d367aF5Ba8e89202A09fc',
  '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
  '0x856c4Efb76C1D1AE02e20CEB03A2A6a08b0b8dC3',
  '0x2890dF158D76E584877a1D17A85FEA3aeeB85aa6',
  '0x6468e79A80C0eaB0F9A2B574c8d5bC374Af59414',
  '0x72e4f9F808C49A2a61dE9C5896298920Dc4EEEa9',
  '0x0f71B8De197A1C84d31de0F1fA7926c365F052B3',
  '0x7C07F7aBe10CE8e33DC6C5aD68FE033085256A84',
  '0x3593D125a4f7849a1B059E64F4517A86Dd60c95d',
  '0x8E870D67F660D95d5be530380D0eC0bd388289E1',
  '0x808507121B80c02388fAd14726482e061B8da827',
  '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F',
  '0x4ad434b8CDC3AA5AC97932D6BD18b5d313aB0f6f',
  '0x875773784Af8135eA0ef43b5a374AaD105c5D39e',
  '0x24C19F7101c1731b85F1127EaA0407732E36EcDD',
  '0xfb66321D7C674995dFcC2cb67A30bC978dc862AD',
  '0x01022591fCe0609B57670bebA60102dFd2b95D77',
  '0x046EeE2cc3188071C02BfC1745A6b17c656e3f3d',
  '0x0e92C90867bF82ebbE66ae0352a4C6D876Fb5398',
  '0x8a854288a5976036A725879164Ca3e91d30c6A1B',
  '0xFe459828c90c0BA4bC8b42F5C5D44F316700B430',
  '0x6BeA7CFEF803D1e3d5f7C0103f7ded065644e197',
  '0xd3E4Ba569045546D09CF021ECC5dFe42b1d7f6E4',
  '0xF655C8567E0f213e6C634CD2A68d992152161dC6',
  '0x77E06c9eCCf2E797fd462A92B6D7642EF85b0A44',
  '0xf32cFbAf4000e6820a95B3A3fCdbF27FB4eFC9af',
  '0x3C6A7aB47B5F058Be0e7C7fE1A4b7925B8aCA40e',
  '0x97de57eC338AB5d51557DA3434828C5DbFaDA371',
  '0x298d492e8c1d909D3F63Bc4A36C66c64ACB3d695',
  '0xa6Ec49E06C25F63292bac1Abc1896451A0f4cFB7',
  '0x53Bf63239B8C6354b81a8D235fB08e32FFBF22a9',
  '0xa62894D5196bC44e4C3978400Ad07E7b30352372',
  '0x836A808d4828586A69364065A1e064609F5078c7',
  '0x34950Ff2b487d9E5282c5aB342d08A2f712eb79F',
  '0xA23c5eF36deC46Fe8E320CaA647AfD484D9D96Df',
  '0xaBeC00542D141BDdF58649bfe860C6449807237c',
  '0x2e85ae1C47602f7927bCabc2Ff99C40aA222aE15',
  '0x4a220E6096B25EADb88358cb44068A3248254675',
  '0x80f0C1c49891dcFDD40b6e0F960F84E6042bcB6F',
  '0xf951E335afb289353dc249e82926178EaC7DEd78',
  '0xb2cABf797bc907B049e4cCB5b84d13be3a8CFC21',
  '0x7FC09A4F6182E835A97c42980F7235E8C0cBfa56',
  '0xE95A203B1a91a908F9B9CE46459d101078c2c3cb',
  '0xFa14Fa6958401314851A17d6C5360cA29f74B57B',
  '0x34ba042827996821CFFEB06477D48a2Ff9474483',
  '0x3007083EAA95497cD6B2b809fB97B6A30bdF53D3',
  '0x3cda61B56278842876e7fDD56123d83DBAFAe16C',
  '0x5E8422345238F34275888049021821E8E08CAa1f',
  '0x3eE4B152824b657644c7A9B50694787e80EB8F4a',
  '0xd8B90D2e680ea535eAcCe1b025c998B347892f68',
  '0xC32dB1D3282e872d98f6437D3BCFa57801CA6d5c',
  '0x38CF11283de05cF1823b7804bC75068bd6296957',
  '0x4965b3b90f3a63Fc72F74e53322f66b2a174a98F',
  '0x6595b8fD9C920C81500dCa94e53Cdc712513Fb1f',
  '0x3d1BA9be9f66B8ee101911bC36D3fB562eaC2244',
  '0x476c5E26a75bd202a9683ffD34359C0CC15be0fF',
  '0x070E984fda37DD942f5c953F6b2375339aDAc308',
  '0x03ab458634910AaD20eF5f1C8ee96F1D6ac54919',
  '0xb9EF770B6A5e12E45983C5D80545258aA38F3B78',
  '0x86803e2012CBA1Ca09d87393f5C739FA9E58ea3c',
  '0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32',
  '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE',
  '0xf49311af05a4Ffb1dbf33d61e9b2d4f0a7d4a71C',
  '0x7721A4cb6190EDB11d47f51C20968436ECcDAFb8',
  '0xebB82c932759B515B2efc1CfBB6BF2F6dbaCe404',
  '0xa117000000f279D81A1D3cc75430fAA017FA5A2e',
  '0x15b0dD2c5Db529Ab870915ff498bEa6d20Fb6b96',
];

// Add more cases for more mocks
const historyPricesCases = [
  {
    baseToken: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', // ETH
    quoteToken: '0x6b175474e89094c44da98b954eedeac495271d0f', // DAI
    start: '2023-02-28',
    end: '2024-02-29',
  },
  {
    baseToken: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', // ETH
    quoteToken: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
    start: '2023-02-28',
    end: '2024-02-29',
  },
  {
    baseToken: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', // ETH
    quoteToken: '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce', // SHIB
    start: '2023-02-28',
    end: '2024-02-29',
  },
];

// Add more cases for more mocks
const simulatorResultCases = [
  {
    baseToken: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', // ETH
    quoteToken: '0x6b175474e89094c44da98b954eedeac495271d0f', // DAI
    buyMin: 1500,
    buyMax: 1600,
    buyMarginal: 0,
    buyBudget: 2000,
    sellMin: 1700,
    sellMax: 2000,
    sellMarginal: 0,
    sellBudget: 10,
    start: '2023-03-02',
    end: '2024-02-25',
  },
  {
    baseToken: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', // ETH
    quoteToken: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
    buyMin: 1700,
    buyMax: 1800,
    buyMarginal: 0,
    buyBudget: 200,
    sellMin: 2100,
    sellMax: 2100,
    sellMarginal: 0,
    sellBudget: 1,
    start: '2023-03-10',
    end: '2024-01-24',
  },
  {
    baseToken: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', // ETH
    quoteToken: '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce', // SHIB
    buyMin: 222000000,
    buyMax: 222000000,
    buyMarginal: 0,
    buyBudget: 1000000000,
    sellMin: 240000000,
    sellMax: 270000000,
    sellMarginal: 0,
    sellBudget: 1,
    start: '2023-03-08',
    end: '2024-01-21',
  },
  {
    baseToken: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', // ETH
    quoteToken: '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce', // SHIB
    buyMin: 222000000,
    buyMax: 222000000,
    buyMarginal: 0,
    buyBudget: 100000000,
    sellMin: 240000000,
    sellMax: 240000000,
    sellMarginal: 0,
    sellBudget: 10,
    start: '2023-03-01',
    end: '2024-02-21',
  },
];

const baseUrl = 'https://api.carbondefi.xyz/v1';

const get = async (url) => {
  const res = await fetch(url);
  if (res.ok) return res.json();
  const err = await res.json();
  throw new Error(`[${res.status} ${res.statusText}] ${err.message ?? ''}`);
};

const convertToUnix = (date) => dayjs(date).unix();

const getMarketRate = async (address) => {
  const url = new URL(`${baseUrl}/market-rate`);
  url.searchParams.set('address', address);
  url.searchParams.set('convert', 'USD,EUR,JPY,GBP,AUD,CAD,CHF,CNY,ETH');
  return get(url);
};

const getRoi = () => get(`${baseUrl}/roi`);

const getHistoryPrices = async (baseToken, quoteToken, start, end) => {
  const startTimestamp = convertToUnix(start);
  const endTimestamp = convertToUnix(end);
  const url = new URL(`${baseUrl}/history/prices`);
  url.searchParams.set('baseToken', baseToken);
  url.searchParams.set('quoteToken', quoteToken);
  url.searchParams.set('start', startTimestamp);
  url.searchParams.set('end', endTimestamp);
  return get(url);
};

const getSimulatorData = async (simulatorData) => {
  const url = new URL(`${baseUrl}/simulator/create`);
  const startTimestamp = convertToUnix(simulatorData.start);
  const endTimestamp = convertToUnix(simulatorData.end);

  for (const key in simulatorData) {
    url.searchParams.set(key, simulatorData[key]);
  }

  url.searchParams.set('start', startTimestamp);
  url.searchParams.set('end', endTimestamp);
  return get(url);
};

async function main() {
  const roi = await getRoi();

  /** @type Record<string, FiatPriceDict> */
  const rates = {};
  const getAll = addresses.map(async (address) => {
    const dict = await getMarketRate(address);
    rates[address] = dict;
  });
  await Promise.allSettled(getAll);

  const historyPrices = {};
  const getHistoryPricesAll = historyPricesCases.map(async (c) => {
    const dict = await getHistoryPrices(
      c.baseToken,
      c.quoteToken,
      c.start,
      c.end
    );
    const pairKey = [c.baseToken, c.quoteToken].join('-').toLowerCase();
    historyPrices[pairKey] = dict;
  });
  await Promise.allSettled(getHistoryPricesAll);

  const simulatorResult = {};
  const getSimulatorDataAll = simulatorResultCases.map(async (c) => {
    const dict = await getSimulatorData(c);
    const pairKey = [
      c.baseToken,
      c.quoteToken,
      c.buyMin,
      c.buyMax,
      c.buyMarginal,
      c.buyBudget,
      c.sellMin,
      c.sellMax,
      c.sellMarginal,
      c.sellBudget,
      convertToUnix(c.start),
      convertToUnix(c.end),
    ]
      .join('-')
      .toLowerCase();
    simulatorResult[pairKey] = dict;
  });
  await Promise.allSettled(getSimulatorDataAll);

  const tokenListResult = {};
  const getTokenLists = tokenListsToMock.map(async (tokenList) => {
    const url = new URL(tokenList);
    tokenListResult[url] = await get(url);
  });
  await Promise.allSettled(getTokenLists);

  const folder = join(cwd(), 'e2e/mocks');
  if (!existsSync(folder)) mkdirSync(folder, { recursive: true });

  // We do not wrap it into "data" as playwright will do it for us
  writeFileSync(join(folder, 'roi.json'), JSON.stringify(roi));
  writeFileSync(join(folder, 'market-rates.json'), JSON.stringify(rates));

  writeFileSync(
    join(folder, 'history-prices.json'),
    JSON.stringify(historyPrices)
  );
  writeFileSync(
    join(folder, 'simulator-result.json'),
    JSON.stringify(simulatorResult)
  );
  writeFileSync(
    join(folder, 'tokenLists.json'),
    JSON.stringify(tokenListResult)
  );
}

main()
  .then(() => {
    process.exit(1);
  })
  .catch((err) => {
    console.error(err);
    process.exit(0);
  });
