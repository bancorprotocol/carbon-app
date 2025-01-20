import { hexValue, hexZeroPad } from '@ethersproject/bytes';
import { parseUnits } from '@ethersproject/units';
import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { Token__factory } from 'abis/types/factories/Token__factory';
import { lsService } from 'services/localeStorage';
import { expandToken } from 'utils/tokens';
import { solidityKeccak256 } from 'ethers/lib/utils';
import config from 'config';

export interface FaucetToken {
  decimals: number;
  tokenContract: string;
  donorAccount: string;
  symbol: string;
}

export const tenderlyRpc = lsService.getItem('tenderlyRpc');

export const getUncheckedSigner = (user: string, rpcUrl = tenderlyRpc) =>
  new StaticJsonRpcProvider(rpcUrl).getUncheckedSigner(user);

export const FAUCET_TOKENS: FaucetToken[] = config.tenderly.faucetTokens;

const FAUCET_AMOUNT = config.tenderly.faucetAmount;

export const tenderlyFaucetTransferNativeToken = async (user: string) => {
  const provider = new StaticJsonRpcProvider(tenderlyRpc);
  await provider.send('tenderly_setBalance', [
    [user],
    hexValue(parseUnits('1000', 'ether').toHexString()),
  ]);
};

// Slot for the balance method (found by brut force)
const balanceSlot: Record<string, number> = {
  // Matic
  '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0': 0,
  // USDT
  '0xdAC17F958D2ee523a2206206994597C13D831ec7': 2,
  // DAI
  '0x6b175474e89094c44da98b954eedeac495271d0f': 2,
  // PARQ
  '0x15b0dD2c5Db529Ab870915ff498bEa6d20Fb6b96': 1,
  // UNI
  '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984': 4,
  // BNB
  '0xB8c77482e45F1F44dE1745F52C74426C631bDD52': 5,
  // USDC
  '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48': 9,
  // SHIB
  '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE': 0,
  // WBTC
  '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599': 1,
  // BNT
  '0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c': 5,
};

export const tenderlyFaucetTransferTKN = async (
  token: FaucetToken,
  user: string
) => {
  const provider = new StaticJsonRpcProvider(tenderlyRpc);

  function getIndex(slot: number) {
    return solidityKeccak256(['uint256', 'uint256'], [user, slot]);
  }

  if (token.tokenContract in balanceSlot) {
    const value = parseUnits('1000', token.decimals);
    const storageValue = hexZeroPad(hexValue(value.toBigInt()), 32);
    return provider.send('tenderly_setStorageAt', [
      token.tokenContract,
      getIndex(balanceSlot[token.tokenContract]!),
      storageValue,
    ]);
  } else {
    const signer = getUncheckedSigner(token.donorAccount);
    const tokenContract = Token__factory.connect(token.tokenContract, signer);
    return tokenContract.transfer(
      user,
      expandToken(FAUCET_AMOUNT, token.decimals)
    );
  }
};
