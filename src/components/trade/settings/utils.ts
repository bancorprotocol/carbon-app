type TradeSettingsDataId =
  | 'slippageTolerance'
  | 'transactionExpiration'
  | 'maxOrders';

export type TradeSettingsData = {
  id: TradeSettingsDataId;
  title: string;
  value: string;
  prepend: string;
  append: string;
  setValue: (value: string) => void;
  presets: string[];
};

export const warningMessageIfOutOfRange = (
  id: TradeSettingsDataId,
  value: string
): string => {
  const numberedValue = +value;
  switch (id) {
    case 'slippageTolerance':
      if (numberedValue > 5) {
        return 'Please select a value that is smaller than 5%';
      }
      if (numberedValue < 0.01) {
        return 'Low tolerance might result in failed trades';
      }
      return '';
    case 'transactionExpiration':
      if (numberedValue < 5) {
        return 'Short expiration might result in failed trades';
      }
      return '';
    case 'maxOrders':
      if (numberedValue > 30) {
        return 'High number of orders might increase the gas costs';
      }
      if (numberedValue < 10) {
        return 'Your trades might not find good rates as a result of this setting';
      }
      return '';
    default:
      return '';
  }
};

export const isValidValue = (
  id: TradeSettingsDataId,
  value: string
): boolean => {
  const numberedValue = +value;
  switch (id) {
    case 'slippageTolerance':
      return numberedValue >= 0 && numberedValue <= 5;
    default:
      return true;
  }
};
