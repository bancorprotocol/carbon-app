import { Activity } from 'libs/queries/extApi/activity';
import { ActivityTable } from './ActivityTable';
import { ActivityFilter } from './ActivityFilter';
import { useList } from 'hooks/useList';

export const ActivitySection = () => {
  const { list: activities } = useList<Activity>();
  return (
    <section className="rounded bg-background-900">
      <header className="flex items-center px-20 py-24">
        <h2>Activity</h2>
        <ActivityFilter />
      </header>
      <ActivityTable activities={activities} />
    </section>
  );
};
