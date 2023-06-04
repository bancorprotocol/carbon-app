export const getStatusTextByTxStatus = (
  isAwaiting: boolean,
  isProcessing: boolean
): string | undefined => {
  if (isAwaiting) {
    return 'Waiting for Confirmation';
  }
  if (isProcessing) {
    return 'Processing';
  }

  return undefined;
};
