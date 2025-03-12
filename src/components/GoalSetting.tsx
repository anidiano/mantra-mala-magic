
import { useState } from "react";
import { useMantra } from "@/contexts/MantraContext";
import { Target } from "lucide-react";

export function GoalSetting() {
  const { goalMalas, setGoalMalas } = useMantra();
  const [value, setValue] = useState(goalMalas);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(e.target.value));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGoalMalas(value);
  };
  
  return (
    <div className="glass-morphism rounded-xl p-4 w-full max-w-sm animate-slide-up">
      <h3 className="text-base font-medium flex items-center justify-center gap-1 mb-4">
        <Target className="h-4 w-4 text-primary" />
        <span>Set Daily Goal</span>
      </h3>
      
      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="mb-4">
          <label htmlFor="goal-malas" className="text-sm text-muted-foreground mb-1 block text-left">
            Malas per day
          </label>
          <input
            type="number"
            id="goal-malas"
            min="1"
            max="108"
            value={value}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border bg-background"
          />
          <span className="text-xs text-muted-foreground mt-1 block text-left">
            Set a realistic goal that you can maintain
          </span>
        </div>
        
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg transition-all hover:opacity-90 active:scale-95"
          >
            Save Goal
          </button>
        </div>
      </form>
      
      <div className="mt-4 text-sm text-center">
        <p className="text-muted-foreground">
          Current goal: {goalMalas} {goalMalas === 1 ? 'Mala' : 'Malas'} per day
        </p>
      </div>
    </div>
  );
}

export default GoalSetting;
