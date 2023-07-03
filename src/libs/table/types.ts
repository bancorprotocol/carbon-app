export interface ColumnSort<D> {
  id: Exclude<keyof D, number | symbol> | string;
  desc: boolean;
}

export type SortingState<D> = ColumnSort<D>[];
