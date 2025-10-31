import { useDialog } from 'hooks/useDialog';
import { useEffect, useRef } from 'react';

const stages = [
  'Initialization',
  'Collected in TAC',
  'Included in TAC consensus',
  'Executed in TAC',
];

interface Props {
  progress: number;
}
export const TrackerDialog = ({ progress }: Props) => {
  const { ref, close, open } = useDialog();
  const hasClosed = useRef(false);

  useEffect(() => {
    if (progress && !hasClosed.current) {
      open();
    }
    if (!progress && !hasClosed.current) {
      // Reset to false for next transaction
      hasClosed.current = false;
      close();
    }
  }, [close, open, progress, ref]);

  return (
    <dialog ref={ref} className="modal">
      <form method="dialog" className="grid gap-24 relative overflow-clip">
        <div className="statusBar bg-primary/25 absolute inset-x-0 top-0 h-6" />
        <h3>Transaction Progress</h3>
        <ol className="grid gap-16">
          {stages.map((value, i) => {
            const checked = i < progress;
            return (
              <li className="flex items-center gap-8" key={i}>
                <div
                  className="p-4 rounded-sm bg-main-900/60 aria-checked:bg-gradient"
                  role="checkbox"
                  aria-checked={checked}
                >
                  <svg
                    width="16"
                    height="16"
                    focusable="false"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      className="transition-[stroke-dashoffset] transition-duration-300"
                      fill="none"
                      stroke="black"
                      d="M 2 13 L 8 19 L 23 5"
                      strokeWidth="2"
                      strokeDasharray="30"
                      strokeDashoffset={checked ? 0 : 30}
                    />
                  </svg>
                </div>
                <span>{value}</span>
              </li>
            );
          })}
        </ol>
        <button
          className="btn-on-surface"
          onClick={() => (hasClosed.current = true)}
        >
          Close
        </button>
      </form>
    </dialog>
  );
};
