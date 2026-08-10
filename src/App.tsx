import NRepMaxCalculator from './NRepMaxCalculator';
import Roadmap from './Roadmap';

function App() {
  return (
    <main className="app-shell">
      <IntroPanel />
      <NRepMaxCalculator />
      <Roadmap />
    </main>
  );
}

function IntroPanel() {
  return (
    <section className="intro-panel" aria-labelledby="app-title">
      <p className="eyebrow">Fitness calculators</p>
      <h1 id="app-title">FitCalcs</h1>
      <p className="lede">
        Estimate training weights across rep ranges using common strength
        formulas.
      </p>
    </section>
  );
}

export default App;
