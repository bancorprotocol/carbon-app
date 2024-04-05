import { ReactComponent as ReplayIcon } from 'assets/icons/replay.svg';
import { ReactComponent as PauseIcon } from 'assets/icons/pause-sim.svg';
import { ReactComponent as PlayIcon } from 'assets/icons/play.svg';
import { ReactComponent as SkipIcon } from 'assets/icons/skip.svg';
import { useState } from 'react';
import { DropdownMenu } from 'components/common/dropdownMenu';
import {
  PlaybackSpeed,
  playbackSpeedOptions,
  useSimulator,
} from 'components/simulator/result/SimulatorProvider';

export const SimResultChartControls = () => {
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
      label: 'play&pause',
      icon: isRunning && !isStopped ? <PauseIcon /> : <PlayIcon />,
      onClick: playPause,
    },
    {
      label: 'end',
      icon: <SkipIcon />,
      onClick: end,
    },
    {
      label: 'replay',
      icon: <ReplayIcon />,
      onClick: replay,
    },
  ];

  return (
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
            className="h-20 min-w-[20px] place-items-center rounded-[6px] px-2 text-14 hover:bg-black"
            onClick={(e) => {
              setIsOpen(true);
              attr.onClick(e);
            }}
            aria-label="Set Playback Speed"
            data-testid="set-playback-speed"
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
              className="flex w-full rounded-6 py-8 px-12 text-left text-14 text-white/80 hover:bg-black"
              onClick={() => {
                setSpeed(speed);
                setIsOpen(false);
              }}
              data-testid={`set-speed-${speed}`}
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
            className="h-20 w-20 rounded-[6px] p-4 hover:bg-black"
            onClick={onClick}
            data-testid={`animation-controls-${label}`}
          >
            {icon}
          </button>
        );
      })}
    </article>
  );
};
