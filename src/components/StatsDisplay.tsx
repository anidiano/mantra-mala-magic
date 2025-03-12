
import { useMantra } from "@/contexts/MantraContext";
import { BarChart, Trophy, Calendar, Infinity } from "lucide-react";

export function StatsDisplay() {
  const { stats } = useMantra();
  
  const achievements = [
    { 
      id: "firstMala", 
      title: "First Mala", 
      description: "Completed your first mala", 
      unlocked: stats.achievements.firstMala 
    },
    { 
      id: "tenMalas", 
      title: "Devoted", 
      description: "Completed 10 malas", 
      unlocked: stats.achievements.tenMalas 
    },
    { 
      id: "fiftyMalas", 
      title: "Dedicated", 
      description: "Completed 50 malas", 
      unlocked: stats.achievements.fiftyMalas 
    },
    { 
      id: "hundredMalas", 
      title: "Enlightened", 
      description: "Completed 100 malas", 
      unlocked: stats.achievements.hundredMalas 
    },
    { 
      id: "consistentWeek", 
      title: "Consistent", 
      description: "Chanted every day for a week", 
      unlocked: stats.achievements.consistentWeek 
    }
  ];
  
  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="glass-morphism rounded-xl p-4 animate-slide-up">
        <h3 className="text-base font-medium flex items-center justify-center gap-1 mb-4">
          <BarChart className="h-4 w-4 text-primary" />
          <span>Overall Statistics</span>
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-secondary/50 rounded-lg p-3">
            <div className="text-2xl font-bold">{stats.totalMantras.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Total Mantras</div>
          </div>
          
          <div className="bg-secondary/50 rounded-lg p-3">
            <div className="text-2xl font-bold">{stats.totalMalas.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Total Malas</div>
          </div>
          
          <div className="bg-secondary/50 rounded-lg p-3">
            <div className="text-2xl font-bold">{stats.streak}</div>
            <div className="text-xs text-muted-foreground">Day Streak</div>
          </div>
          
          <div className="bg-secondary/50 rounded-lg p-3">
            <div className="text-2xl font-bold">{stats.history.length}</div>
            <div className="text-xs text-muted-foreground">Days Practiced</div>
          </div>
        </div>
      </div>
      
      <div className="glass-morphism rounded-xl p-4 animate-slide-up">
        <h3 className="text-base font-medium flex items-center justify-center gap-1 mb-4">
          <Trophy className="h-4 w-4 text-golden" />
          <span>Achievements</span>
        </h3>
        
        <div className="space-y-3">
          {achievements.map((achievement) => (
            <div 
              key={achievement.id}
              className={`flex items-center p-3 rounded-lg border ${
                achievement.unlocked 
                  ? "bg-accent/30 border-accent" 
                  : "bg-secondary/30 border-secondary text-muted-foreground"
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                achievement.unlocked ? "bg-golden text-golden-foreground" : "bg-muted text-muted-foreground"
              }`}>
                <Trophy className="h-4 w-4" />
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium">{achievement.title}</h4>
                <p className="text-xs text-muted-foreground">{achievement.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="glass-morphism rounded-xl p-4 animate-slide-up">
        <h3 className="text-base font-medium flex items-center justify-center gap-1 mb-4">
          <Calendar className="h-4 w-4 text-primary" />
          <span>Recent Activity</span>
        </h3>
        
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {stats.history.slice(-7).reverse().map((day) => (
            <div 
              key={day.date}
              className="flex items-center justify-between p-2 rounded-lg bg-secondary/30"
            >
              <div className="text-sm">{new Date(day.date).toLocaleDateString()}</div>
              <div className="flex items-center space-x-3">
                <div className="text-xs text-muted-foreground">
                  {day.mantras} mantras
                </div>
                <div className="text-sm font-medium">
                  {day.malas} malas
                </div>
              </div>
            </div>
          ))}
          
          {stats.history.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No activity recorded yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default StatsDisplay;
