import { useState } from 'react';

import { ResultsTable } from './ResultsTable';
import * as pace from './running-pace-math';

type ResultsTab = 'race' | 'training';

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
  const [activeTab, setActiveTab] = useState<ResultsTab>('race');

  return (
    <div className="running-results">
      <div className="metric-card" aria-label="Estimated VDOT">
        <span>VDOT</span>
        <strong>{vdot.toFixed(1)}</strong>
      </div>

      <ResultsTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === 'race' && (
        <RacePacesPanel equivalentRaces={equivalentRaces} unit={unit} />
      )}

      {activeTab === 'training' && (
        <TrainingPacesPanel trainingPaces={trainingPaces} unit={unit} />
      )}
    </div>
  );
}

function RacePacesPanel({
  equivalentRaces,
  unit,
}: {
  equivalentRaces: pace.EquivalentRace[];
  unit: pace.Unit;
}) {
  return (
    <div aria-labelledby="race-paces-tab" id="race-paces-panel" role="tabpanel">
      <ResultsTable
        caption={`Equivalent races and paces per ${pace.unitLabels[unit]}`}
        headings={['Distance', 'Time', `Pace / ${pace.unitLabels[unit]}`]}
        rows={equivalentRaces.map((race) => ({
          cells: [race.label, race.time, race.pace],
          key: race.key,
        }))}
      />
    </div>
  );
}

function TrainingPacesPanel({
  trainingPaces,
  unit,
}: {
  trainingPaces: pace.TrainingPace[];
  unit: pace.Unit;
}) {
  return (
    <div
      aria-labelledby="training-paces-tab"
      id="training-paces-panel"
      role="tabpanel"
    >
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

function ResultsTabs({
  activeTab,
  setActiveTab,
}: {
  activeTab: ResultsTab;
  setActiveTab: (activeTab: ResultsTab) => void;
}) {
  return (
    <div className="results-tabs" role="tablist" aria-label="Running results">
      <button
        aria-controls="race-paces-panel"
        aria-selected={activeTab === 'race'}
        id="race-paces-tab"
        onClick={() => setActiveTab('race')}
        role="tab"
        type="button"
      >
        Race paces
      </button>
      <button
        aria-controls="training-paces-panel"
        aria-selected={activeTab === 'training'}
        id="training-paces-tab"
        onClick={() => setActiveTab('training')}
        role="tab"
        type="button"
      >
        Training paces
      </button>
    </div>
  );
}
