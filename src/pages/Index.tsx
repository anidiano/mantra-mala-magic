
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import AudioPlayer from "@/components/AudioPlayer";
import Counter from "@/components/Counter";
import MalaTracker from "@/components/MalaTracker";
import ThemeToggle from "@/components/ThemeToggle";
import { useMantra } from "@/contexts/MantraContext";
import { Repeat, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

const Index = () => {
  const { 
    resetDailyCount, 
    enableAutoRepeat,
    toggleAutoRepeat
  } = useMantra();

  return (
    <Layout>
      <motion.div
        className="w-full max-w-md mx-auto pt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            Shri Swami Samarth
          </h1>
          <div className="flex space-x-2">
            <button
              onClick={toggleAutoRepeat}
              className={cn(
                "inline-flex items-center justify-center rounded-full w-10 h-10 transition-all hover:scale-105 active:scale-95",
                enableAutoRepeat 
                  ? "bg-primary text-primary-foreground" 
                  : "glass-morphism text-foreground"
              )}
              aria-label="Toggle auto-repeat"
            >
              <Repeat className="h-5 w-5" />
            </button>
            <ThemeToggle />
          </div>
        </div>
        
        <div className="mb-4 text-center">
          <p className="text-sm text-muted-foreground">
            Mantra Jap Counter
          </p>
        </div>
        
        <AudioPlayer />
        
        <Counter />
        
        <MalaTracker />
        
        <div className="mt-6 flex justify-center">
          <button
            onClick={resetDailyCount}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset Today's Count
          </button>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Index;
