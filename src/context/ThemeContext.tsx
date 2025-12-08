import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setThemeState] = useState<Theme>('system');
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as Theme | null;
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme) {
            setThemeState(savedTheme);
            applyTheme(savedTheme, prefersDark);
        } else {
            setThemeState('system');
            applyTheme('system', prefersDark);
        }

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e: MediaQueryListEvent) => {
            const currentTheme = localStorage.getItem('theme') as Theme | null;
            if (!currentTheme || currentTheme === 'system') {
                applyTheme('system', e.matches);
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    const applyTheme = (newTheme: Theme, prefersDark: boolean) => {
        const root = document.documentElement;
        let shouldBeDark = false;

        if (newTheme === 'dark') {
            shouldBeDark = true;
        } else if (newTheme === 'light') {
            shouldBeDark = false;
        } else {
            shouldBeDark = prefersDark;
        }

        if (shouldBeDark) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }

        setIsDark(shouldBeDark);
    };

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
        localStorage.setItem('theme', newTheme);

        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(newTheme, prefersDark);
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme, isDark }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme deve ser usado dentro de ThemeProvider');
    }
    return context;
};
