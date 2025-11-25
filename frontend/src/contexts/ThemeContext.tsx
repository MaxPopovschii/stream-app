import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'blue' | 'purple' | 'green';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const themes = {
  dark: {
    primary: '#6366F1',
    secondary: '#8B5CF6',
    accent: '#06B6D4',
    background: '#0F0F0F',
  },
  light: {
    primary: '#4F46E5',
    secondary: '#7C3AED',
    accent: '#0891B2',
    background: '#FFFFFF',
  },
  blue: {
    primary: '#3B82F6',
    secondary: '#0EA5E9',
    accent: '#06B6D4',
    background: '#0F172A',
  },
  purple: {
    primary: '#A855F7',
    secondary: '#EC4899',
    accent: '#F97316',
    background: '#1E1B4B',
  },
  green: {
    primary: '#10B981',
    secondary: '#14B8A6',
    accent: '#84CC16',
    background: '#064E3B',
  },
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme') as Theme;
    return saved || 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    const colors = themes[theme];
    
    // Apply theme colors
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-secondary', colors.secondary);
    root.style.setProperty('--color-accent', colors.accent);
    root.style.setProperty('--color-background', colors.background);
    
    // Apply light/dark mode
    if (theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
    }
    
    localStorage.setItem('theme', theme);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
