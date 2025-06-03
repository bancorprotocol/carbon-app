import { describe, it, expect, afterEach } from 'vitest';
import { ManagedLocalStorage } from 'utils/managedLocalStorage';
import {
  Migration,
  migrateAndRemoveItem,
  removeItem,
} from './migrateLocalStorage';

describe('managedLocalStorage', () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('should migrate items correctly based on the provided migration', () => {
    // SETUP
    interface TestLocalStorageSchema {
      item1: { data: string };
      item2: { data: string };
      item3: { data: string };
      item4: { data: string };
    }

    const migrations: Migration[] = [
      {
        migrate: (prevFormattedKey) => {
          const prefix = 'v1-';
          const isMatch = prevFormattedKey.startsWith(prefix);
          if (!isMatch) return;
          const key = prevFormattedKey.slice(prefix.length);
          if (!key) return;
          const nextFormattedKey = ['v1.1', key].join('-');
          migrateAndRemoveItem({ prevFormattedKey, nextFormattedKey });
        },
      },
      {
        migrate: (prevFormattedKey) => {
          const prefix = 'v1.1-';
          const isMatch = prevFormattedKey.startsWith(prefix);
          if (!isMatch) return;
          removeItem({ prevFormattedKey });
        },
      },
      {
        migrate: (prevFormattedKey) => {
          const prefix = 'v1.2-';
          const isMatch = prevFormattedKey.startsWith(prefix);
          if (!isMatch) return;
          const key = prevFormattedKey.slice(prefix.length);
          if (!key) return;
          const nextFormattedKey = ['v1.3', key].join('-');
          migrateAndRemoveItem({ prevFormattedKey, nextFormattedKey });
        },
      },
    ];

    const v1LS = new ManagedLocalStorage<Record<any, any>>((key: string) =>
      ['v1', key].join('-'),
    );
    const v11LS = new ManagedLocalStorage<Record<any, any>>((key: string) =>
      ['v1.1', key].join('-'),
    );
    const v12LS = new ManagedLocalStorage<Record<any, any>>((key: string) =>
      ['v1.2', key].join('-'),
    );
    const v13LS = new ManagedLocalStorage<TestLocalStorageSchema>(
      (key: string) => ['v1.3', key].join('-'),
      migrations,
    );

    // To migrate
    v1LS.setItem('item1', { data: 'v1LS-item1' });
    v1LS.setItem('item4', { data: 'v1LS-item4' });

    // To remove
    v11LS.setItem('item1', { data: 'v11LS-item1' });
    v11LS.setItem('item2', { data: 'v11LS-item2' });
    v11LS.setItem('item3', { data: 'v11LS-item3' });

    // To migrate
    v12LS.setItem('item1', { data: 'v12LS-item1' });
    v12LS.setItem('item3', { data: 'v12LS-item3' });

    // Already exist
    v13LS.setItem('item4', { data: 'v13LS-item4' });

    // ACT
    v13LS.migrateItems();

    // ASSERT
    // All migrated items have been deleted
    expect(localStorage.getItem('v1-item1')).toBeNull();
    expect(localStorage.getItem('v1-item2')).toBeNull();
    expect(localStorage.getItem('v1.1-item1')).toBeNull();
    expect(localStorage.getItem('v1.1-item2')).toBeNull();
    expect(localStorage.getItem('v1.1-item3')).toBeNull();
    expect(localStorage.getItem('v1.2-item1')).toBeNull();
    expect(localStorage.getItem('v1.2-item3')).toBeNull();

    // Migration is done properly
    expect(v13LS.getItem('item1')).toStrictEqual({
      data: 'v12LS-item1',
    });
    expect(v13LS.getItem('item2')).toBeUndefined(); // ManagedLocalStorage getItem for key not found has a different output than localStorage (null vs undefined)
    expect(v13LS.getItem('item3')).toStrictEqual({
      data: 'v12LS-item3',
    });
    expect(v13LS.getItem('item4')).toStrictEqual({
      data: 'v13LS-item4',
    });
  });

  it('should handle compressed objects migration correctly', () => {
    // SETUP
    interface TestLocalStorageSchema {
      item1: { data: string };
      item2: { data: string };
      item3: { data: string };
    }

    const migrations: Migration[] = [
      {
        migrate: (prevFormattedKey) => {
          const prefix = 'v1-';
          const isMatch = prevFormattedKey.startsWith(prefix);
          if (!isMatch) return;
          const key = prevFormattedKey.slice(prefix.length);
          if (!key) return;
          const nextFormattedKey = ['v1.1', key].join('-');
          migrateAndRemoveItem({ prevFormattedKey, nextFormattedKey });
        },
      },
    ];

    const v1LS = new ManagedLocalStorage<Record<any, any>>((key: string) =>
      ['v1', key].join('-'),
    );
    const v11LS = new ManagedLocalStorage<TestLocalStorageSchema>(
      (key: string) => ['v1.1', key].join('-'),
      migrations,
    );

    // To migrate
    v1LS.setItem('item1', { data: 'v1LS-item1' }, true);
    v1LS.setItem('item2', { data: 'v1LS-item2' }, true);

    // Already exist
    v11LS.setItem('item1', { data: 'v11LS-item1' }, true);
    v11LS.setItem('item3', { data: 'v11LS-item3' }, true);

    // ACT
    v11LS.migrateItems();

    // ASSERT
    // All migrated items have been deleted
    expect(localStorage.getItem('v1-item1')).toBeNull();
    expect(localStorage.getItem('v1-item2')).toBeNull();

    // Migration is done properly for compressed items
    expect(v11LS.getItem('item1')).toStrictEqual({
      data: 'v11LS-item1',
    });
    expect(v11LS.getItem('item2')).toStrictEqual({
      data: 'v1LS-item2',
    });
    expect(v11LS.getItem('item3')).toStrictEqual({
      data: 'v11LS-item3',
    });
  });

  it('should not migrate empty or undefined non-compressed objects but should delete them', () => {
    // SETUP
    interface TestLocalStorageSchema {
      item1: string;
      item2: string;
      item3: string;
      item4: string;
    }

    const migrations: Migration[] = [
      {
        migrate: (prevFormattedKey) => {
          const prefix = 'v1-';
          const isMatch = prevFormattedKey.startsWith(prefix);
          if (!isMatch) return;
          const key = prevFormattedKey.slice(prefix.length);
          if (!key) return;
          const nextFormattedKey = ['v1.1', key].join('-');
          migrateAndRemoveItem({ prevFormattedKey, nextFormattedKey });
        },
      },
    ];

    const v1LS = new ManagedLocalStorage<Record<any, any>>((key: string) =>
      ['v1', key].join('-'),
    );
    const v11LS = new ManagedLocalStorage<TestLocalStorageSchema>(
      (key: string) => ['v1.1', key].join('-'),
      migrations,
    );

    // To migrate
    v1LS.setItem('item1', '');
    v1LS.setItem('item2', '');

    // Already exist
    v11LS.setItem('item2', '');

    // ACT
    v11LS.migrateItems();

    // ASSERT
    // All migrated items have been deleted
    expect(localStorage.getItem('v1-item1')).toBeNull();
    expect(localStorage.getItem('v1-item2')).toBeNull();

    // Migration is done properly for empty non-compressed items
    expect(localStorage.getItem('v1.1-item1')).toBeNull();
    expect(v11LS.getItem('item2')).toEqual('');
  });

  it('should migrate any compressed object', () => {
    // SETUP
    interface TestLocalStorageSchema {
      item1: string;
      item2: string;
    }

    const migrations: Migration[] = [
      {
        migrate: (prevFormattedKey) => {
          const prefix = 'v1-';
          const isMatch = prevFormattedKey.startsWith(prefix);
          if (!isMatch) return;
          const key = prevFormattedKey.slice(prefix.length);
          if (!key) return;
          const nextFormattedKey = ['v1.1', key].join('-');
          migrateAndRemoveItem({ prevFormattedKey, nextFormattedKey });
        },
      },
    ];

    const v1LS = new ManagedLocalStorage<Record<any, any>>((key: string) =>
      ['v1', key].join('-'),
    );
    const v11LS = new ManagedLocalStorage<TestLocalStorageSchema>(
      (key: string) => ['v1.1', key].join('-'),
      migrations,
    );

    // To migrate
    v1LS.setItem('item1', '', true);
    v1LS.setItem('item2', {}, true);

    // ACT
    v11LS.migrateItems();

    // ASSERT
    // All migrated items have been deleted
    expect(localStorage.getItem('v1-item1')).toBeNull();
    expect(localStorage.getItem('v1-item2')).toBeNull();

    // Migration is done properly
    expect(v11LS.getItem('item1')).toEqual('');
    expect(v11LS.getItem('item2')).toStrictEqual({});
  });
});
