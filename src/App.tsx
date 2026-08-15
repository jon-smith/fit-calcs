import { Link, Outlet } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

import { NRepMaxCalculator } from './NRepMaxCalculator';
import { Roadmap } from './Roadmap';
import { RunningPaceCalculator } from './RunningPaceCalculator';
import * as theme from './theme';

export function App() {
  const [themeName, setThemeName] = useState(theme.getInitialTheme);

  useEffect(() => {
    theme.applyTheme(themeName);
  }, [themeName]);

  return (
    <div className="app-shell">
      <header className="app-header" aria-labelledby="app-title">
        <div>
          <p className="eyebrow">Fitness calculators</p>
          <h1 id="app-title">FitCalcs</h1>
        </div>
        <div className="app-header-actions">
          <nav className="app-nav" aria-label="Calculator pages">
            <Link
              activeOptions={{ exact: true }}
              className="app-nav-link"
              to="/"
            >
              Home
            </Link>
            <Link className="app-nav-link" to="/running-pace">
              Running
            </Link>
            <Link className="app-nav-link" to="/n-rep-max">
              Strength
            </Link>
          </nav>
          <ThemeToggle
            setThemeName={(nextThemeName) => {
              setThemeName(nextThemeName);
              theme.storeTheme(nextThemeName);
            }}
            themeName={themeName}
          />
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}

function ThemeToggle({
  setThemeName,
  themeName,
}: {
  setThemeName: (themeName: theme.ThemeName) => void;
  themeName: theme.ThemeName;
}) {
  const nextThemeName: theme.ThemeName =
    themeName === 'light' ? 'dark' : 'light';

  return (
    <button
      aria-label={`Switch to ${theme.themeOptions[nextThemeName].label.toLowerCase()} mode`}
      aria-pressed={themeName === 'dark'}
      className="theme-toggle"
      data-theme-state={themeName}
      onClick={() => setThemeName(nextThemeName)}
      title={`Switch to ${theme.themeOptions[nextThemeName].label.toLowerCase()} mode`}
      type="button"
    >
      <span className="theme-toggle-track" aria-hidden="true">
        <SunIcon />
        <MoonIcon />
        <span className="theme-toggle-thumb" />
      </span>
    </button>
  );
}

function SunIcon() {
  return (
    <svg
      aria-hidden="true"
      className="theme-toggle-icon theme-toggle-icon-sun"
      fill="none"
      height="18"
      viewBox="0 0 24 24"
      width="18"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      aria-hidden="true"
      className="theme-toggle-icon theme-toggle-icon-moon"
      fill="none"
      height="18"
      viewBox="0 0 24 24"
      width="18"
    >
      <path d="M20.99 12.58A8.2 8.2 0 1 1 11.42 3a6.4 6.4 0 0 0 9.57 9.57Z" />
    </svg>
  );
}

export function CalculatorIndexPage() {
  return (
    <div className="home-grid">
      <section className="intro-panel" aria-labelledby="home-title">
        <p className="eyebrow">Choose a calculator</p>
        <h2 id="home-title">Simple tools for fitness.</h2>
        <p className="lede">
          Pick a calculator to estimate race paces, training zones, or strength
          targets.
        </p>
      </section>

      <section className="calculator-links" aria-label="Available calculators">
        <Link className="calculator-link-card" to="/running-pace">
          <span className="eyebrow">Running</span>
          <strong>Race pace calculator</strong>
          <span>
            Calculate VDOT, equivalent race times, and training paces.
          </span>
        </Link>
        <Link className="calculator-link-card" to="/n-rep-max">
          <span className="eyebrow">Strength</span>
          <strong>N-rep max calculator</strong>
          <span>Estimate a full rep-max table from a performed set.</span>
        </Link>
      </section>

      <Roadmap />
    </div>
  );
}

export function RunningPacePage() {
  return <RunningPaceCalculator />;
}

export function NRepMaxPage() {
  return <NRepMaxCalculator />;
}

export function NotFoundPage() {
  return (
    <section
      className="intro-panel not-found-panel"
      aria-labelledby="not-found-title"
    >
      <p className="eyebrow">Not found</p>
      <h2 id="not-found-title">That calculator is not here.</h2>
      <p className="lede">Head back to the calculator index and pick a tool.</p>
      <Link className="primary-link" to="/">
        Back to calculators
      </Link>
    </section>
  );
}
