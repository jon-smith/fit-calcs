const upcomingCalculators = ['Heart Rate Zones', 'Hyrox Paces'];

export function Roadmap() {
  return (
    <section className="roadmap-strip" aria-labelledby="roadmap-title">
      <h2 id="roadmap-title">Coming next</h2>
      <ul>
        {upcomingCalculators.map((calculator) => (
          <li key={calculator}>{calculator}</li>
        ))}
      </ul>
    </section>
  );
}
