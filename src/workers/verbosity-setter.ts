const verbosity = import.meta.env.VITE_SDK_VERBOSITY;
if (!!verbosity && +verbosity !== 0) {
  // eslint-disable-next-line no-restricted-globals
  (self as any).CARBON_DEFI_SDK_VERBOSITY = +verbosity;
}
export {};
