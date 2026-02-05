import ReplayIcon from 'assets/icons/replay.svg?react';
import PauseIcon from 'assets/icons/pause-sim.svg?react';
import PlayIcon from 'assets/icons/play.svg?react';
import SkipIcon from 'assets/icons/skip.svg?react';
import { useState } from 'react';
import { DropdownMenu } from 'components/common/dropdownMenu';
import { PlaybackSpeed } from 'components/simulator/result/SimulatorProvider';
import { playbackSpeedOptions, useSimulator } from './utils';

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
    <article className="flex h-36 flex-row items-center justify-between gap-12 rounded-[24px] bg-white/10 px-20 flat-glass-shadow">
      <DropdownMenu
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        placement="bottom-end"
        className="min-w-[144px] items-center rounded-[10px] border-0 p-8 text-main-0"
        aria-expanded={isOpen}
        button={(attr) => (
          <button
            {...attr}
            className="text-14 h-20 min-w-[20px] place-items-center rounded-[6px] px-2 hover:bg-main-900/40"
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
              className="rounded-sm text-14 flex w-full px-12 py-8 text-left text-main-0/80 hover:bg-main-900/40"
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
        className="rounded-[6px] p-4 hover:bg-main-900/40"
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
        className="rounded-[6px] p-4 hover:bg-main-900/40"
        onClick={end}
        data-testid="animation-controls-end"
      >
        <SkipIcon className="size-16" />
      </button>
      <button
        aria-label="replay"
        className="rounded-[6px] p-4 hover:bg-main-900/40"
        onClick={replay}
        data-testid="animation-controls-replay"
      >
        <ReplayIcon className="size-16" />
      </button>
    </article>
  );
};
