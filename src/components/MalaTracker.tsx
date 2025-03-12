
import { useMantra } from "@/contexts/MantraContext";
import { Award } from "lucide-react";
import { cn } from "@/lib/utils";

export function MalaTracker() {
  const { stats, goalMalas } = useMantra();
  const progress = Math.min(stats.dailyMalas / goalMalas, 1);
  
  return (
    <div className="glass-morphism rounded-xl p-4 w-full max-w-xs mx-auto mt-4 animate-slide-up">
      <h3 className="text-sm font-medium flex items-center justify-center gap-1 mb-3">
        <Award className="h-4 w-4 text-golden" />
        <span>Daily Goal Progress</span>
      </h3>
      
      <div className="flex items-center justify-between text-sm mb-1.5">
        <span>{stats.dailyMalas} Malas</span>
        <span className="text-muted-foreground">Goal: {goalMalas} Malas</span>
      </div>
      
      <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      
      {stats.dailyMalas >= goalMalas ? (
        <p className="mt-2 text-sm text-center text-primary font-medium">
          Daily goal achieved! 🎉
        </p>
      ) : (
        <p className="mt-2 text-xs text-center text-muted-foreground">
          {goalMalas - stats.dailyMalas} more {goalMalas - stats.dailyMalas === 1 ? 'mala' : 'malas'} to reach your daily goal
        </p>
      )}
    </div>
  );
}

export default MalaTracker;
