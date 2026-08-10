import { Link, Outlet } from '@tanstack/react-router';

import { NRepMaxCalculator } from './NRepMaxCalculator';
import { Roadmap } from './Roadmap';
import { RunningPaceCalculator } from './RunningPaceCalculator';

export function App() {
  return (
    <div className="app-shell">
      <header className="app-header" aria-labelledby="app-title">
        <div>
          <p className="eyebrow">Fitness calculators</p>
          <h1 id="app-title">FitCalcs</h1>
        </div>
        <nav className="app-nav" aria-label="Calculator pages">
          <Link activeOptions={{ exact: true }} className="app-nav-link" to="/">
            Home
          </Link>
          <Link className="app-nav-link" to="/running-pace">
            Running
          </Link>
          <Link className="app-nav-link" to="/n-rep-max">
            Strength
          </Link>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
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
