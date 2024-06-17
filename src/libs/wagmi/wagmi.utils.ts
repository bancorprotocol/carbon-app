// Error messages for EIP-1193 Provider (https://eips.ethereum.org/EIPS/eip-1193#provider-errors)
export const errorMessages: Record<string, string> = {
  4001: 'Connection rejected. Please approve dApp connection on your wallet.',
  4100: 'The request method/account is not authorized. Please approve dApp permissions on your wallet.',
  4200: 'The wallet does not support the required method.',
  4900: 'The wallet does not support the required method.',
  4901: 'The wallet is disconnected from the current chain.',
};
