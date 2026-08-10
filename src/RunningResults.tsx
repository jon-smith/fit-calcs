import { ResultsTable } from './ResultsTable';
import * as pace from './running-pace-math';

type RunningResultsProps = {
  equivalentRaces: pace.EquivalentRace[];
  trainingPaces: pace.TrainingPace[];
  unit: pace.Unit;
  vdot: number;
};

export function RunningResults({
  equivalentRaces,
  trainingPaces,
  unit,
  vdot,
}: RunningResultsProps) {
  return (
    <div className="running-results">
      <div className="metric-card" aria-label="Estimated VDOT">
        <span>VDOT</span>
        <strong>{vdot.toFixed(1)}</strong>
      </div>

      <ResultsTable
        caption={`Equivalent races and paces per ${pace.unitLabels[unit]}`}
        headings={['Distance', 'Time', `Pace / ${pace.unitLabels[unit]}`]}
        rows={equivalentRaces.map((race) => ({
          cells: [race.label, race.time, race.pace],
          key: race.key,
        }))}
      />

      <ResultsTable
        caption={`Training paces per ${pace.unitLabels[unit]}`}
        headings={['Zone', `Pace / ${pace.unitLabels[unit]}`]}
        rows={trainingPaces.map((trainingPace) => ({
          cells: [trainingPace.label, trainingPace.pace],
          key: trainingPace.label,
        }))}
      />
    </div>
  );
}
