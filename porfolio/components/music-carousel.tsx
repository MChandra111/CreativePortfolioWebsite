"use client";

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ChevronDown, ChevronUp, Pause, Play } from "lucide-react";
import { useAudioVisualizer } from "@tkhdev/react-audio-visualizer";
import type { Song } from "@/lib/music";
import { songs as defaultSongs } from "@/lib/music";

interface MusicCarouselProps {
  songs?: Song[];
}

type VisualizerControls = {
  start: () => void;
  stop: () => void;
};

function resolveAudioSrc(src: string): string {
  try {
    return new URL(src, window.location.href).href;
  } catch {
    return src;
  }
}

function waitForAudioReady(audio: HTMLAudioElement): Promise<void> {
  if (audio.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const onReady = () => {
      cleanup();
      resolve();
    };
    const onError = () => {
      cleanup();
      const code = audio.error?.code;
      const message = audio.error?.message ?? "Unknown media error";
      reject(new Error(`Audio failed to load (code ${code ?? "?"}): ${message}`));
    };
    const cleanup = () => {
      audio.removeEventListener("canplay", onReady);
      audio.removeEventListener("error", onError);
    };

    audio.addEventListener("canplay", onReady);
    audio.addEventListener("error", onError);
  });
}

async function playAudioElement(audio: HTMLAudioElement, src: string): Promise<void> {
  const resolved = resolveAudioSrc(src);
  if (audio.src !== resolved) {
    audio.src = src;
    audio.load();
  }
  await waitForAudioReady(audio);
  await audio.play();
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

function PlaybackProgress({
  audio,
  trackId,
}: {
  audio: HTMLAudioElement;
  trackId: string;
}) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentTime(0);
    setDuration(0);
  }, [trackId]);

  useEffect(() => {
    const syncDuration = () => {
      if (Number.isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const onTimeUpdate = () => {
      if (!isSeeking) {
        setCurrentTime(audio.currentTime);
      }
    };

    const onLoadStart = () => {
      setCurrentTime(0);
      setDuration(0);
    };

    const onEnded = () => {
      setCurrentTime(0);
    };

    syncDuration();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentTime(audio.currentTime);

    audio.addEventListener("loadedmetadata", syncDuration);
    audio.addEventListener("durationchange", syncDuration);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadstart", onLoadStart);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", syncDuration);
      audio.removeEventListener("durationchange", syncDuration);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadstart", onLoadStart);
      audio.removeEventListener("ended", onEnded);
    };
  }, [audio, isSeeking]);

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeek = (value: number) => {
    if (!Number.isFinite(duration) || duration <= 0) return;
    const nextTime = Math.min(Math.max(value, 0), duration);
    setCurrentTime(nextTime);
    // eslint-disable-next-line react-hooks/immutability
    audio.currentTime = nextTime;
  };

  return (
    <div className="shrink-0 space-y-2">
      <input
        type="range"
        min={0}
        max={duration || 0}
        step={0.1}
        value={currentTime}
        disabled={duration <= 0}
        onChange={(e) => handleSeek(Number(e.target.value))}
        onPointerDown={() => setIsSeeking(true)}
        onPointerUp={() => setIsSeeking(false)}
        onPointerCancel={() => setIsSeeking(false)}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[#71AD9B]/25 accent-[#71AD9B] disabled:cursor-not-allowed disabled:opacity-50 [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-[#71AD9B] [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#71AD9B]"
        style={{
          background: `linear-gradient(to right, #71AD9B ${progressPercent}%, rgb(113 173 155 / 0.25) ${progressPercent}%)`,
        }}
        aria-label="Seek"
        aria-valuemin={0}
        aria-valuemax={duration || 0}
        aria-valuenow={currentTime}
      />
      <div className="flex justify-between text-xs tabular-nums text-[#71AD9B]">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}

function AudioVisualizerPanel({
  audio,
  activeSong,
  isPlaying,
  onReady,
}: {
  audio: HTMLAudioElement;
  activeSong: Song;
  isPlaying: boolean;
  onReady: (controls: VisualizerControls) => void;
}) {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const { canvasRef, start, stop } = useAudioVisualizer({
    source: audio,
    mode: "frequency-dots",
    barColor: "#71AD9B",
    backgroundColor: "transparent",
  });

  useEffect(() => {
    onReady({ start, stop });
  }, [onReady, start, stop]);

  useLayoutEffect(() => {
    const container = canvasContainerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const fitCanvas = () => {
      const width = Math.floor(container.clientWidth);
      const height = Math.floor(container.clientHeight);
      if (width <= 0 || height <= 0) return;

      canvas.width = width;
      canvas.height = height;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    fitCanvas();
    const observer = new ResizeObserver(fitCanvas);
    observer.observe(container);
    return () => observer.disconnect();
  }, [canvasRef]);

  return (
    <div className="flex h-full min-h-[min(68vh,520px)] flex-col gap-4 overflow-hidden rounded-2xl border border-[#71AD9B]/30 bg-[#ffffde]/60 p-6 md:p-8">
      <div className="shrink-0">
        <p className="text-sm font-medium uppercase tracking-wide text-[#71AD9B]">
          {isPlaying ? "Now playing" : "Selected"}
        </p>
        <h2 className="mt-1 text-2xl font-bold text-[#502419] md:text-3xl">
          {activeSong.title}
        </h2>
        <p className="mt-1 text-[#71AD9B]">
          {activeSong.artist}
          {activeSong.duration ? ` · ${activeSong.duration}` : ""}
        </p>
      </div>

      <div
        ref={canvasContainerRef}
        className="min-h-70 w-full min-w-0 flex-1 overflow-hidden rounded-xl"
      >
        <canvas ref={canvasRef} className="block h-full w-full" aria-hidden />
      </div>

      <PlaybackProgress audio={audio} trackId={activeSong.id} />
    </div>
  );
}

export default function MusicCarousel({ songs = defaultSongs }: MusicCarouselProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const visualizerControlsRef = useRef<VisualizerControls | null>(null);
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [activeId, setActiveId] = useState(songs[0]?.id ?? "");
  const [isPlaying, setIsPlaying] = useState(false);

  const activeSong = songs.find((s) => s.id === activeId) ?? songs[0];

  const handleVisualizerReady = useCallback((controls: VisualizerControls) => {
    visualizerControlsRef.current = controls;
  }, []);

  const scrollBy = (direction: "up" | "down") => {
    const el = listRef.current;
    if (!el) return;
    const step = el.clientHeight * 0.55;
    el.scrollBy({ top: direction === "down" ? step : -step, behavior: "smooth" });
  };

  const loadTrack = useCallback((audio: HTMLAudioElement, src: string) => {
    const resolved = resolveAudioSrc(src);
    if (audio.src !== resolved) {
      audio.pause();
      visualizerControlsRef.current?.stop();
      setIsPlaying(false);
      audio.src = src;
      audio.load();
    }
  }, []);

  const selectSong = useCallback(
    (song: Song, scrollIntoView = true) => {
      const audio = audioRef.current;
      if (song.id !== activeId) {
        if (audio) {
          loadTrack(audio, song.src);
        }
        setActiveId(song.id);
      }
      if (scrollIntoView) {
        itemRefs.current.get(song.id)?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    },
    [activeId, loadTrack]
  );

  const togglePlay = useCallback(
    async (song: Song) => {
      const audio = audioRef.current;
      if (!audio) return;

      if (song.id !== activeId) {
        setActiveId(song.id);
      }

      if (isPlaying && song.id === activeId) {
        audio.pause();
        return;
      }

      try {
        await playAudioElement(audio, song.src);
      } catch (err) {
        console.error("Playback failed:", err);
        setIsPlaying(false);
      }
    },
    [activeId, isPlaying]
  );

  useLayoutEffect(() => {
    if (audioRef.current) {
      setAudioElement(audioRef.current);
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlaying = () => {
      setIsPlaying(true);
      try {
        void visualizerControlsRef.current?.start();
      } catch (err) {
        console.error("Visualizer start failed:", err);
      }
    };
    const onPause = () => {
      setIsPlaying(false);
      visualizerControlsRef.current?.stop();
    };
    const onEnded = () => {
      setIsPlaying(false);
      visualizerControlsRef.current?.stop();
    };

    audio.addEventListener("playing", onPlaying);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("playing", onPlaying);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  if (!activeSong) {
    return null;
  }

  return (
    <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-10">
      <section className="flex min-h-[min(68vh,520px)] min-w-0 lg:col-span-2">
        {audioElement ? (
          <div className="h-full w-full">
            <AudioVisualizerPanel
              audio={audioElement}
              activeSong={activeSong}
              isPlaying={isPlaying}
              onReady={handleVisualizerReady}
            />
          </div>
        ) : (
          <div className="flex min-h-[min(68vh,520px)] items-center justify-center rounded-2xl border border-[#71AD9B]/30 bg-[#ffffde]/60 p-8">
            <p className="text-[#71AD9B]">Loading player…</p>
          </div>
        )}
      </section>

      <section className="flex flex-col lg:col-span-1">
        <div className="relative w-full">
          <button
            type="button"
            onClick={() => scrollBy("up")}
            className="absolute -top-2 left-1/2 z-10 -translate-x-1/2 rounded-full bg-[#71AD9B]/20 p-1.5 text-[#71AD9B] transition-colors hover:bg-[#71AD9B]/35"
            aria-label="Scroll up"
          >
            <ChevronUp size={22} />
          </button>

          <div
            ref={listRef}
            className="scrollbar-thin flex h-[min(68vh,520px)] flex-col gap-3 overflow-y-auto scroll-smooth px-1 py-10 [scrollbar-color:#71AD9B_transparent]"
            style={{ scrollSnapType: "y mandatory" }}
          >
            {songs.toReversed().map((song) => {
              const isActive = song.id === activeId;
              const showPause = isActive && isPlaying;

              return (
                <motion.div
                  key={song.id}
                  ref={(el) => {
                    if (el) itemRefs.current.set(song.id, el);
                    else itemRefs.current.delete(song.id);
                  }}
                  layout
                  initial={false}
                  animate={{
                    scale: isActive ? 1.02 : 1,
                    opacity: isActive ? 1 : 0.72,
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                  className={`flex w-full shrink-0 snap-center items-center gap-3 rounded-2xl border px-3 py-3 transition-colors ${
                    isActive
                      ? "border-[#71AD9B] bg-[#ffffde] shadow-md"
                      : "border-[#71AD9B]/25 bg-[#FFFFE7]/80 hover:border-[#71AD9B]/50"
                  }`}
                  style={{ scrollSnapAlign: "center" }}
                >
                  <button
                    type="button"
                    onClick={() => selectSong(song)}
                    className="flex min-w-0 flex-1 items-center gap-3 text-left"
                  >
                    <span
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-[#FFFFE7]"
                      style={{
                        background: isActive
                          ? "linear-gradient(135deg, #71AD9B, #502419)"
                          : "linear-gradient(135deg, #71AD9B99, #71AD9B)",
                      }}
                      aria-hidden
                    >
                      {song.title.slice(0, 2).toUpperCase()}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-base font-semibold text-[#502419]">
                        {song.title}
                      </span>
                      <span className="block truncate text-xs text-[#71AD9B]">
                        {song.artist}
                      </span>
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => void togglePlay(song)}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#71AD9B] text-[#FFFFE7] transition-transform hover:scale-105 active:scale-95"
                    aria-label={showPause ? `Pause ${song.title}` : `Play ${song.title}`}
                  >
                    {showPause ? (
                      <Pause size={18} fill="currentColor" />
                    ) : (
                      <Play size={18} className="ml-0.5" fill="currentColor" />
                    )}
                  </button>
                </motion.div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => scrollBy("down")}
            className="absolute -bottom-2 left-1/2 z-10 -translate-x-1/2 rounded-full bg-[#71AD9B]/20 p-1.5 text-[#71AD9B] transition-colors hover:bg-[#71AD9B]/35"
            aria-label="Scroll down"
          >
            <ChevronDown size={22} />
          </button>
        </div>
      </section>

      <audio
        ref={audioRef}
        src={activeSong.src}
        crossOrigin="anonymous"
        preload="auto"
        className="hidden"
        onError={() => {
          const err = audioRef.current?.error;
          console.error("Audio element error:", err?.code, err?.message);
        }}
      />
    </div>
  );
}
