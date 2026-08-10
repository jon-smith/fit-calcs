export type DistanceKey =
  | '1500m'
  | 'mile'
  | '3k'
  | '5k'
  | '10k'
  | '10-mile'
  | 'half-marathon'
  | 'marathon'
  | 'custom';

export type Unit = 'km' | 'mile';

export type RaceDistance = {
  key: Exclude<DistanceKey, 'custom'>;
  label: string;
  meters: number;
};

export type TimeInput = {
  hours: string;
  minutes: string;
  seconds: string;
};

export type TrainingPace = {
  label: string;
  pace: string;
};

export type EquivalentRace = {
  key: string;
  label: string;
  pace: string;
  time: string;
};

export const metersPerKm = 1000;
export const metersPerMile = 1609.344;

export const raceDistances: RaceDistance[] = [
  { key: '1500m', label: '1500m', meters: 1500 },
  { key: 'mile', label: 'Mile', meters: metersPerMile },
  { key: '3k', label: '3K', meters: 3000 },
  { key: '5k', label: '5K', meters: 5000 },
  { key: '10k', label: '10K', meters: 10000 },
  { key: '10-mile', label: '10 mile', meters: metersPerMile * 10 },
  { key: 'half-marathon', label: 'Half marathon', meters: 21097.5 },
  { key: 'marathon', label: 'Marathon', meters: 42195 },
];

export const distanceOptions = [
  ...raceDistances,
  { key: 'custom' as const, label: 'Custom', meters: 0 },
];

export const trainingZones = [
  { label: 'Easy', intensities: [0.65, 0.75] },
  { label: 'Marathon', intensities: [0.8] },
  { label: 'Threshold', intensities: [0.86, 0.88] },
  { label: 'Interval', intensities: [0.95, 1] },
  { label: 'Repetition', intensities: [1.05] },
];

export const unitLabels: Record<Unit, string> = {
  km: 'km',
  mile: 'mile',
};

export function getDistanceMeters(
  distanceKey: DistanceKey,
  customDistance: string,
  unit: Unit,
) {
  if (distanceKey !== 'custom') {
    return (
      raceDistances.find((distance) => distance.key === distanceKey)?.meters ??
      Number.NaN
    );
  }

  const distance = Number(customDistance);

  if (!Number.isFinite(distance)) {
    return Number.NaN;
  }

  return distance * (unit === 'km' ? metersPerKm : metersPerMile);
}

export function getTimeInMinutes(timeInput: TimeInput) {
  const hours = Number(timeInput.hours);
  const minutes = Number(timeInput.minutes);
  const seconds = Number(timeInput.seconds);

  if (![hours, minutes, seconds].every(Number.isFinite)) {
    return Number.NaN;
  }

  return hours * 60 + minutes + seconds / 60;
}

export function calculateVdot(distanceMeters: number, timeMinutes: number) {
  return (
    calculateOxygenCost(distanceMeters / timeMinutes) /
    calculatePercentVo2Max(timeMinutes)
  );
}

export function solveRaceTimeForVdot(
  distanceMeters: number,
  targetVdot: number,
) {
  let low = 1;
  let high = 600;

  for (let index = 0; index < 80; index += 1) {
    const midpoint = (low + high) / 2;
    const midpointVdot = calculateVdot(distanceMeters, midpoint);

    if (midpointVdot > targetVdot) {
      low = midpoint;
    } else {
      high = midpoint;
    }
  }

  return (low + high) / 2;
}

export function formatTrainingPace(
  intensities: number[],
  vdot: number,
  unit: Unit,
) {
  const paces = intensities.map((intensity) =>
    formatPace(getPaceSecondsForOxygenCost(vdot * intensity, unit)),
  );

  return paces.length === 1 ? paces[0] : `${paces[1]}-${paces[0]}`;
}

export function getPaceSeconds(
  timeMinutes: number,
  distanceMeters: number,
  unit: Unit,
) {
  const unitMeters = unit === 'km' ? metersPerKm : metersPerMile;

  return ((timeMinutes * 60) / distanceMeters) * unitMeters;
}

export function formatPace(totalSeconds: number) {
  const roundedSeconds = Math.round(totalSeconds);
  const minutes = Math.floor(roundedSeconds / 60);
  const seconds = roundedSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function formatDuration(totalSeconds: number) {
  const roundedSeconds = Math.round(totalSeconds);
  const hours = Math.floor(roundedSeconds / 3600);
  const minutes = Math.floor((roundedSeconds % 3600) / 60);
  const seconds = roundedSeconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  }

  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function calculateOxygenCost(velocityMetersPerMinute: number) {
  return (
    -4.6 +
    0.182258 * velocityMetersPerMinute +
    0.000104 * velocityMetersPerMinute ** 2
  );
}

function calculatePercentVo2Max(timeMinutes: number) {
  return (
    0.8 +
    0.1894393 * Math.exp(-0.012778 * timeMinutes) +
    0.2989558 * Math.exp(-0.1932605 * timeMinutes)
  );
}

function getPaceSecondsForOxygenCost(oxygenCost: number, unit: Unit) {
  const velocityMetersPerMinute = solveVelocityForOxygenCost(oxygenCost);
  const unitMeters = unit === 'km' ? metersPerKm : metersPerMile;

  return (unitMeters / velocityMetersPerMinute) * 60;
}

function solveVelocityForOxygenCost(oxygenCost: number) {
  const a = 0.000104;
  const b = 0.182258;
  const c = -4.6 - oxygenCost;

  return (-b + Math.sqrt(b ** 2 - 4 * a * c)) / (2 * a);
}
