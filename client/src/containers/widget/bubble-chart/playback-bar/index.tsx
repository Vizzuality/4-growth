import { FC, MouseEvent, useMemo, useRef } from "react";

import { PauseIcon, PlayIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

interface PlaybackBarProps {
  isPlaying: boolean;
  onPlayButtonClick: () => void;
  timeMarkers: number[];
  currentIndex: number;
  onTimeMarkerClick: (index: number) => void;
}

const PlaybackBar: FC<PlaybackBarProps> = ({
  isPlaying,
  onPlayButtonClick,
  timeMarkers,
  currentIndex,
  onTimeMarkerClick,
}) => {
  const positions = useMemo(
    () =>
      timeMarkers.map((_, i) =>
        timeMarkers.length > 1 ? (i / (timeMarkers.length - 1)) * 100 : 0,
      ),
    [timeMarkers],
  );
  const progressPercent = useMemo(
    () =>
      timeMarkers.length > 1
        ? (currentIndex / (timeMarkers.length - 1)) * 100
        : 0,
    [timeMarkers, currentIndex],
  );
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const handleProgressBarClick = (e: MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickPercent = (clickX / rect.width) * 100;

    // Find the marker with minimum distance to clickPercent
    let closestIndex = 0;
    let minDiff = Math.abs(clickPercent - positions[0]);

    for (let i = 1; i < positions.length; i++) {
      const diff = Math.abs(clickPercent - positions[i]);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = i;
      }
    }

    onTimeMarkerClick(closestIndex);
  };

  return (
    <div className="flex w-full flex-1 items-center gap-4">
      <Button
        className="h-12 w-12 rounded-full p-0"
        onClick={onPlayButtonClick}
        aria-label={isPlaying ? "Pause animation" : "Play animation"}
      >
        {isPlaying ? <PauseIcon size={20} /> : <PlayIcon size={20} />}
      </Button>

      <div
        ref={progressBarRef}
        onClick={handleProgressBarClick}
        className="group relative h-6 flex-1 cursor-pointer select-none"
        aria-label="Playback progress bar"
      >
        {/* Background bar */}
        <div
          className="absolute left-0 right-0 top-1/2 h-1 rounded bg-gray-300"
          style={{ transform: "translateY(-50%)" }}
        />

        {/* Filled progress */}
        <div
          className="absolute left-0 top-1/2 h-1 rounded bg-blue-600 transition-[width] duration-300 ease-in-out"
          style={{
            width: `${progressPercent}%`,
            transform: "translateY(-50%)",
          }}
        />

        {timeMarkers.map((label, index) => {
          const leftPercent =
            timeMarkers.length > 1
              ? (index / (timeMarkers.length - 1)) * 100
              : 0;

          const isActive = index === currentIndex;

          return (
            <button
              key={index}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onTimeMarkerClick(index);
              }}
              aria-label={`Go to time ${label}`}
              className={`absolute top-1/2 h-5 w-0.5 -translate-y-1/2 border border-secondary bg-transparent opacity-0 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-secondary ${
                isActive ? "h-6 border-blue-600 opacity-100" : ""
              } group-hover:h-5 group-hover:opacity-100`}
              style={{
                left: `${leftPercent}%`,
                transform: `translate(-50%, -50%)`,
              }}
            >
              {isActive && (
                <span className="pointer-events-none absolute bottom-full left-1/2 mb-1 -translate-x-1/2 select-none whitespace-nowrap text-xs text-white">
                  {label}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PlaybackBar;
