type OldKeyExtractor = (key: string) => string | undefined;
type NewKeyFormatter = (key: string) => string;

// Action types
type MigrationActionWithFormatter = ({
  oldFormattedKey,
  newFormattedKey,
  key,
}: {
  key: string;
  oldFormattedKey: string;
  newFormattedKey: string;
}) => void;

type MigrationActionWithoutFormatter = ({
  oldFormattedKey,
  key,
}: {
  key: string;
  oldFormattedKey: string;
}) => void;

// Migration types
interface MigrationWithKeyFormatter {
  action: MigrationActionWithFormatter;
  oldKeyExtractor: OldKeyExtractor;
  newKeyFormatter: NewKeyFormatter;
}

interface MigrationWithoutKeyFormatter {
  action: MigrationActionWithoutFormatter;
  oldKeyExtractor: OldKeyExtractor;
  newKeyFormatter?: NewKeyFormatter;
}

// Union type for migrations
export type Migration =
  | MigrationWithKeyFormatter
  | MigrationWithoutKeyFormatter;

/**
 * Migrates data from an old key to a new key in localStorage and removes the old key.
 * If the new key already exists, it does not overwrite the existing data.
 * In case of an error during migration, it attempts to remove the new key to avoid partial data migration.
 *
 * @param {Object} params - The parameters object.
 * @param {string} params.oldFormattedKey - The old key in localStorage to migrate data from.
 * @param {string} params.newFormattedKey - The new key in localStorage to migrate data to.
 */
export const migrateAndRemoveItem: MigrationActionWithFormatter = ({
  oldFormattedKey,
  newFormattedKey,
}) => {
  const oldObj = localStorage.getItem(oldFormattedKey);
  localStorage.removeItem(oldFormattedKey);
  if (!oldObj || !newFormattedKey) return;
  try {
    const oldObjParsed = JSON.parse(oldObj);
    if (!localStorage.getItem(newFormattedKey) && !!oldObjParsed) {
      localStorage.setItem(newFormattedKey, oldObj);
    }
  } catch (e) {
    localStorage.removeItem(newFormattedKey);
    console.error(
      `Migration from ${oldFormattedKey} to ${newFormattedKey} has failed`,
      e
    );
  }
};

/**
 * Removes a specified key from localStorage.
 *
 * @param {Object} params - The parameters object.
 * @param {string} params.oldFormattedKey - The key in localStorage to be removed.
 */
export const removeItem: MigrationActionWithoutFormatter = ({
  oldFormattedKey,
}) => localStorage.removeItem(oldFormattedKey);

export class MigratorLocalStorage {
  private readonly migrations: Migration[] = [];
  constructor(migrations?: Migration[]) {
    if (migrations) this.migrations = migrations;
  }

  migrateItem = (oldFormattedKey: string) => {
    this.migrations.forEach(({ action, oldKeyExtractor, newKeyFormatter }) => {
      const key = oldKeyExtractor(oldFormattedKey);
      if (!key) return;
      const newFormattedKey = newKeyFormatter ? newKeyFormatter(key) : '';
      action({ key, oldFormattedKey, newFormattedKey });
    });
  };

  migrateAllItems = () => {
    if (!this.migrations?.length) return;
    Object.keys(localStorage).forEach((oldFormattedKey) =>
      this.migrateItem(oldFormattedKey)
    );
  };
}
