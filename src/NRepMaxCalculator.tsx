import { useMemo, useState } from 'react';

type FormulaKey = 'brzycki' | 'lander';

type Formula = {
  label: string;
  oneRepMax: (weight: number, reps: number) => number;
  targetWeight: (oneRepMax: number, reps: number) => number;
};

type Estimate = {
  reps: number;
  weight: number;
};

const repRange = Array.from({ length: 20 }, (_, index) => index + 1);

const formulas: Record<FormulaKey, Formula> = {
  brzycki: {
    label: 'Brzycki',
    oneRepMax: (weight, reps) => (weight * 36) / (37 - reps),
    targetWeight: (oneRepMax, reps) => (oneRepMax * (37 - reps)) / 36,
  },
  lander: {
    label: 'Lander',
    oneRepMax: (weight, reps) => (100 * weight) / (101.3 - 2.67123 * reps),
    targetWeight: (oneRepMax, reps) =>
      (oneRepMax * (101.3 - 2.67123 * reps)) / 100,
  },
};

const formulaKeys = Object.keys(formulas) as FormulaKey[];

export function NRepMaxCalculator() {
  const calculator = useRepMaxCalculator();

  return (
    <section className="calculator-panel" aria-labelledby="calculator-title">
      <CalculatorHeading />

      <div className="calculator-controls">
        <WeightInput
          setWeightInput={calculator.setWeightInput}
          weightInput={calculator.weightInput}
        />
        <RepSelect
          performedReps={calculator.performedReps}
          setPerformedReps={calculator.setPerformedReps}
        />
        <FormulaPicker
          formulaKey={calculator.formulaKey}
          setFormulaKey={calculator.setFormulaKey}
        />
      </div>

      {!calculator.hasValidWeight && (
        <p className="validation-message" role="status">
          Enter a weight greater than zero to see estimated rep maxes.
        </p>
      )}

      {calculator.hasValidWeight && (
        <ResultsTable
          estimates={calculator.estimates}
          formulaLabel={calculator.formula.label}
          performedReps={calculator.performedReps}
        />
      )}
    </section>
  );
}

function CalculatorHeading() {
  return (
    <div className="panel-heading">
      <p className="eyebrow">Strength</p>
      <h2 id="calculator-title">N-rep max calculator</h2>
    </div>
  );
}

function useRepMaxCalculator() {
  const [weightInput, setWeightInput] = useState('100');
  const [performedReps, setPerformedReps] = useState(5);
  const [formulaKey, setFormulaKey] = useState<FormulaKey>('brzycki');

  const weight = Number(weightInput);
  const formula = formulas[formulaKey];
  const hasValidWeight =
    weightInput.trim() !== '' && Number.isFinite(weight) && weight > 0;

  const estimates = useMemo(() => {
    if (!hasValidWeight) {
      return [];
    }

    const oneRepMax = formula.oneRepMax(weight, performedReps);

    return repRange.map((reps) => ({
      reps,
      weight: formula.targetWeight(oneRepMax, reps),
    }));
  }, [formula, hasValidWeight, performedReps, weight]);

  return {
    estimates,
    formula,
    formulaKey,
    hasValidWeight,
    performedReps,
    setFormulaKey,
    setPerformedReps,
    setWeightInput,
    weightInput,
  };
}

function WeightInput({
  setWeightInput,
  weightInput,
}: {
  setWeightInput: (weightInput: string) => void;
  weightInput: string;
}) {
  return (
    <label className="field">
      <span>Weight lifted</span>
      <input
        inputMode="decimal"
        min="0"
        onChange={(event) => setWeightInput(event.target.value)}
        placeholder="100"
        type="number"
        value={weightInput}
      />
    </label>
  );
}

function RepSelect({
  performedReps,
  setPerformedReps,
}: {
  performedReps: number;
  setPerformedReps: (performedReps: number) => void;
}) {
  return (
    <label className="field">
      <span>Reps performed</span>
      <select
        onChange={(event) => setPerformedReps(Number(event.target.value))}
        value={performedReps}
      >
        {repRange.map((reps) => (
          <option key={reps} value={reps}>
            {reps}
          </option>
        ))}
      </select>
    </label>
  );
}

function FormulaPicker({
  formulaKey,
  setFormulaKey,
}: {
  formulaKey: FormulaKey;
  setFormulaKey: (formulaKey: FormulaKey) => void;
}) {
  return (
    <fieldset className="formula-picker">
      <legend>Formula</legend>
      <div className="formula-options">
        {formulaKeys.map((key) => (
          <label key={key}>
            <input
              checked={formulaKey === key}
              name="formula"
              onChange={() => setFormulaKey(key)}
              type="radio"
              value={key}
            />
            <span>{formulas[key].label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function ResultsTable({
  estimates,
  formulaLabel,
  performedReps,
}: {
  estimates: Estimate[];
  formulaLabel: string;
  performedReps: number;
}) {
  return (
    <div className="results-wrap">
      <table className="results-table">
        <caption>Estimated weights with the {formulaLabel} formula</caption>
        <thead>
          <tr>
            <th scope="col">Reps</th>
            <th scope="col">Weight</th>
          </tr>
        </thead>
        <tbody>
          {estimates.map((estimate) => (
            <ResultRow
              estimate={estimate}
              isCurrent={estimate.reps === performedReps}
              key={estimate.reps}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ResultRow({
  estimate,
  isCurrent,
}: {
  estimate: Estimate;
  isCurrent: boolean;
}) {
  return (
    <tr className={isCurrent ? 'performed-row' : undefined}>
      <th scope="row">
        {estimate.reps}
        {isCurrent && <span className="current-reps">Current</span>}
      </th>
      <td>{estimate.weight.toFixed(1)}</td>
    </tr>
  );
}
