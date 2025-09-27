import { SimulatorResultSearch } from 'libs/routing/routes/sim';

export type SimulatorHistorySearch = Omit<SimulatorResultSearch, 'historyId'>;

export interface SimulatorHistoryEntry {
  id: string;
  createdAt: string;
  search: SimulatorHistorySearch;
  roi?: number;
  gains?: number;
}
