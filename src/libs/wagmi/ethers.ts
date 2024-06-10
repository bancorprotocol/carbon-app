import { Config, getClient } from '@wagmi/core';
import { providers } from 'ethers';
import type { Account, Client, Chain, Transport } from 'viem';

const clientToProvider = (client: Client<Transport, Chain>) => {
  const { chain, transport } = client;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  return new providers.Web3Provider(transport, network);
};

/**
 * Convert a viem Public Client to an ethers.js Provider
 * @param {Config} config  wagmi config to use
 * @param {number} chainId  chainId to get client for
 * @returns {Web3Provider} ethers.js provider
 */
export const getEthersProvider = (config: Config, chainId?: number) => {
  const client = getClient(config, { chainId });
  if (!client) return;
  return clientToProvider(client);
};

/**
 * Get an ethers.js signer from client
 * @param {Client<Transport, Chain, Account>} client  Client to use
 * @returns {JsonRpcSigner} ethers.js signer
 */
export const clientToSigner = (client?: Client<Transport, Chain, Account>) => {
  if (!client) return;
  const { account, chain, transport } = client;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = new providers.Web3Provider(transport, network);
  const signer = provider.getSigner(account.address);
  return signer;
};
