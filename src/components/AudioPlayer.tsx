
import { useEffect, useRef, useState } from "react";
import { Pause, Play, Volume1, Volume2, VolumeX, FileAudio, Upload } from "lucide-react";
import { useMantra } from "@/contexts/MantraContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function AudioPlayer() {
  const { isPlaying, togglePlayback, playbackSpeed, setPlaybackSpeed, incrementCount } = useMantra();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [volume, setVolume] = useState(0.5);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [audioSource, setAudioSource] = useState<string>("/mantras/shri-swami-samarth.mp3");
  const [audioName, setAudioName] = useState<string>("Shri Swami Samarth");

  // Setup audio element with current settings
  const setupAudio = (source: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }

    setAudioLoaded(false);
    setAudioError(null);
    
    const audio = new Audio(source);
    audio.loop = false; // We'll handle looping manually to increment counter
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
      setAudioError("Could not load audio file. Please check that the file is a valid audio format.");
      setAudioLoaded(true);
    });

    // When audio ends, increment the mantra count and replay if still playing
    audio.addEventListener("ended", () => {
      incrementCount();
      if (isPlaying) {
        audio.currentTime = 0;
        audio.play().catch(err => console.error("Error replaying audio:", err));
      }
    });
    
    audioRef.current = audio;
    
    return audio;
  };

  // Initial audio setup on component mount
  useEffect(() => {
    const audio = setupAudio(audioSource);
    
    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, []);

  // Handle play/pause
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

  // Handle playback speed changes
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.playbackRate = playbackSpeed;
  }, [playbackSpeed]);

  // Handle volume changes
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

  // Handle audio file upload
  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check if file is an audio file
    if (!file.type.startsWith('audio/')) {
      toast.error("Please upload an audio file");
      return;
    }
    
    // Create object URL for the uploaded file
    const objectUrl = URL.createObjectURL(file);
    setAudioSource(objectUrl);
    setAudioName(file.name.split('.')[0]); // Set name without extension
    
    // Setup new audio with uploaded file
    setupAudio(objectUrl);
    
    toast.success(`Uploaded mantra: ${file.name}`);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Trigger file input click
  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <div className="glass-morphism rounded-xl p-4 w-full max-w-xs mx-auto mb-4 animate-slide-up">
      <div className="flex items-center justify-between mb-3">
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
        
        <div className="flex space-x-2">
          <button
            onClick={triggerFileUpload}
            className="p-2 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center transition-all hover:bg-secondary/80"
            aria-label="Upload audio"
          >
            <Upload className="h-4 w-4" />
          </button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={handleAudioUpload}
          />
        </div>
      </div>
      
      <div className="text-center mb-3 text-sm">
        <span className="font-medium">{audioName}</span>
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
