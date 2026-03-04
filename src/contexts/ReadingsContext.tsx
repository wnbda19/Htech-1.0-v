// ─────────────────────────────────────────────────
// Htech · ReadingsContext (DiabetesContext)
// Medical-safe glucose state management
// ─────────────────────────────────────────────────
//
// Responsibilities:
//  • Store diabetes type (T1 / T2)
//  • CRUD glucose readings
//  • Compute statistics (avg, min, max, in-range %)
//  • Detect dangerous glucose values per ADA thresholds
//  • Persist everything to localStorage
// ─────────────────────────────────────────────────

import {
    createContext,
    useReducer,
    useEffect,
    useCallback,
    type ReactNode,
} from 'react';

import type {
    DiabetesType,
    MealContext,
    GlucoseReading,
    GlucoseThresholds,
    DangerResult,
    ReadingStats,
    StatsPeriod,
} from '../types/glucose';

import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
// ── Medical Thresholds (ADA-based, mg/dL) ──────

export const GLUCOSE_THRESHOLDS: GlucoseThresholds = {
    criticalLow: 54,
    low: 70,
    normalMin: 70,
    normalMax: 180,
    high: 180,
    criticalHigh: 300,
} as const;

// ── State ───────────────────────────────────────

export interface ReadingsState {
    readonly diabetesType: DiabetesType | null;
    readonly readings: readonly GlucoseReading[];
}

const initialState: ReadingsState = {
    diabetesType: null,
    readings: [],
};

// ── Actions ─────────────────────────────────────

type ReadingsAction =
    | { type: 'SET_DIABETES_TYPE'; payload: DiabetesType }
    | { type: 'ADD_READING'; payload: GlucoseReading }
    | { type: 'REMOVE_READING'; payload: string /* id */ }
    | { type: 'HYDRATE'; payload: ReadingsState };

// ── Reducer ─────────────────────────────────────

function readingsReducer(
    state: ReadingsState,
    action: ReadingsAction,
): ReadingsState {
    switch (action.type) {
        case 'SET_DIABETES_TYPE':
            return { ...state, diabetesType: action.payload };

        case 'ADD_READING':
            return {
                ...state,
                readings: [action.payload, ...state.readings],
            };

        case 'REMOVE_READING':
            return {
                ...state,
                readings: state.readings.filter((r) => r.id !== action.payload),
            };

        case 'HYDRATE':
            return action.payload;

        default:
            return state;
    }
}

// ── Pure helper: UUID v4 (crypto-safe) ──────────

function uuid(): string {
    return crypto.randomUUID();
}

// ── Pure helper: filter by period ───────────────

function filterByPeriod(
    readings: readonly GlucoseReading[],
    period: StatsPeriod,
): readonly GlucoseReading[] {
    const daysMap: Record<StatsPeriod, number> = {
        '7d': 7,
        '14d': 14,
        '30d': 30,
        '90d': 90,
    };
    const cutoff = Date.now() - daysMap[period] * 86_400_000;
    return readings.filter((r) => new Date(r.timestamp).getTime() >= cutoff);
}

// ── Context value shape ─────────────────────────

export interface ReadingsContextValue {
    /** Current state (diabetes type + readings array) */
    readonly state: ReadingsState;

    /** Set the user's diabetes type (T1 or T2) */
    setDiabetesType: (type: DiabetesType) => void;

    /** Add a new glucose reading */
    addReading: (
        value: number,
        mealContext: MealContext,
        note?: string,
    ) => GlucoseReading;

    /** Remove a reading by ID */
    removeReading: (id: string) => void;

    /** Get the most recent reading, or null */
    getLatestReading: () => GlucoseReading | null;

    /** Calculate stats for a given period */
    getStats: (period: StatsPeriod) => ReadingStats | null;

    /** Evaluate whether a single value is dangerous */
    detectDanger: (value: number) => DangerResult;
}

// ── Create Context ──────────────────────────────

export const ReadingsContext = createContext<ReadingsContextValue | null>(null);

// ── Provider ────────────────────────────────────

interface ReadingsProviderProps {
    readonly children: ReactNode;
}

export function ReadingsProvider({ children }: ReadingsProviderProps) {
    const [state, dispatch] = useReducer(readingsReducer, initialState);

    const { user } = useAuth();

    // ── Fetch from Supabase on mount/auth change ──────
    useEffect(() => {
        if (!user) {
            dispatch({ type: 'HYDRATE', payload: { diabetesType: null, readings: [] } });
            return;
        }

        const fetchData = async () => {
            // Fetch profile
            const { data: profile } = await supabase
                .from('profiles')
                .select('diabetes_type')
                .eq('id', user.id)
                .single();

            // Fetch readings
            const { data: readingsData } = await supabase
                .from('readings')
                .select('*')
                .eq('user_id', user.id)
                .order('timestamp', { ascending: false });

            const formattedReadings = (readingsData || []).map(r => ({
                id: r.id,
                value: r.value,
                timestamp: r.timestamp,
                mealContext: r.meal_context as MealContext,
                note: r.note
            }));

            dispatch({
                type: 'HYDRATE',
                payload: {
                    diabetesType: (profile?.diabetes_type as DiabetesType) || null,
                    readings: formattedReadings,
                },
            });
        };

        fetchData();
    }, [user]);

    // ── Actions ─────────────────────────────────

    const setDiabetesType = useCallback((type: DiabetesType) => {
        dispatch({ type: 'SET_DIABETES_TYPE', payload: type });
        if (user) {
            supabase
                .from('profiles')
                .upsert({ id: user.id, email: user.email, diabetes_type: type })
                .then(({ error }) => {
                    if (error) console.error('Error updating profile:', error);
                });
        }
    }, [user]);

    const addReading = useCallback(
        (value: number, mealContext: MealContext, note?: string): GlucoseReading => {
            const reading: GlucoseReading = {
                id: uuid(),
                value,
                timestamp: new Date().toISOString(),
                mealContext,
                note,
            };
            dispatch({ type: 'ADD_READING', payload: reading });

            if (user) {
                supabase.from('readings').insert({
                    id: reading.id,
                    user_id: user.id,
                    value: reading.value,
                    timestamp: reading.timestamp,
                    meal_context: reading.mealContext,
                    note: reading.note
                }).then(({ error }) => {
                    if (error) console.error('Error adding reading:', error);
                });
            }

            return reading;
        },
        [user],
    );

    const removeReading = useCallback((id: string) => {
        dispatch({ type: 'REMOVE_READING', payload: id });
        if (user) {
            supabase.from('readings').delete().eq('id', id).then(({ error }) => {
                if (error) console.error('Error deleting reading:', error);
            });
        }
    }, [user]);

    // ── Queries ─────────────────────────────────

    const getLatestReading = useCallback((): GlucoseReading | null => {
        if (state.readings.length === 0) return null;

        // Readings are prepended (newest first), but we sort defensively.
        return [...state.readings].sort(
            (a, b) =>
                new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        )[0];
    }, [state.readings]);

    const getStats = useCallback(
        (period: StatsPeriod): ReadingStats | null => {
            const filtered = filterByPeriod(state.readings, period);
            if (filtered.length === 0) return null;

            const values = filtered.map((r) => r.value);
            const sum = values.reduce((acc, v) => acc + v, 0);
            const inRange = values.filter(
                (v) =>
                    v >= GLUCOSE_THRESHOLDS.normalMin &&
                    v <= GLUCOSE_THRESHOLDS.normalMax,
            );

            return {
                average: Math.round(sum / values.length),
                min: Math.min(...values),
                max: Math.max(...values),
                count: values.length,
                inRangePercentage: Math.round(
                    (inRange.length / values.length) * 100,
                ),
            };
        },
        [state.readings],
    );

    /**
     * Evaluate a single glucose value against ADA thresholds.
     * Returns a structured result so the UI can render appropriate alerts.
     */
    const detectDanger = useCallback((value: number): DangerResult => {
        if (value <= GLUCOSE_THRESHOLDS.criticalLow) {
            return {
                isDangerous: true,
                level: 'critical',
                message: 'danger_critical_low',
                value,
            };
        }
        if (value <= GLUCOSE_THRESHOLDS.low) {
            return {
                isDangerous: true,
                level: 'low',
                message: 'danger_low',
                value,
            };
        }
        if (value >= GLUCOSE_THRESHOLDS.criticalHigh) {
            return {
                isDangerous: true,
                level: 'critical',
                message: 'danger_critical_high',
                value,
            };
        }
        if (value > GLUCOSE_THRESHOLDS.high) {
            return {
                isDangerous: true,
                level: 'high',
                message: 'danger_high',
                value,
            };
        }
        return {
            isDangerous: false,
            level: 'none',
            message: 'danger_none',
            value,
        };
    }, []);

    // ── Exposed value ───────────────────────────

    const contextValue: ReadingsContextValue = {
        state,
        setDiabetesType,
        addReading,
        removeReading,
        getLatestReading,
        getStats,
        detectDanger,
    };

    return (
        <ReadingsContext.Provider value={contextValue}>
            {children}
        </ReadingsContext.Provider>
    );
}
