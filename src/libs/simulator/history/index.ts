import { lsService } from 'services/localeStorage';
import { uuid } from 'utils/helpers';
import { SimulatorHistoryEntry, SimulatorHistorySearch } from './types';

const HISTORY_KEY = 'simulatorHistory';
const HISTORY_LIMIT = 10;

const read = (): SimulatorHistoryEntry[] => {
  return lsService.getItem(HISTORY_KEY) ?? [];
};

const write = (entries: SimulatorHistoryEntry[]) => {
  lsService.setItem(HISTORY_KEY, entries);
};

export const getSimulatorHistory = (): SimulatorHistoryEntry[] => {
  return read();
};

export const addSimulatorHistoryEntry = (
  search: SimulatorHistorySearch,
): SimulatorHistoryEntry => {
  const entry: SimulatorHistoryEntry = {
    id: uuid(),
    createdAt: new Date().toISOString(),
    search,
  };

  const history = read();
  const updated = [entry, ...history].slice(0, HISTORY_LIMIT);
  write(updated);

  return entry;
};

export const updateSimulatorHistoryEntry = (
  id: string,
  update: Partial<Omit<SimulatorHistoryEntry, 'id' | 'createdAt'>> & {
    search?: SimulatorHistorySearch;
  },
): SimulatorHistoryEntry | undefined => {
  const history = read();
  let nextEntry: SimulatorHistoryEntry | undefined;

  const updated = history.map((entry) => {
    if (entry.id !== id) {
      return entry;
    }

    nextEntry = {
      ...entry,
      ...update,
      search: update.search ?? entry.search,
    };

    return nextEntry;
  });

  if (!nextEntry) return undefined;

  write(updated);
  return nextEntry;
};

export const deleteSimulatorHistoryEntry = (id: string) => {
  const history = read();
  const updated = history.filter((entry) => entry.id !== id);
  if (updated.length === history.length) return;
  write(updated);
};

export const findSimulatorHistoryEntry = (id: string) => {
  return read().find((entry) => entry.id === id);
};

export type { SimulatorHistoryEntry, SimulatorHistorySearch } from './types';
