
import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Home, Settings, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { theme } = useTheme();
  
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="flex flex-col min-h-[100dvh] w-full overflow-hidden bg-background">
      <main className="flex-1 flex flex-col items-center pb-20 px-4">
        {children}
      </main>
      
      <nav className="fixed bottom-0 left-0 right-0 h-16 glass-morphism border-t z-50">
        <div className="max-w-md mx-auto h-full flex items-center justify-around">
          <Link
            to="/"
            className={cn(
              "flex flex-col items-center justify-center w-20 h-full transition-all",
              isActive("/") 
                ? "text-primary" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Home className={cn(
              "h-5 w-5 mb-0.5 transition-all",
              isActive("/") && "animate-scale-up"
            )} />
            <span className="text-xs font-medium">Home</span>
          </Link>
          
          <Link
            to="/stats"
            className={cn(
              "flex flex-col items-center justify-center w-20 h-full transition-all",
              isActive("/stats") 
                ? "text-primary" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <BarChart3 className={cn(
              "h-5 w-5 mb-0.5 transition-all",
              isActive("/stats") && "animate-scale-up"
            )} />
            <span className="text-xs font-medium">Stats</span>
          </Link>
          
          <Link
            to="/settings"
            className={cn(
              "flex flex-col items-center justify-center w-20 h-full transition-all",
              isActive("/settings") 
                ? "text-primary" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Settings className={cn(
              "h-5 w-5 mb-0.5 transition-all",
              isActive("/settings") && "animate-scale-up"
            )} />
            <span className="text-xs font-medium">Settings</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}

export default Layout;
