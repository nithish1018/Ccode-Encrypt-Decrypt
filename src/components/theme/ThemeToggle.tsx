import { MoonStar, SunMedium } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export function ThemeToggle() {
    const { isDark, toggleTheme } = useTheme();

    return (
        <button
            type="button"
            onClick={toggleTheme}
            className="button-secondary px-3 py-2 text-xs font-semibold"
            aria-label="Toggle theme"
        >
            {isDark ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
            <span className="hidden sm:inline">{isDark ? 'Light mode' : 'Dark mode'}</span>
        </button>
    );
}
