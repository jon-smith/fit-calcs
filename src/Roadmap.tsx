const upcomingCalculators = ['Running pace conversions'];

function Roadmap() {
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

export default Roadmap;
