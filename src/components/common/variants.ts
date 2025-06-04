type ObjectFromList<T extends ReadonlyArray<string>, V> = {
  [K in T extends ReadonlyArray<infer U> ? U : never]: V;
};

type NewVariant<T extends { [key in string]: ReadonlyArray<string> }> = {
  [key in keyof T]: ObjectFromList<T[key], string | string[]>;
};

export type VariantColor = NewVariant<{
  variant: ['black', 'white', 'success', 'error', 'secondary', 'buy', 'sell'];
}>;

export type VariantSize = NewVariant<{
  size: ['sm', 'md', 'lg'];
}>;

export type VariantFullWidth = NewVariant<{
  fullWidth: ['true', 'false'];
}>;

export type VariantIsOn = NewVariant<{
  isOn: ['true', 'false'];
}>;
