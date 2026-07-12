const upcomingCalculators = ["N-rep max", "Running pace conversionss"];

function App() {
  return (
    <main className="app-shell">
      <section className="intro-panel" aria-labelledby="app-title">
        <p className="eyebrow">Fitness calculators</p>
        <h1 id="app-title">FitCalcs</h1>
        <p className="lede">A bunch of calculators.</p>
      </section>

      <section className="roadmap-panel" aria-labelledby="roadmap-title">
        <h2 id="roadmap-title">Coming next</h2>
        <ul>
          {upcomingCalculators.map((calculator) => (
            <li key={calculator}>{calculator}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default App;
