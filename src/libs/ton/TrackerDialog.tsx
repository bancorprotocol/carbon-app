import { Button } from 'components/common/button';
import { useDialog } from 'hooks/useDialog';
import { useEffect } from 'react';

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
  const { ref, lightDismiss } = useDialog();
  useEffect(() => {
    if (progress && !ref.current?.open) {
      ref.current?.showModal();
    }
    if (!progress && ref.current?.open) {
      ref.current?.close();
    }
  }, [progress, ref]);
  return (
    <dialog ref={ref} className="modal" onClick={lightDismiss}>
      <form method="dialog" className="grid gap-24 relative overflow-clip">
        <div className="statusBar bg-primary/25 absolute inset-x-0 top-0 h-6" />
        <h3>Transaction Progress</h3>
        <ol className="grid gap-16">
          {stages.map((value, i) => {
            const checked = i < progress;
            return (
              <li className="flex items-center gap-8" key={i}>
                <div
                  className="p-4 rounded-sm bg-black aria-checked:bg-gradient"
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
        <Button variant="secondary">Close</Button>
      </form>
    </dialog>
  );
};
