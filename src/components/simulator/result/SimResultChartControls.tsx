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
  const {
    status,
    start,
    end,
    replay,
    playbackSpeed,
    setPlaybackSpeed,
    data,
    animationData,
    onBrush,
    onBrushEnd,
    pause,
    unpause,
  } = useSimulator();
  const [isOpen, setIsOpen] = useState(false);

  const isRunning = status === 'running';
  const isStopped = status === 'ended';
  const isPaused = status === 'paused';

  const setSpeed = (speed: PlaybackSpeed) => {
    setPlaybackSpeed(speed);
    setIsOpen(false);
  };

  const playPause = () => {
    if (isStopped) {
      start();
    } else {
      if (isPaused) unpause();
      else pause();
    }
  };

  return (
    <article className="flex h-36 flex-row items-center justify-between gap-12 rounded-[24px] bg-white/10 px-20">
      <DropdownMenu
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        placement="bottom-end"
        className="min-w-[144px] items-center rounded-[10px] border-0 p-8 text-white"
        aria-expanded={isOpen}
        button={(attr) => (
          <button
            {...attr}
            className="text-14 h-20 min-w-[20px] place-items-center rounded-[6px] px-2 hover:bg-black"
            onClick={(e) => {
              setIsOpen(true);
              attr.onClick(e);
            }}
            aria-label="Set Playback Speed"
            data-testid="set-playback-speed"
          >
            {playbackSpeed}
          </button>
        )}
      >
        {playbackSpeedOptions.map((speed, index) => {
          return (
            <button
              key={`${index}_${speed}`}
              role="menuitem"
              aria-label={`Playback Speed: ${speed}`}
              className="rounded-6 text-14 flex w-full px-12 py-8 text-left text-white/80 hover:bg-black"
              onClick={() => setSpeed(speed)}
              data-testid={`set-speed-${speed}`}
            >
              {speed}
            </button>
          );
        })}
      </DropdownMenu>
      <button
        aria-label="play&pause"
        className="rounded-[6px] p-4 hover:bg-black"
        onClick={playPause}
        data-testid="animation-controls-play&pause"
      >
        {!isRunning || isStopped ? (
          <PlayIcon className="size-16" />
        ) : (
          <PauseIcon className="size-16" />
        )}
      </button>
      <input
        type="range"
        min="1"
        max={data ? data.length : 0}
        value={animationData.length}
        onChange={(e) => onBrush(Number(e.target.value))}
        onMouseUp={onBrushEnd}
        className="hidden h-8 lg:block lg:w-[100px] xl:w-[300px]"
      />
      <button
        aria-label="end"
        className="rounded-[6px] p-4 hover:bg-black"
        onClick={end}
        data-testid="animation-controls-end"
      >
        <SkipIcon className="size-16" />
      </button>
      <button
        aria-label="replay"
        className="rounded-[6px] p-4 hover:bg-black"
        onClick={replay}
        data-testid="animation-controls-replay"
      >
        <ReplayIcon className="size-16" />
      </button>
    </article>
  );
};
