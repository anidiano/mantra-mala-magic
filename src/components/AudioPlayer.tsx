import { useEffect, useRef, useState } from "react";
import { Pause, Play, Volume1, Volume2, VolumeX } from "lucide-react";
import { useMantra } from "@/contexts/MantraContext";
import { cn } from "@/lib/utils";

export function AudioPlayer() {
  const { isPlaying, togglePlayback, playbackSpeed, setPlaybackSpeed } = useMantra();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [volume, setVolume] = useState(0.5);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);

  useEffect(() => {
    const audio = new Audio("/mantras/shri-swami-samarth.mp3");
    audio.loop = true;
    audio.volume = volume;
    audio.playbackRate = playbackSpeed;
    audio.preload = "auto";
    
    audio.addEventListener("canplaythrough", () => {
      console.log("Audio loaded successfully");
      setAudioLoaded(true);
      setAudioError(null);
    });
    
    audio.addEventListener("error", (e) => {
      console.error("Audio error:", e);
      setAudioError("Could not load audio file. Please check that the file exists.");
      setAudioLoaded(true);
    });
    
    audioRef.current = audio;
    
    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(e => {
          console.error("Error playing audio:", e);
          if (e.name === "NotAllowedError") {
            setAudioError("Playback was blocked. Please interact with the page first.");
          }
        });
      }
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.playbackRate = playbackSpeed;
  }, [playbackSpeed]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
  }, [volume]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const handlePlaybackSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
  };

  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <div className="glass-morphism rounded-xl p-4 w-full max-w-xs mx-auto mb-4 animate-slide-up">
      <div className="flex items-center justify-center mb-3">
        <button
          onClick={togglePlayback}
          className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center transition-all hover:scale-105 active:scale-95"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="h-6 w-6 animate-scale-up" />
          ) : (
            <Play className="h-6 w-6 ml-0.5 animate-scale-up" />
          )}
        </button>
      </div>
      
      <div className="flex items-center justify-center space-x-3 mb-3">
        <VolumeIcon className="h-4 w-4 text-muted-foreground" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="w-full h-2 bg-secondary rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
          aria-label="Volume"
        />
      </div>
      
      <div className="flex items-center justify-between gap-2 text-sm">
        <button
          onClick={() => handlePlaybackSpeedChange(0.75)}
          className={cn(
            "px-3 py-1 rounded-full transition-all",
            playbackSpeed === 0.75
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          )}
        >
          Slow
        </button>
        <button
          onClick={() => handlePlaybackSpeedChange(1)}
          className={cn(
            "px-3 py-1 rounded-full transition-all",
            playbackSpeed === 1
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          )}
        >
          Normal
        </button>
        <button
          onClick={() => handlePlaybackSpeedChange(1.5)}
          className={cn(
            "px-3 py-1 rounded-full transition-all",
            playbackSpeed === 1.5
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          )}
        >
          Fast
        </button>
      </div>
      
      {!audioLoaded && (
        <p className="text-xs text-muted-foreground mt-2 animate-pulse">
          Loading audio...
        </p>
      )}
      
      {audioError && (
        <p className="text-xs text-red-500 mt-2">
          {audioError}
        </p>
      )}
    </div>
  );
}

export default AudioPlayer;
