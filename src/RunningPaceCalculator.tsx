import { useMemo, useState } from 'react';

import { RunningResults } from './RunningResults';
import * as pace from './runningPaceMath';

export function RunningPaceCalculator() {
  const calculator = useRunningPaceCalculator();

  return (
    <section className="calculator-panel" aria-labelledby="running-title">
      <div className="panel-heading panel-heading-with-action">
        <div>
          <p className="eyebrow">Running</p>
          <h2 id="running-title">Race pace calculator</h2>
        </div>
        <UnitToggle setUnit={calculator.setUnit} unit={calculator.unit} />
      </div>

      <div className="calculator-controls">
        <DistanceSelect
          distanceKey={calculator.distanceKey}
          setDistanceKey={calculator.setDistanceKey}
        />
        {calculator.distanceKey === 'custom' && (
          <CustomDistanceInput
            customDistance={calculator.customDistance}
            setCustomDistance={calculator.setCustomDistance}
            unit={calculator.unit}
          />
        )}
        <RaceTimeInput
          setTimeInput={calculator.setTimeInput}
          timeInput={calculator.timeInput}
        />
      </div>

      {!calculator.hasValidInputs && (
        <p className="validation-message" role="status">
          Enter a distance and race time greater than zero to see VDOT,
          equivalent races, and training paces.
        </p>
      )}

      {calculator.hasValidInputs && calculator.results && (
        <RunningResults
          equivalentRaces={calculator.results.equivalentRaces}
          trainingPaces={calculator.results.trainingPaces}
          unit={calculator.unit}
          vdot={calculator.results.vdot}
        />
      )}
    </section>
  );
}

function useRunningPaceCalculator() {
  const [unit, setUnit] = useState<pace.Unit>('km');
  const [distanceKey, setDistanceKey] = useState<pace.DistanceKey>('5k');
  const [customDistance, setCustomDistance] = useState('5');
  const [timeInput, setTimeInput] = useState<pace.TimeInput>({
    hours: '0',
    minutes: '22',
    seconds: '30',
  });

  const raceTimeMinutes = pace.getTimeInMinutes(timeInput);
  const distanceMeters = pace.getDistanceMeters(
    distanceKey,
    customDistance,
    unit,
  );
  const hasValidInputs =
    Number.isFinite(raceTimeMinutes) &&
    raceTimeMinutes > 0 &&
    Number.isFinite(distanceMeters) &&
    distanceMeters > 0;

  const results = useMemo(
    () =>
      hasValidInputs
        ? getRunningResults(distanceMeters, raceTimeMinutes, unit)
        : null,
    [distanceMeters, hasValidInputs, raceTimeMinutes, unit],
  );

  return {
    customDistance,
    distanceKey,
    hasValidInputs,
    results,
    setCustomDistance,
    setDistanceKey,
    setTimeInput,
    setUnit,
    timeInput,
    unit,
  };
}

function UnitToggle({
  setUnit,
  unit,
}: {
  setUnit: (unit: pace.Unit) => void;
  unit: pace.Unit;
}) {
  return (
    <fieldset className="segmented-control compact-control">
      <legend>Units</legend>
      <div>
        {(['km', 'mile'] as pace.Unit[]).map((option) => (
          <label key={option}>
            <input
              checked={unit === option}
              name="running-unit"
              onChange={() => setUnit(option)}
              type="radio"
              value={option}
            />
            <span>{option === 'km' ? 'km' : 'mi'}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function DistanceSelect({
  distanceKey,
  setDistanceKey,
}: {
  distanceKey: pace.DistanceKey;
  setDistanceKey: (distanceKey: pace.DistanceKey) => void;
}) {
  return (
    <label className="field">
      <span>Race distance</span>
      <select
        onChange={(event) =>
          setDistanceKey(event.target.value as pace.DistanceKey)
        }
        value={distanceKey}
      >
        {pace.distanceOptions.map((distance) => (
          <option key={distance.key} value={distance.key}>
            {distance.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function CustomDistanceInput({
  customDistance,
  setCustomDistance,
  unit,
}: {
  customDistance: string;
  setCustomDistance: (customDistance: string) => void;
  unit: pace.Unit;
}) {
  return (
    <label className="field">
      <span>Custom distance ({pace.unitLabels[unit]})</span>
      <input
        inputMode="decimal"
        min="0"
        onChange={(event) => setCustomDistance(event.target.value)}
        placeholder={unit === 'km' ? '8' : '5'}
        type="number"
        value={customDistance}
      />
    </label>
  );
}

function RaceTimeInput({
  setTimeInput,
  timeInput,
}: {
  setTimeInput: (timeInput: pace.TimeInput) => void;
  timeInput: pace.TimeInput;
}) {
  return (
    <fieldset className="time-input">
      <legend>Race time</legend>
      <div>
        <RaceTimeField
          label="Hours"
          setTimeInput={setTimeInput}
          timeInput={timeInput}
          timeKey="hours"
        />
        <RaceTimeField
          label="Minutes"
          setTimeInput={setTimeInput}
          timeInput={timeInput}
          timeKey="minutes"
        />
        <RaceTimeField
          label="Seconds"
          setTimeInput={setTimeInput}
          timeInput={timeInput}
          timeKey="seconds"
        />
      </div>
    </fieldset>
  );
}

function RaceTimeField({
  label,
  setTimeInput,
  timeInput,
  timeKey,
}: {
  label: string;
  setTimeInput: (timeInput: pace.TimeInput) => void;
  timeInput: pace.TimeInput;
  timeKey: keyof pace.TimeInput;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        inputMode="numeric"
        min="0"
        onChange={(event) =>
          setTimeInput({ ...timeInput, [timeKey]: event.target.value })
        }
        type="number"
        value={timeInput[timeKey]}
      />
    </label>
  );
}

function getRunningResults(
  distanceMeters: number,
  raceTimeMinutes: number,
  unit: pace.Unit,
) {
  const vdot = pace.calculateVdot(distanceMeters, raceTimeMinutes);
  const equivalentRaces = pace.raceDistances.map((distance) => {
    const time = pace.solveRaceTimeForVdot(distance.meters, vdot);

    return {
      key: distance.key,
      label: distance.label,
      pace: pace.formatPace(pace.getPaceSeconds(time, distance.meters, unit)),
      time: pace.formatDuration(time * 60),
    };
  });
  const trainingPaces = pace.trainingZones.map((zone) => ({
    label: zone.label,
    pace: pace.formatTrainingPace(zone.intensities, vdot, unit),
  }));

  return {
    equivalentRaces,
    trainingPaces,
    vdot,
  };
}
