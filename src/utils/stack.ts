export class ImmutableStack<T> {
  private readonly items: T[];

  private constructor(items: T[] = []) {
    this.items = items;
  }

  static create<T>(): ImmutableStack<T> {
    return new ImmutableStack<T>();
  }

  push(item: T): ImmutableStack<T> {
    return new ImmutableStack<T>([...this.items, item]);
  }

  pop(): ImmutableStack<T> {
    if (this.isEmpty()) {
      return this;
    }
    return new ImmutableStack<T>(this.items.slice(0, -1));
  }

  top(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }
    return this.items[this.items.length - 1];
  }

  clear(): ImmutableStack<T> {
    return new ImmutableStack<T>([]);
  }

  size(): number {
    return this.items.length;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }
}
