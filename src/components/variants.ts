type ObjectFromList<T extends ReadonlyArray<string>, V> = {
  [K in T extends ReadonlyArray<infer U> ? U : never]: V;
};

type NewVariant<T extends { [key in string]: ReadonlyArray<string> }> = {
  [key in keyof T]: ObjectFromList<T[key], string | string[]>;
};

const COLOR = {
  variant: ['primary', 'secondary', 'success', 'error'],
} as const;
export type VariantColor = NewVariant<typeof COLOR>;

const SIZE = {
  size: ['sm', 'md', 'lg'],
} as const;
export type VariantSize = NewVariant<typeof SIZE>;

const FULL_WIDTH = {
  fullWidth: ['true', 'false'],
} as const;
export type VariantFullWidth = NewVariant<typeof FULL_WIDTH>;

const IS_ON = {
  isOn: ['true', 'false'],
} as const;
export type VariantIsOn = NewVariant<typeof IS_ON>;
