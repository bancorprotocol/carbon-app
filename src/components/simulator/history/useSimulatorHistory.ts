import { useCallback, useEffect, useState } from 'react';
import { SimulatorHistoryEntry } from 'libs/simulator/history/types';
import {
  deleteSimulatorHistoryEntry,
  getSimulatorHistory,
} from 'libs/simulator/history';
import { lsService } from 'services/localeStorage';

const STORAGE_KEY = lsService.keyFormatter('simulatorHistory');

export const useSimulatorHistory = () => {
  const [history, setHistory] = useState<SimulatorHistoryEntry[]>([]);

  const refresh = useCallback(() => {
    setHistory(getSimulatorHistory());
  }, []);

  useEffect(() => {
    refresh();
    if (typeof window === 'undefined') return;

    const handleStorage = (event: StorageEvent) => {
      if (event.key && event.key !== STORAGE_KEY) return;
      refresh();
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [refresh]);

  const remove = useCallback(
    (id: string) => {
      deleteSimulatorHistoryEntry(id);
      refresh();
    },
    [refresh],
  );

  return { history, remove, refresh };
};
