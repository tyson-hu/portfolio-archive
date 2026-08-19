"use client";

import * as React from "react";

type Theme = "light" | "dark" | "system";
type ThemeSetter = React.Dispatch<React.SetStateAction<Theme>>;

type ThemeContextValue = {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: ThemeSetter;
};

type ThemeProviderProps = {
  children: React.ReactNode;
  attribute?: "class";
  defaultTheme?: Theme;
};

const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined);

function isTheme(value: string | null): value is Theme {
  return value === "light" || value === "dark" || value === "system";
}

function getSystemTheme(): "light" | "dark" {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function resolveTheme(theme: Theme): "light" | "dark" {
  return theme === "system" ? getSystemTheme() : theme;
}

function getStoredTheme(defaultTheme: Theme): Theme {
  try {
    const storedTheme = localStorage.getItem("theme");
    return isTheme(storedTheme) ? storedTheme : defaultTheme;
  } catch {
    return defaultTheme;
  }
}

function applyTheme(theme: Theme) {
  const resolvedTheme = resolveTheme(theme);
  const root = document.documentElement;

  root.classList.remove("light", "dark");
  root.classList.add(resolvedTheme);
  root.style.colorScheme = resolvedTheme;

  return resolvedTheme;
}

export function ThemeProvider({
  children,
  attribute = "class",
  defaultTheme = "light",
}: ThemeProviderProps) {
  if (attribute !== "class") {
    throw new Error('ThemeProvider only supports attribute="class"');
  }

  const [theme, setThemeState] = React.useState<Theme>(() =>
    typeof window === "undefined" ? defaultTheme : getStoredTheme(defaultTheme)
  );
  const [resolvedTheme, setResolvedTheme] = React.useState<"light" | "dark">(() =>
    typeof window === "undefined"
      ? defaultTheme === "dark"
        ? "dark"
        : "light"
      : resolveTheme(getStoredTheme(defaultTheme))
  );

  const setTheme = React.useCallback<ThemeSetter>((nextTheme) => {
    setThemeState((currentTheme) => {
      const value =
        typeof nextTheme === "function" ? nextTheme(currentTheme) : nextTheme;

      try {
        localStorage.setItem("theme", value);
      } catch {
        // The in-memory theme still applies when storage is unavailable.
      }

      return value;
    });
  }, []);

  React.useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const syncTheme = () => setResolvedTheme(applyTheme(theme));
    const syncStoredTheme = (event: StorageEvent) => {
      if (event.key === "theme") {
        setThemeState(isTheme(event.newValue) ? event.newValue : defaultTheme);
      }
    };

    syncTheme();
    if (theme === "system") {
      media.addEventListener("change", syncTheme);
    }
    window.addEventListener("storage", syncStoredTheme);

    return () => {
      media.removeEventListener("change", syncTheme);
      window.removeEventListener("storage", syncStoredTheme);
    };
  }, [defaultTheme, theme]);

  const value = React.useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [resolvedTheme, setTheme, theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = React.useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}
