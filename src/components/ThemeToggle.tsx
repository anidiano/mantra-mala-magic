
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="inline-flex items-center justify-center rounded-full w-10 h-10 glass-morphism text-foreground transition-all hover:scale-105 active:scale-95"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Sun className="h-5 w-5 animate-scale-up" />
      ) : (
        <Moon className="h-5 w-5 animate-scale-up" />
      )}
    </button>
  );
}

export default ThemeToggle;
