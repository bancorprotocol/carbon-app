import { ReactComponent as ReplayIcon } from 'assets/icons/replay.svg';
import { ReactComponent as PauseIcon } from 'assets/icons/pause-sim.svg';
import { ReactComponent as PlayIcon } from 'assets/icons/play.svg';
import { ReactComponent as SkipIcon } from 'assets/icons/skip.svg';
import { useSimulator } from 'libs/d3';
import { useState } from 'react';
import { DropdownMenu } from 'components/common/dropdownMenu';
import {
  PlaybackSpeed,
  playbackSpeedOptions,
} from 'libs/d3/sim/SimulatorProvider';

interface Props {
  showSummary: boolean;
}

export const SimulatorControls = ({ showSummary }: Props) => {
  const { status, start, pauseToggle, end, playbackSpeed, setPlaybackSpeed } =
    useSimulator();
  const [isOpen, setIsOpen] = useState(false);

  const [isRunning, setIsRunning] = useState(status === 'running');
  const [currentPlaybackSpeed, setCurrentPlaybackSpeed] =
    useState(playbackSpeed);
  const isStopped = status === 'ended';

  const setSpeed = (speed: PlaybackSpeed) => {
    setPlaybackSpeed(speed);
    setCurrentPlaybackSpeed(speed);
  };

  const replay = () => {
    if (isRunning) {
      pauseToggle();
    }
    setIsRunning(true);
    start();
  };

  const playPause = () => {
    if (isStopped) {
      replay();
      return;
    }
    setIsRunning(!isRunning);
    pauseToggle();
  };

  const buttons = [
    {
      label: 'Play/Pause',
      icon: isRunning && !isStopped ? <PauseIcon /> : <PlayIcon />,
      onClick: () => playPause(),
    },
    {
      label: 'End',
      icon: <SkipIcon />,
      onClick: () => end(),
    },
    {
      label: 'Replay',
      icon: <ReplayIcon />,
      onClick: () => replay(),
    },
  ];

  return (
    <>
      {!showSummary && (
        <article className="flex flex-row items-center justify-between gap-12 rounded-[24px] bg-white/10 px-20 py-8">
          <DropdownMenu
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            placement="bottom-end"
            className="min-w-[144px] items-center rounded-[10px] border-0 p-8 text-white"
            aria-expanded={isOpen}
            button={(attr) => (
              <button
                {...attr}
                className="hover:bg-body h-20 min-w-[20px] place-items-center rounded-[6px] px-2 text-14"
                onClick={(e) => {
                  setIsOpen(true);
                  attr.onClick(e);
                }}
                aria-label="Set Playback Speed"
              >
                {currentPlaybackSpeed}
              </button>
            )}
          >
            {playbackSpeedOptions.map((speed, index) => {
              return (
                <button
                  key={`${index}_${speed}`}
                  role="menuitem"
                  aria-label={`Playback Speed: ${speed}`}
                  className="hover:bg-body flex w-full rounded-6 py-8 px-12 text-left text-14 text-white/80"
                  onClick={() => {
                    setSpeed(speed);
                    setIsOpen(false);
                  }}
                >
                  {speed}
                </button>
              );
            })}
          </DropdownMenu>
          {buttons.map(({ label, onClick, icon }) => {
            return (
              <button
                key={label}
                aria-label={label}
                className="hover:bg-body h-20 w-20 rounded-[6px] p-4"
                onClick={onClick}
              >
                {icon}
              </button>
            );
          })}
        </article>
      )}
    </>
  );
};
