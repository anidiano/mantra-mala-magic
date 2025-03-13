
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import AudioPlayer from "@/components/AudioPlayer";
import Counter from "@/components/Counter";
import MalaTracker from "@/components/MalaTracker";
import ThemeToggle from "@/components/ThemeToggle";
import { useMantra } from "@/contexts/MantraContext";
import { Repeat, RotateCcw, Upload, List } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const Index = () => {
  const { 
    resetDailyCount, 
    enableAutoRepeat,
    toggleAutoRepeat
  } = useMantra();

  // Function to show a tooltip about the upload feature
  const showUploadHelp = () => {
    toast.info("Click the upload button in the audio player to add your own mantra audio");
  };

  // Function to show a tooltip about the audio selection feature
  const showAudioSelectHelp = () => {
    toast.info("Click the list button in the audio player to select from previously uploaded mantras");
  };

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
            Vaishali
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
            Shri Swami Samarth Mantra Jap Counter
          </p>
          <div className="flex justify-center space-x-4 mt-1">
            <button
              onClick={showUploadHelp}
              className="inline-flex items-center text-xs text-primary hover:underline"
            >
              <Upload className="h-3 w-3 mr-1" />
              Add audio
            </button>
            <button
              onClick={showAudioSelectHelp}
              className="inline-flex items-center text-xs text-primary hover:underline"
            >
              <List className="h-3 w-3 mr-1" />
              Select saved audio
            </button>
          </div>
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
