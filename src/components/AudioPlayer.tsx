
import { useEffect, useRef, useState } from "react";
import { Pause, Play, Volume1, Volume2, VolumeX, Upload, List } from "lucide-react";
import { useMantra } from "@/contexts/MantraContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function AudioPlayer() {
  const { isPlaying, togglePlayback, playbackSpeed, setPlaybackSpeed, incrementCount, enableAutoRepeat } = useMantra();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [volume, setVolume] = useState(0.5);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [audioSource, setAudioSource] = useState<string>("/mantras/shri-swami-samarth.mp3");
  const [audioName, setAudioName] = useState<string>("Shri Swami Samarth");
  const [savedAudios, setSavedAudios] = useState<Array<{name: string, url: string}>>(() => {
    const saved = localStorage.getItem("savedAudios");
    return saved ? JSON.parse(saved) : [
      { name: "Shri Swami Samarth", url: "/mantras/shri-swami-samarth.mp3" }
    ];
  });
  const [showAudioList, setShowAudioList] = useState(false);

  // Save audios to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("savedAudios", JSON.stringify(savedAudios));
  }, [savedAudios]);

  // Function to handle when audio ends (used for counting)
  const handleAudioEnded = () => {
    console.log("Audio ended, incrementing count");
    incrementCount();
  };

  // Setup audio element with current settings
  const setupAudio = (source: string) => {
    // Clean up any existing audio element
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeEventListener('ended', handleAudioEnded);
      audioRef.current = null;
    }

    setAudioLoaded(false);
    setAudioError(null);
    
    // Create a new audio element
    const audio = new Audio();
    audio.src = source;
    audio.loop = false; // Disable loop to ensure 'ended' event fires
    audio.volume = volume;
    audio.playbackRate = playbackSpeed;
    audio.preload = "auto";
    
    // Add event listeners
    audio.addEventListener("canplaythrough", () => {
      console.log("Audio loaded successfully:", source);
      setAudioLoaded(true);
      setAudioError(null);
    });
    
    audio.addEventListener("error", (e) => {
      console.error("Audio error:", e);
      setAudioError("Could not load audio file. Please check that the file is a valid audio format.");
      setAudioLoaded(false);
    });

    // Add the ended event listener to count and restart if auto-repeat is enabled
    audio.addEventListener("ended", handleAudioEnded);
    
    audioRef.current = audio;
    return audio;
  };

  // Initial audio setup on component mount
  useEffect(() => {
    console.log("Setting up initial audio:", audioSource);
    const audio = setupAudio(audioSource);
    
    return () => {
      if (audio) {
        audio.pause();
        audio.src = "";
        audio.removeEventListener('ended', handleAudioEnded);
      }
    };
  }, []);

  // Handle ended event to restart audio if auto-repeat is enabled
  useEffect(() => {
    const handleAutoRepeat = () => {
      if (!audioRef.current) return;
      
      const endedHandler = () => {
        // First increment the count (handled by handleAudioEnded)
        // Then restart the audio if auto-repeat is enabled
        if (enableAutoRepeat && audioRef.current) {
          console.log("Auto-repeat enabled, restarting audio");
          setTimeout(() => {
            if (audioRef.current && isPlaying) {
              audioRef.current.currentTime = 0;
              audioRef.current.play().catch(e => {
                console.error("Error restarting audio:", e);
              });
            }
          }, 100); // Small delay to ensure the count is registered
        }
      };
      
      audioRef.current.addEventListener("ended", endedHandler);
      
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener("ended", endedHandler);
        }
      };
    };
    
    const cleanup = handleAutoRepeat();
    return cleanup;
  }, [enableAutoRepeat, isPlaying]);

  // Handle play/pause
  useEffect(() => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      console.log("Attempting to play audio:", audioRef.current.src);
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(e => {
          console.error("Error playing audio:", e);
          if (e.name === "NotAllowedError") {
            toast.error("Playback was blocked. Please interact with the page first.");
          } else {
            toast.error(`Audio playback error: ${e.message}`);
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
    
    const name = file.name.split('.')[0]; // Set name without extension
    setAudioName(name);
    setAudioSource(objectUrl);
    
    // Setup new audio with uploaded file
    setupAudio(objectUrl);
    
    // Save to list of audios
    setSavedAudios(prev => {
      // Check if this audio name already exists
      const exists = prev.some(audio => audio.name === name);
      if (exists) {
        // Update existing entry
        return prev.map(audio => 
          audio.name === name ? { name, url: objectUrl } : audio
        );
      } else {
        // Add new entry
        return [...prev, { name, url: objectUrl }];
      }
    });
    
    toast.success(`Uploaded mantra: ${file.name}`);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Select audio from saved list
  const selectAudio = (audioName: string, audioUrl: string) => {
    setAudioSource(audioUrl);
    setAudioName(audioName);
    setupAudio(audioUrl);
    setShowAudioList(false);
    toast.success(`Selected mantra: ${audioName}`);
  };

  // Trigger file input click
  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const toggleAudioList = () => {
    setShowAudioList(prev => !prev);
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
            onClick={toggleAudioList}
            className="p-2 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center transition-all hover:bg-secondary/80"
            aria-label="Show saved mantras"
            title="Select a saved mantra"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            onClick={triggerFileUpload}
            className="p-2 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center transition-all hover:bg-secondary/80"
            aria-label="Upload audio"
            title="Upload your own mantra audio"
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
        {enableAutoRepeat && (
          <span className="text-xs block text-primary mt-1">Auto-Count Enabled</span>
        )}
      </div>
      
      {showAudioList && (
        <div className="mb-3 max-h-32 overflow-y-auto bg-background/50 rounded p-2">
          <h4 className="text-xs font-medium mb-1 text-muted-foreground">Saved Mantras</h4>
          <ul className="space-y-1">
            {savedAudios.map((audio, index) => (
              <li key={index}>
                <button
                  onClick={() => selectAudio(audio.name, audio.url)}
                  className={cn(
                    "w-full text-left text-xs py-1 px-2 rounded hover:bg-secondary/50",
                    audioName === audio.name ? "bg-primary/10 font-medium" : ""
                  )}
                >
                  {audio.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      
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
      
      {!audioLoaded && !audioError && (
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
