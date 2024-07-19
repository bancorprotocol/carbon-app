type MigrationAction = ({
  oldFormattedKey,
  newFormattedKey,
  key,
}: {
  oldFormattedKey: string;
  newFormattedKey: string;
  key: string;
}) => void;

export interface Migration {
  matcher: (key: string) => string | undefined;
  action: MigrationAction;
}

/**
 * Migrates data from an old key to a new key in localStorage and removes the old key.
 * If the new key already exists, it does not overwrite the existing data.
 * In case of an error during migration, it attempts to remove the new key to avoid partial data migration.
 *
 * @param {Object} params - The parameters object.
 * @param {string} params.oldFormattedKey - The old key in localStorage to migrate data from.
 * @param {string} params.newFormattedKey - The new key in localStorage to migrate data to.
 */
export const migrateAndRemoveItem: MigrationAction = ({
  oldFormattedKey,
  newFormattedKey,
}) => {
  const oldObj = localStorage.getItem(oldFormattedKey);
  if (!oldObj) return;
  try {
    localStorage.removeItem(oldFormattedKey);
    if (!localStorage.getItem(newFormattedKey)) {
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
export const removeItem: MigrationAction = ({ oldFormattedKey }) =>
  localStorage.removeItem(oldFormattedKey);
