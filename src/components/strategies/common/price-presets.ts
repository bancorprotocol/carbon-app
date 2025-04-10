export const buyPresets = [
  {
    label: '-0.1%',
    value: '-0.1',
  },
  {
    label: '-1%',
    value: '-1',
  },
  {
    label: '-5%',
    value: '-5',
  },
];

export const sellPresets = [
  {
    label: '+0.1%',
    value: '0.1',
  },
  {
    label: '+1%',
    value: '1',
  },
  {
    label: '+5%',
    value: '5',
  },
];

export const limitPreset = (buy: boolean) => (buy ? buyPresets : sellPresets);

export const overlappingPresets = [
  {
    label: '±0.5%',
    value: '0.5',
  },
  {
    label: '±1%',
    value: '1',
  },
  {
    label: '±5%',
    value: '5',
  },
  {
    label: '±10%',
    value: '10',
  },
  {
    label: 'Full Range',
    value: 'Infinity',
  },
];
