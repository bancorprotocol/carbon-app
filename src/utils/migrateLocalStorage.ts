// Action types
type MigrationActionWithFormatter = ({
  prevFormattedKey,
  nextFormattedKey,
}: {
  prevFormattedKey: string;
  nextFormattedKey: string;
}) => void;

type MigrationActionWithoutFormatter = ({
  prevFormattedKey,
}: {
  prevFormattedKey: string;
}) => void;

// Migration type
export type Migration = {
  migrate: (prevFormattedKey: string) => void;
};

// ************************** /
// BEWARE!! Migrations functions are not to be changed in ways that affect already defined migrations that use them and are provided to facilitate the migration process and handle edge cases.
// ************************** /

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
      e,
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
