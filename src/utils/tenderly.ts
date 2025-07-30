import {
  parseUnits,
  JsonRpcProvider,
  toQuantity,
  JsonRpcSigner,
  TransactionRequest,
  TransactionResponse,
} from 'ethers';
import { lsService } from 'services/localeStorage';
import config from 'config';
import { NATIVE_TOKEN_ADDRESS } from './tokens';

class UncheckedJsonRpcSigner extends JsonRpcSigner {
  async sendTransaction(
    transaction: TransactionRequest,
  ): Promise<TransactionResponse> {
    const hash = await this.sendUncheckedTransaction(transaction);
    return {
      hash: hash,
      nonce: null,
      gasLimit: null,
      gasPrice: null,
      data: null,
      value: null,
      chainId: null,
      confirmations: 0,
      from: null,
      wait: (confirmations?: number) => {
        return this.provider.waitForTransaction(hash, confirmations);
      },
    } as any;
  }
}

export interface FaucetToken {
  decimals: number;
  tokenContract: string;
  donorAccount: string;
  symbol: string;
}

export const tenderlyRpc = lsService.getItem('tenderlyRpc');

export const getUncheckedSigner = (user: string, rpcUrl = tenderlyRpc) => {
  const provider = new JsonRpcProvider(rpcUrl);
  return new UncheckedJsonRpcSigner(provider, user);
};

export const FAUCET_TOKENS: FaucetToken[] = config.tenderly.faucetTokens;

export const tenderlyFaucetTransferNativeToken = async (user: string) => {
  const provider = new JsonRpcProvider(tenderlyRpc);
  await provider.send('tenderly_setBalance', [
    [user],
    toQuantity(parseUnits('1000', 'ether')),
  ]);
};

export const tenderlyFaucetTransferTKN = async (
  token: { address: string; decimals: number },
  user: string,
) => {
  const provider = new JsonRpcProvider(tenderlyRpc);
  if (token.address === NATIVE_TOKEN_ADDRESS) {
    return provider.send('tenderly_setBalance', [
      [user],
      toQuantity(parseUnits('1000', 'ether')),
    ]);
  } else {
    return provider.send('tenderly_setErc20Balance', [
      token.address,
      user,
      toQuantity(parseUnits('1000', token.decimals)),
    ]);
  }
};
