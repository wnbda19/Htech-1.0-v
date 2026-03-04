// ─────────────────────────────────────────────────
// Htech · Glucose & Diabetes Type Definitions
// Medical-safe strict types — no implicit any
// ─────────────────────────────────────────────────

/** Supported diabetes classifications */
export type DiabetesType = 'TYPE_1' | 'TYPE_2';

/** Meal timing context for a glucose reading */
export type MealContext = 'fasting' | 'before_meal' | 'after_meal' | 'bedtime' | 'random';

/** Severity level returned by danger-detection logic */
export type DangerLevel = 'none' | 'low' | 'high' | 'critical';

/** A single blood-glucose reading */
export interface GlucoseReading {
  /** UUID v4 */
  readonly id: string;
  /** Blood-glucose value in mg/dL */
  readonly value: number;
  /** ISO-8601 timestamp */
  readonly timestamp: string;
  /** Meal context at time of measurement */
  readonly mealContext: MealContext;
  /** Optional free-text note */
  readonly note?: string;
}

/** Result of dangerous-value analysis */
export interface DangerResult {
  readonly isDangerous: boolean;
  readonly level: DangerLevel;
  readonly message: string;
  /** The value that triggered the alert (mg/dL) */
  readonly value: number;
}

/**
 * Medical-grade thresholds (mg/dL).
 * Sources: ADA Standards of Medical Care in Diabetes.
 */
export interface GlucoseThresholds {
  readonly criticalLow: number;   // ≤ 54   → emergency
  readonly low: number;           // ≤ 70   → hypoglycemia
  readonly normalMin: number;     // 70     → lower normal bound
  readonly normalMax: number;     // 180    → upper post-meal normal
  readonly high: number;          // > 180  → hyperglycemia
  readonly criticalHigh: number;  // ≥ 300  → emergency
}

/** Summary statistics for a set of readings */
export interface ReadingStats {
  readonly average: number;
  readonly min: number;
  readonly max: number;
  readonly count: number;
  /** % of readings inside 70–180 mg/dL band */
  readonly inRangePercentage: number;
}

/** Aggregation period for averages/stats */
export type StatsPeriod = '7d' | '14d' | '30d' | '90d';
