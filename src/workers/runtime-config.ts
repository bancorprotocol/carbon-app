const verbosity = import.meta.env.VITE_SDK_VERBOSITY;
if (!!verbosity && +verbosity !== 0) {
  // eslint-disable-next-line no-restricted-globals
  (self as any).CARBON_DEFI_SDK_VERBOSITY = +verbosity;
}

const legacyTradeBySourceRange = import.meta.env
  .VITE_LEGACY_TRADE_BY_SOURCE_RANGE;
if (!!legacyTradeBySourceRange) {
  // eslint-disable-next-line no-restricted-globals
  (self as any).LEGACY_TRADE_BY_SOURCE_RANGE = legacyTradeBySourceRange;
}
export {};
