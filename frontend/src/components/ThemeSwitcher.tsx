import { useState } from 'react';
import { FiSun, FiMoon, FiDroplet } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';

const themeOptions = [
  { value: 'dark' as const, label: 'Dark', icon: FiMoon, color: '#6366F1' },
  { value: 'light' as const, label: 'Light', icon: FiSun, color: '#4F46E5' },
  { value: 'blue' as const, label: 'Ocean', icon: FiDroplet, color: '#3B82F6' },
  { value: 'purple' as const, label: 'Purple', icon: FiDroplet, color: '#A855F7' },
  { value: 'green' as const, label: 'Forest', icon: FiDroplet, color: '#10B981' },
];

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const currentTheme = themeOptions.find(t => t.value === theme);
  const Icon = currentTheme?.icon || FiMoon;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-300 hover:text-primary transition-colors p-2 rounded-full hover:bg-white/10"
        title="Change theme"
      >
        <Icon size={20} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 glass rounded-2xl shadow-elegant-lg overflow-hidden z-50 min-w-[200px]">
          <div className="p-3">
            <h3 className="text-sm font-semibold mb-3 px-2 text-gray-400 uppercase tracking-wide">
              Theme
            </h3>
            <div className="space-y-1">
              {themeOptions.map((option) => {
                const OptionIcon = option.icon;
                return (
                  <button
                    key={option.value}
                    onClick={() => {
                      setTheme(option.value);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                      theme === option.value
                        ? 'bg-primary/20 text-primary'
                        : 'hover:bg-white/10'
                    }`}
                  >
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${option.color}20`, color: option.color }}
                    >
                      <OptionIcon size={14} />
                    </div>
                    <span className="font-medium">{option.label}</span>
                    {theme === option.value && (
                      <span className="ml-auto text-xs">✓</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
