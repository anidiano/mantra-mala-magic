
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import GoalSetting from "@/components/GoalSetting";
import { useMantra } from "@/contexts/MantraContext";
import { Trash2, HelpCircle, Share2, Bell, Repeat, AlertTriangle } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";
import { toast } from "sonner";

const Settings = () => {
  const { resetAllCount, enableAutoRepeat, toggleAutoRepeat } = useMantra();
  const { theme } = useTheme();
  
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Shri Swami Samarth Jap',
          text: 'Check out this mantra jap counter app!',
          url: window.location.origin,
        });
      } catch (error) {
        console.error('Error sharing:', error);
        toast.error('Failed to share. Please try again.');
      }
    } else {
      toast.error('Sharing not supported on this device');
    }
  };
  
  const handleEnableNotifications = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          toast.success('Notifications enabled');
        } else {
          toast.error('Notification permission denied');
        }
      });
    } else {
      toast.error('Notifications not supported on this device');
    }
  };
  
  return (
    <Layout>
      <motion.div
        className="w-full max-w-md mx-auto pt-6 pb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Settings</h1>
          <ThemeToggle />
        </div>
        
        <div className="space-y-6">
          <GoalSetting />
          
          <div className="glass-morphism rounded-xl p-4 animate-slide-up">
            <h3 className="text-base font-medium mb-4">App Settings</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                <div className="flex items-center">
                  <Bell className="h-4 w-4 mr-3 text-primary" />
                  <span className="text-sm">Notifications</span>
                </div>
                <button
                  onClick={handleEnableNotifications}
                  className="px-3 py-1 text-xs rounded-full bg-primary text-primary-foreground"
                >
                  Enable
                </button>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                <div className="flex items-center">
                  <Repeat className="h-4 w-4 mr-3 text-primary" />
                  <span className="text-sm">Auto-Repeat</span>
                </div>
                <button
                  onClick={toggleAutoRepeat}
                  className={`px-3 py-1 text-xs rounded-full ${
                    enableAutoRepeat
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {enableAutoRepeat ? "Enabled" : "Disabled"}
                </button>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                <div className="flex items-center">
                  <Share2 className="h-4 w-4 mr-3 text-primary" />
                  <span className="text-sm">Share App</span>
                </div>
                <button
                  onClick={handleShare}
                  className="px-3 py-1 text-xs rounded-full bg-primary text-primary-foreground"
                >
                  Share
                </button>
              </div>
            </div>
          </div>
          
          <div className="glass-morphism rounded-xl p-4 animate-slide-up">
            <h3 className="text-base font-medium flex items-center justify-center gap-1 mb-4">
              <HelpCircle className="h-4 w-4 text-primary" />
              <span>About</span>
            </h3>
            
            <p className="text-sm text-muted-foreground mb-4">
              Shri Swami Samarth Jap Mantra Counter App helps you maintain your daily spiritual practice. 
              Count your mantras, track your progress, and achieve your spiritual goals.
            </p>
            
            <p className="text-xs text-muted-foreground">
              Version 1.0.0
            </p>
          </div>
          
          <div className="glass-morphism rounded-xl p-4 animate-slide-up">
            <h3 className="text-base font-medium flex items-center justify-center gap-1 mb-4 text-destructive">
              <AlertTriangle className="h-4 w-4" />
              <span>Danger Zone</span>
            </h3>
            
            <button
              onClick={resetAllCount}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-lg border border-destructive text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
              <span>Reset All Data</span>
            </button>
            
            <p className="text-xs text-muted-foreground mt-2">
              This will permanently delete all your data and cannot be undone.
            </p>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Settings;
