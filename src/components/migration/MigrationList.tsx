import { FC, useMemo, useState } from 'react';
import { MigratedPosition } from './type';
import { MigrationCard } from './MigrationCard';
import { PositionDialog } from './MigrationDialog';

interface Props {
  positions: MigratedPosition[];
}

export const MigrationList: FC<Props> = ({ positions }) => {
  const [selectedIndex, setSelectedIndex] = useState<number>();

  const selectedPosition = useMemo(() => {
    if (typeof selectedIndex !== 'number') return;
    if (!positions) return;
    return positions[selectedIndex];
  }, [selectedIndex, positions]);

  return (
    <>
      <ul className="grid gap-16 grid-fill-350">
        {positions.map((p, i) => (
          <li
            key={`${p.dex}-${p.id}`}
            className="surface rounded-2xl grid gap-16 p-16"
          >
            <MigrationCard position={p} />
            <button
              className="btn-on-surface"
              onClick={() => setSelectedIndex(i)}
            >
              Migrate
            </button>
          </li>
        ))}
      </ul>
      {selectedPosition && (
        <PositionDialog
          position={selectedPosition}
          onClose={() => setSelectedIndex(-1)}
        />
      )}
    </>
  );
};
