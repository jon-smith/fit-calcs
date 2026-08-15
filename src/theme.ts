export const themeOptions = {
  light: {
    label: 'Light',
  },
  dark: {
    label: 'Dark',
  },
} as const;

export type ThemeName = keyof typeof themeOptions;

export const themeStorageKey = 'fit-calcs-theme';

const defaultTheme: ThemeName = 'light';

export function applyTheme(themeName: ThemeName) {
  document.documentElement.dataset.theme = themeName;
}

export function getInitialTheme(): ThemeName {
  const storedTheme = getStoredTheme();

  if (storedTheme) {
    return storedTheme;
  }

  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return defaultTheme;
}

export function getStoredTheme(): ThemeName | null {
  try {
    const storedTheme = localStorage.getItem(themeStorageKey);

    return isThemeName(storedTheme) ? storedTheme : null;
  } catch {
    return null;
  }
}

export function storeTheme(themeName: ThemeName) {
  try {
    localStorage.setItem(themeStorageKey, themeName);
  } catch {
    // Theme persistence is a convenience; the live theme can still update.
  }
}

function isThemeName(themeName: string | null): themeName is ThemeName {
  return themeName !== null && themeName in themeOptions;
}
