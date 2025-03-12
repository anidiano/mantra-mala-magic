
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

export interface MantraStats {
  totalMantras: number;
  totalMalas: number;
  dailyMantras: number;
  dailyMalas: number;
  goalMalas: number;
  streak: number;
  lastUpdated: string;
  history: Array<{
    date: string;
    mantras: number;
    malas: number;
  }>;
  achievements: {
    firstMala: boolean;
    tenMalas: boolean;
    fiftyMalas: boolean;
    hundredMalas: boolean;
    consistentWeek: boolean;
  };
}

interface MantraContextType {
  isPlaying: boolean;
  playbackSpeed: number;
  currentMantras: number;
  currentMalas: number;
  stats: MantraStats;
  goalMalas: number;
  togglePlayback: () => void;
  setPlaybackSpeed: (speed: number) => void;
  incrementCount: () => void;
  resetDailyCount: () => void;
  resetAllCount: () => void;
  setGoalMalas: (goal: number) => void;
  enableAutoRepeat: boolean;
  toggleAutoRepeat: () => void;
}

const MANTRAS_PER_MALA = 108;

const defaultStats: MantraStats = {
  totalMantras: 0,
  totalMalas: 0,
  dailyMantras: 0,
  dailyMalas: 0,
  goalMalas: 3,
  streak: 0,
  lastUpdated: new Date().toISOString().split('T')[0],
  history: [],
  achievements: {
    firstMala: false,
    tenMalas: false,
    fiftyMalas: false,
    hundredMalas: false,
    consistentWeek: false,
  }
};

const MantraContext = createContext<MantraContextType | undefined>(undefined);

export function MantraProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [currentMantras, setCurrentMantras] = useState(0);
  const [currentMalas, setCurrentMalas] = useState(0);
  const [enableAutoRepeat, setEnableAutoRepeat] = useState(false);
  const [stats, setStats] = useState<MantraStats>(() => {
    const saved = localStorage.getItem("mantraStats");
    if (saved) {
      const parsedStats = JSON.parse(saved);
      
      // Check if it's a new day
      const today = new Date().toISOString().split('T')[0];
      if (parsedStats.lastUpdated !== today) {
        return {
          ...parsedStats,
          dailyMantras: 0,
          dailyMalas: 0,
          lastUpdated: today,
          history: [
            ...parsedStats.history,
            {
              date: today,
              mantras: 0,
              malas: 0
            }
          ]
        };
      }
      return parsedStats;
    }
    return {
      ...defaultStats,
      history: [
        {
          date: new Date().toISOString().split('T')[0],
          mantras: 0,
          malas: 0
        }
      ]
    };
  });

  // Save stats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("mantraStats", JSON.stringify(stats));
  }, [stats]);

  // Check achievements
  useEffect(() => {
    const checkAchievements = () => {
      const newAchievements = { ...stats.achievements };
      let achievementUnlocked = false;

      if (!newAchievements.firstMala && stats.totalMalas >= 1) {
        newAchievements.firstMala = true;
        achievementUnlocked = true;
        toast("Achievement Unlocked: First Mala Completed!");
      }

      if (!newAchievements.tenMalas && stats.totalMalas >= 10) {
        newAchievements.tenMalas = true;
        achievementUnlocked = true;
        toast("Achievement Unlocked: 10 Malas Completed!");
      }

      if (!newAchievements.fiftyMalas && stats.totalMalas >= 50) {
        newAchievements.fiftyMalas = true;
        achievementUnlocked = true;
        toast("Achievement Unlocked: 50 Malas Completed!");
      }

      if (!newAchievements.hundredMalas && stats.totalMalas >= 100) {
        newAchievements.hundredMalas = true;
        achievementUnlocked = true;
        toast("Achievement Unlocked: 100 Malas Completed!");
      }

      // Update achievements if any were unlocked
      if (achievementUnlocked) {
        setStats(prevStats => ({
          ...prevStats,
          achievements: newAchievements
        }));
      }
    };

    checkAchievements();
  }, [stats.totalMalas]);

  const togglePlayback = () => {
    setIsPlaying(prev => !prev);
  };

  const incrementCount = () => {
    // Create haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }

    const newMantras = currentMantras + 1;
    setCurrentMantras(newMantras);
    
    // Check if we've completed a mala
    if (newMantras >= MANTRAS_PER_MALA) {
      setCurrentMantras(0);
      const newMalas = currentMalas + 1;
      setCurrentMalas(newMalas);
      
      // Create stronger haptic feedback for mala completion
      if (navigator.vibrate) {
        navigator.vibrate([50, 30, 50]);
      }
      
      // Play a sound for mala completion
      const audio = new Audio('/mantras/bell.mp3');
      audio.play().catch(e => console.error("Failed to play bell sound:", e));
      
      // Show toast for mala completion
      toast(`Mala Completed! (${newMalas})`);
      
      // Check if daily goal is reached
      if (newMalas === stats.goalMalas) {
        toast.success("Daily Mala Goal Achieved! 🎉");
      }
    }
    
    // Update stats
    const today = new Date().toISOString().split('T')[0];
    const updatedHistory = [...stats.history];
    const todayIndex = updatedHistory.findIndex(day => day.date === today);
    
    if (todayIndex >= 0) {
      updatedHistory[todayIndex].mantras += 1;
      if (newMantras >= MANTRAS_PER_MALA) {
        updatedHistory[todayIndex].malas += 1;
      }
    } else {
      updatedHistory.push({
        date: today,
        mantras: 1,
        malas: newMantras >= MANTRAS_PER_MALA ? 1 : 0
      });
    }
    
    setStats(prev => ({
      ...prev,
      totalMantras: prev.totalMantras + 1,
      dailyMantras: prev.dailyMantras + 1,
      totalMalas: newMantras >= MANTRAS_PER_MALA ? prev.totalMalas + 1 : prev.totalMalas,
      dailyMalas: newMantras >= MANTRAS_PER_MALA ? prev.dailyMalas + 1 : prev.dailyMalas,
      lastUpdated: today,
      history: updatedHistory
    }));
  };

  const resetDailyCount = () => {
    setCurrentMantras(0);
    setCurrentMalas(0);
    toast("Daily count reset successfully");
  };

  const resetAllCount = () => {
    if (confirm("Are you sure you want to reset all counts? This cannot be undone.")) {
      setCurrentMantras(0);
      setCurrentMalas(0);
      setStats({
        ...defaultStats,
        history: [
          {
            date: new Date().toISOString().split('T')[0],
            mantras: 0,
            malas: 0
          }
        ]
      });
      toast("All counts have been reset");
    }
  };

  const setGoalMalas = (goal: number) => {
    setStats(prev => ({
      ...prev,
      goalMalas: goal
    }));
    toast(`Daily goal set to ${goal} malas`);
  };

  const toggleAutoRepeat = () => {
    setEnableAutoRepeat(prev => !prev);
    toast(`Auto-repeat ${!enableAutoRepeat ? "enabled" : "disabled"}`);
  };

  // Setup auto-repeat interval
  useEffect(() => {
    let interval: number | undefined;
    
    if (isPlaying && enableAutoRepeat) {
      interval = window.setInterval(() => {
        incrementCount();
      }, 5000 / playbackSpeed); // Adjust timing based on playback speed
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, enableAutoRepeat, playbackSpeed]);

  return (
    <MantraContext.Provider
      value={{
        isPlaying,
        playbackSpeed,
        currentMantras,
        currentMalas,
        stats,
        goalMalas: stats.goalMalas,
        togglePlayback,
        setPlaybackSpeed,
        incrementCount,
        resetDailyCount,
        resetAllCount,
        setGoalMalas,
        enableAutoRepeat,
        toggleAutoRepeat
      }}
    >
      {children}
    </MantraContext.Provider>
  );
}

export function useMantra() {
  const context = useContext(MantraContext);
  if (context === undefined) {
    throw new Error("useMantra must be used within a MantraProvider");
  }
  return context;
}
