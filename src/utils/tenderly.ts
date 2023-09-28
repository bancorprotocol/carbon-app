import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { Token__factory } from 'abis/types/factories/Token__factory';
import { lsService } from 'services/localeStorage';
import { expandToken } from 'utils/tokens';

export interface FaucetToken {
  decimals: number;
  tokenContract: string;
  donorAccount: string;
  symbol: string;
}

const tenderlyRpc = lsService.getItem('tenderlyRpc');

export const getUncheckedSigner = (user: string, rpcUrl = tenderlyRpc) =>
  new StaticJsonRpcProvider(rpcUrl).getUncheckedSigner(user);

export const ETH_DONOR_ACCOUNT = '0x00000000219ab540356cbb839cbe05303d7705fa';

export const FAUCET_TOKENS: FaucetToken[] = [
  {
    donorAccount: '0x0a59649758aa4d66e25f08dd01271e891fe52199',
    tokenContract: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    decimals: 6,
    symbol: 'USDC',
  },
  {
    donorAccount: '0x5777d92f208679db4b9778590fa3cab3ac9e2168',
    tokenContract: '0x6b175474e89094c44da98b954eedeac495271d0f',
    decimals: 18,
    symbol: 'DAI',
  },
  {
    donorAccount: '0xF977814e90dA44bFA03b6295A0616a897441aceC',
    tokenContract: '0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c',
    decimals: 18,
    symbol: 'BNT',
  },
  {
    donorAccount: '0x4338545408d73b0e6135876f9ff691bb72f1c8d9',
    tokenContract: '0x15b0dD2c5Db529Ab870915ff498bEa6d20Fb6b96',
    decimals: 18,
    symbol: 'PARQ',
  },
  {
    donorAccount: '0xccF4429DB6322D5C611ee964527D42E5d685DD6a',
    tokenContract: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    decimals: 8,
    symbol: 'WBTC',
  },
  {
    donorAccount: '0x480234599362dC7a76cd99D09738A626F6d77e5F',
    tokenContract: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52',
    decimals: 18,
    symbol: 'BNB',
  },
  {
    donorAccount: '0x5e3ef299fddf15eaa0432e6e66473ace8c13d908',
    tokenContract: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
    decimals: 18,
    symbol: 'MATIC',
  },
  {
    donorAccount: '0x5a52e96bacdabb82fd05763e25335261b270efcb',
    tokenContract: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE',
    decimals: 18,
    symbol: 'SHIB',
  },
  {
    donorAccount: '0x4b4e140d1f131fdad6fb59c13af796fd194e4135',
    tokenContract: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    decimals: 18,
    symbol: 'UNI',
  },
  {
    donorAccount: '0x0162Cd2BA40E23378Bf0FD41f919E1be075f025F',
    tokenContract: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    decimals: 6,
    symbol: 'USDT',
  },
];

const FAUCET_AMOUNT = 1000;

export const tenderlyFaucetTransferETH = async (user: string) => {
  const ethSigner = getUncheckedSigner(ETH_DONOR_ACCOUNT);
  await ethSigner.sendTransaction({
    to: user,
    value: expandToken(FAUCET_AMOUNT, 18),
  });
};

export const tenderlyFaucetTransferTKN = async (
  token: FaucetToken,
  user: string
) => {
  const signer = getUncheckedSigner(token.donorAccount);
  const tokenContract = Token__factory.connect(token.tokenContract, signer);
  await tokenContract.transfer(
    user,
    expandToken(FAUCET_AMOUNT, token.decimals)
  );
};
