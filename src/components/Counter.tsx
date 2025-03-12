
import { useMantra } from "@/contexts/MantraContext";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function Counter() {
  const { currentMantras, currentMalas, incrementCount } = useMantra();
  
  return (
    <div className="flex flex-col items-center justify-center my-6 w-full">
      <div className="relative mb-6">
        <motion.div
          className="relative z-10 flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-sm font-medium text-muted-foreground mb-1">Current Mala Progress</span>
          <div className="relative w-40 h-40">
            {/* Background circle */}
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="text-secondary"
              />
              
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${(currentMantras / 108) * 283} 283`}
                strokeDashoffset="0"
                className="text-primary transition-all duration-300 ease-out"
                transform="rotate(-90 50 50)"
              />
            </svg>
            
            {/* Count display */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <span className="block text-3xl font-bold">{currentMantras}</span>
              <span className="block text-xs text-muted-foreground">/ 108</span>
            </div>
          </div>
        </motion.div>
      </div>
      
      <div className="glass-morphism py-2 px-4 rounded-full mb-4">
        <span className="text-xl font-medium">
          {currentMalas} <span className="text-muted-foreground text-sm">Malas Today</span>
        </span>
      </div>
      
      <button
        onClick={incrementCount}
        className={cn(
          "counter-button w-32 h-32 md:w-40 md:h-40 bg-primary text-primary-foreground",
          "flex items-center justify-center rounded-full transition-all"
        )}
        aria-label="Increment count"
      >
        <span className="text-xl font-medium">Tap</span>
        <span className="sr-only">Increment mantra count</span>
      </button>
      
      <p className="mt-2 text-sm text-muted-foreground">
        Tap to count your mantra
      </p>
    </div>
  );
}

export default Counter;
