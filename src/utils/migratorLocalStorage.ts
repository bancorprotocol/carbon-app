type PrevKeyExtractor = (key: string) => string | undefined;
type NextKeyFormatter = (key: string) => string;

// Action types
type MigrationActionWithFormatter = ({
  prevFormattedKey,
  nextFormattedKey,
  key,
}: {
  key: string;
  prevFormattedKey: string;
  nextFormattedKey: string;
}) => void;

type MigrationActionWithoutFormatter = ({
  prevFormattedKey,
  key,
}: {
  key: string;
  prevFormattedKey: string;
}) => void;

// Migration types
interface MigrationWithKeyFormatter {
  action: MigrationActionWithFormatter;
  prevKeyExtractor: PrevKeyExtractor;
  nextKeyFormatter: NextKeyFormatter;
}

interface MigrationWithoutKeyFormatter {
  action: MigrationActionWithoutFormatter;
  prevKeyExtractor: PrevKeyExtractor;
  nextKeyFormatter?: NextKeyFormatter;
}

// Union type for migrations
export type Migration =
  | MigrationWithKeyFormatter
  | MigrationWithoutKeyFormatter;

/**
 * Migrates data from an previous (prev) key to a next key in localStorage and removes the prev key.
 * If the next key already exists, it does not overwrite the existing data.
 * In case of an error during migration, it attempts to remove the next key to avoid partial data migration.
 *
 * @param {Object} params - The parameters object.
 * @param {string} params.prevFormattedKey - The prev key in localStorage to migrate data from.
 * @param {string} params.nextFormattedKey - The next key in localStorage to migrate data to.
 */
export const migrateAndRemoveItem: MigrationActionWithFormatter = ({
  prevFormattedKey,
  nextFormattedKey,
}) => {
  const prevObj = localStorage.getItem(prevFormattedKey);
  localStorage.removeItem(prevFormattedKey);
  if (!prevObj || !nextFormattedKey) return;
  try {
    const prevObjParsed = JSON.parse(prevObj);
    if (!localStorage.getItem(nextFormattedKey) && !!prevObjParsed) {
      localStorage.setItem(nextFormattedKey, prevObj);
    }
  } catch (e) {
    localStorage.removeItem(nextFormattedKey);
    console.error(
      `Migration from ${prevFormattedKey} to ${nextFormattedKey} has failed`,
      e
    );
  }
};

/**
 * Removes a specified key from localStorage.
 *
 * @param {Object} params - The parameters object.
 * @param {string} params.prevFormattedKey - The key in localStorage to be removed.
 */
export const removeItem: MigrationActionWithoutFormatter = ({
  prevFormattedKey,
}) => localStorage.removeItem(prevFormattedKey);

export class MigratorLocalStorage {
  private readonly migrations: Migration[] = [];
  constructor(migrations?: Migration[]) {
    if (migrations) this.migrations = migrations;
  }

  migrateItem = (prevFormattedKey: string) => {
    this.migrations.forEach(
      ({ action, prevKeyExtractor, nextKeyFormatter }) => {
        const key = prevKeyExtractor(prevFormattedKey);
        if (!key) return;
        const nextFormattedKey = nextKeyFormatter ? nextKeyFormatter(key) : '';
        action({ key, prevFormattedKey, nextFormattedKey });
      }
    );
  };

  migrateAllItems = () => {
    if (!this.migrations?.length) return;
    Object.keys(localStorage).forEach((prevFormattedKey) =>
      this.migrateItem(prevFormattedKey)
    );
  };
}
