// ─────────────────────────────────────────────────
// Htech · Log Reading Page
// Supports Type 1 (insulin-focused) & Type 2 (lifestyle-focused)
// ─────────────────────────────────────────────────

import { useState, useCallback, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { useDiabetes } from '../hooks/useDiabetes';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { DangerAlert } from '../components/DangerAlert';
import type { MealContext, DiabetesType, DangerResult } from '../types';

const mealOptions: { key: MealContext; label: string }[] = [
    { key: 'fasting', label: 'fasting' },
    { key: 'before_meal', label: 'before_meal' },
    { key: 'after_meal', label: 'after_meal' },
    { key: 'bedtime', label: 'bedtime' },
    { key: 'random', label: 'random' },
];

export function LogReadingPage() {
    const { t, language } = useLanguage();
    const { state, setDiabetesType, addReading, detectDanger } = useDiabetes();
    const location = useLocation();

    // Type from route state or existing selection
    const routeType = (location.state as { type?: DiabetesType } | null)?.type;

    const [glucoseValue, setGlucoseValue] = useState('');
    const [selectedMeal, setSelectedMeal] = useState<MealContext | null>(null);
    const [note, setNote] = useState('');
    const [insulinDose, setInsulinDose] = useState('');
    const [carbsConsumed, setCarbsConsumed] = useState('');
    const [exerciseMin, setExerciseMin] = useState('');
    const [dangerResult, setDangerResult] = useState<DangerResult | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [activeTab, setActiveTab] = useState<DiabetesType>(
        routeType ?? state.diabetesType ?? 'TYPE_2',
    );

    // If a route type was passed, set it
    useEffect(() => {
        if (routeType && state.diabetesType !== routeType) {
            setDiabetesType(routeType);
        }
    }, [routeType, state.diabetesType, setDiabetesType]);

    const handleGlucoseChange = useCallback(
        (val: string) => {
            setGlucoseValue(val);
            const num = Number(val);
            if (!Number.isNaN(num) && num > 0) {
                setDangerResult(detectDanger(num));
            } else {
                setDangerResult(null);
            }
        },
        [detectDanger],
    );

    const handleSubmit = useCallback(() => {
        const num = Number(glucoseValue);
        if (Number.isNaN(num) || num <= 0 || !selectedMeal) return;

        // Build note with extra fields
        const extraNotes: string[] = [];
        if (note) extraNotes.push(note);
        if (insulinDose) extraNotes.push(`Insulin: ${insulinDose}u`);
        if (carbsConsumed) extraNotes.push(`Carbs: ${carbsConsumed}g`);
        if (exerciseMin) extraNotes.push(`Exercise: ${exerciseMin}min`);

        setDiabetesType(activeTab);
        addReading(num, selectedMeal, extraNotes.join(' | ') || undefined);

        // Reset
        setGlucoseValue('');
        setSelectedMeal(null);
        setNote('');
        setInsulinDose('');
        setCarbsConsumed('');
        setExerciseMin('');
        setDangerResult(null);
        // Trigger Confetti if the reading is perfect/normal!
        const result = detectDanger(num);
        if (!result.isDangerous) {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#00d4aa', '#6366f1', '#a5b4fc'],
            });
        }

        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    }, [
        glucoseValue,
        selectedMeal,
        note,
        insulinDose,
        carbsConsumed,
        exerciseMin,
        activeTab,
        setDiabetesType,
        addReading,
    ]);

    const isValid = Number(glucoseValue) > 0 && selectedMeal !== null;

    // Recent readings
    const recentReadings = state.readings.slice(0, 3);

    // Color helper for glucose values
    const getValueColor = (value: number) => {
        if (value <= 54) return '#dc2626';
        if (value <= 70) return '#f59e0b';
        if (value <= 180) return '#00d4aa';
        if (value >= 300) return '#dc2626';
        return '#ef4444';
    };

    return (
        <div className="page" id="log-reading-page">
            {/* ── Header ──────────────────────────── */}
            <h1
                style={{
                    fontSize: '24px',
                    fontWeight: 800,
                    marginBottom: '20px',
                    background: 'linear-gradient(135deg, #00d4aa, #6366f1)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}
            >
                📊 {t('log_reading')}
            </h1>

            {/* ── Type Tabs ───────────────────────── */}
            <div
                style={{
                    display: 'flex',
                    gap: '8px',
                    marginBottom: '20px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '14px',
                    padding: '4px',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                }}
            >
                {(['TYPE_1', 'TYPE_2'] as DiabetesType[]).map((type) => (
                    <button
                        key={type}
                        id={`tab-${type.toLowerCase()}`}
                        onClick={() => setActiveTab(type)}
                        style={{
                            flex: 1,
                            padding: '12px 16px',
                            borderRadius: '10px',
                            fontSize: '14px',
                            fontWeight: activeTab === type ? 700 : 500,
                            background:
                                activeTab === type
                                    ? 'linear-gradient(135deg, rgba(0, 212, 170, 0.2), rgba(99, 102, 241, 0.2))'
                                    : 'transparent',
                            color: activeTab === type ? '#00d4aa' : '#64748b',
                            border:
                                activeTab === type
                                    ? '1px solid rgba(0, 212, 170, 0.3)'
                                    : '1px solid transparent',
                            transition: 'all 0.25s ease',
                        }}
                    >
                        {type === 'TYPE_1' ? t('type_1_short') : t('type_2_short')}
                    </button>
                ))}
            </div>

            {/* ── Success Message ──────────────────── */}
            {showSuccess && (
                <div
                    style={{
                        padding: '14px 16px',
                        borderRadius: '12px',
                        background: 'rgba(34, 197, 94, 0.12)',
                        border: '1px solid rgba(34, 197, 94, 0.3)',
                        marginBottom: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        animation: 'slideUp 0.3s ease forwards',
                    }}
                >
                    <span style={{ fontSize: '20px' }}>✅</span>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#86efac' }}>
                        {t('reading_saved')}
                    </p>
                </div>
            )}

            {/* ── Main Form ───────────────────────── */}
            <Card style={{ marginBottom: '16px' }}>
                {/* Glucose Value Input */}
                <div style={{ marginBottom: '20px' }}>
                    <label
                        style={{
                            display: 'block',
                            fontSize: '13px',
                            fontWeight: 600,
                            color: '#94a3b8',
                            marginBottom: '8px',
                        }}
                    >
                        {t('glucose_value')}
                    </label>
                    <input
                        id="glucose-input"
                        type="number"
                        inputMode="numeric"
                        value={glucoseValue}
                        onChange={(e) => handleGlucoseChange(e.target.value)}
                        placeholder={t('enter_glucose')}
                        min="20"
                        max="600"
                        style={{
                            fontSize: '24px',
                            fontWeight: 700,
                            textAlign: 'center',
                            padding: '16px',
                            background: 'rgba(15, 22, 41, 0.8)',
                            border: `2px solid ${dangerResult?.isDangerous
                                ? '#ef4444'
                                : glucoseValue
                                    ? '#00d4aa'
                                    : 'rgba(255, 255, 255, 0.06)'
                                }`,
                            borderRadius: '14px',
                            color: glucoseValue
                                ? getValueColor(Number(glucoseValue))
                                : '#f1f5f9',
                            transition: 'all 0.2s ease',
                            direction: 'ltr',
                        }}
                    />
                    {glucoseValue && (
                        <p
                            style={{
                                textAlign: 'center',
                                fontSize: '12px',
                                color: '#64748b',
                                marginTop: '6px',
                            }}
                        >
                            {t('mg_dl')}
                        </p>
                    )}
                </div>

                {/* Danger Alert */}
                {dangerResult && dangerResult.isDangerous && (
                    <div style={{ marginBottom: '20px' }}>
                        <DangerAlert danger={dangerResult} />
                    </div>
                )}

                {/* Meal Context */}
                <div style={{ marginBottom: '20px' }}>
                    <label
                        style={{
                            display: 'block',
                            fontSize: '13px',
                            fontWeight: 600,
                            color: '#94a3b8',
                            marginBottom: '10px',
                        }}
                    >
                        {t('meal_context')}
                    </label>
                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '8px',
                        }}
                    >
                        {mealOptions.map((option) => (
                            <button
                                key={option.key}
                                id={`meal-${option.key}`}
                                onClick={() => setSelectedMeal(option.key)}
                                style={{
                                    padding: '10px 16px',
                                    borderRadius: '10px',
                                    fontSize: '13px',
                                    fontWeight: selectedMeal === option.key ? 700 : 500,
                                    background:
                                        selectedMeal === option.key
                                            ? 'rgba(0, 212, 170, 0.15)'
                                            : 'rgba(255, 255, 255, 0.04)',
                                    color:
                                        selectedMeal === option.key
                                            ? '#00d4aa'
                                            : '#94a3b8',
                                    border: `1px solid ${selectedMeal === option.key
                                        ? 'rgba(0, 212, 170, 0.3)'
                                        : 'rgba(255, 255, 255, 0.06)'
                                        }`,
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                {t(option.label)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Type-specific Fields ──────────── */}
                {activeTab === 'TYPE_1' && (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '14px',
                            marginBottom: '20px',
                            animation: 'slideUp 0.3s ease',
                        }}
                    >
                        <div>
                            <label
                                style={{
                                    display: 'block',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    color: '#94a3b8',
                                    marginBottom: '8px',
                                }}
                            >
                                💉 {t('insulin_dose')}
                            </label>
                            <input
                                id="insulin-input"
                                type="number"
                                inputMode="decimal"
                                value={insulinDose}
                                onChange={(e) => setInsulinDose(e.target.value)}
                                placeholder="0"
                                style={{
                                    background: 'rgba(15, 22, 41, 0.8)',
                                    borderRadius: '12px',
                                    direction: 'ltr',
                                }}
                            />
                        </div>
                        <div>
                            <label
                                style={{
                                    display: 'block',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    color: '#94a3b8',
                                    marginBottom: '8px',
                                }}
                            >
                                🍞 {t('carbs_consumed')}
                            </label>
                            <input
                                id="carbs-input"
                                type="number"
                                inputMode="numeric"
                                value={carbsConsumed}
                                onChange={(e) => setCarbsConsumed(e.target.value)}
                                placeholder="0"
                                style={{
                                    background: 'rgba(15, 22, 41, 0.8)',
                                    borderRadius: '12px',
                                    direction: 'ltr',
                                }}
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'TYPE_2' && (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '14px',
                            marginBottom: '20px',
                            animation: 'slideUp 0.3s ease',
                        }}
                    >
                        <div>
                            <label
                                style={{
                                    display: 'block',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    color: '#94a3b8',
                                    marginBottom: '8px',
                                }}
                            >
                                🏃 {t('exercise_minutes')}
                            </label>
                            <input
                                id="exercise-input"
                                type="number"
                                inputMode="numeric"
                                value={exerciseMin}
                                onChange={(e) => setExerciseMin(e.target.value)}
                                placeholder="0"
                                style={{
                                    background: 'rgba(15, 22, 41, 0.8)',
                                    borderRadius: '12px',
                                    direction: 'ltr',
                                }}
                            />
                        </div>
                        <div>
                            <label
                                style={{
                                    display: 'block',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    color: '#94a3b8',
                                    marginBottom: '8px',
                                }}
                            >
                                🍞 {t('carbs_consumed')}
                            </label>
                            <input
                                id="carbs-input-t2"
                                type="number"
                                inputMode="numeric"
                                value={carbsConsumed}
                                onChange={(e) => setCarbsConsumed(e.target.value)}
                                placeholder="0"
                                style={{
                                    background: 'rgba(15, 22, 41, 0.8)',
                                    borderRadius: '12px',
                                    direction: 'ltr',
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* Note */}
                <div style={{ marginBottom: '20px' }}>
                    <label
                        style={{
                            display: 'block',
                            fontSize: '13px',
                            fontWeight: 600,
                            color: '#94a3b8',
                            marginBottom: '8px',
                        }}
                    >
                        📝 {t('note')}
                    </label>
                    <textarea
                        id="note-input"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder={t('note')}
                        rows={2}
                        style={{
                            background: 'rgba(15, 22, 41, 0.8)',
                            borderRadius: '12px',
                            resize: 'none',
                        }}
                    />
                </div>

                {/* Submit */}
                <Button
                    id="submit-reading"
                    variant="primary"
                    size="lg"
                    fullWidth
                    disabled={!isValid}
                    onClick={handleSubmit}
                >
                    {t('save')} ✓
                </Button>
            </Card>

            {/* ── Recent Entries ────────────────────── */}
            {recentReadings.length > 0 && (
                <div>
                    <h3
                        style={{
                            fontSize: '15px',
                            fontWeight: 700,
                            marginBottom: '12px',
                            color: '#e2e8f0',
                        }}
                    >
                        {t('recent_readings')}
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {recentReadings.map((reading) => (
                            <Card
                                key={reading.id}
                                style={{
                                    padding: '12px 16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div
                                        style={{
                                            width: '6px',
                                            height: '6px',
                                            borderRadius: '50%',
                                            background: getValueColor(reading.value),
                                        }}
                                    />
                                    <span style={{ fontWeight: 700, color: getValueColor(reading.value) }}>
                                        {reading.value}
                                    </span>
                                    <span style={{ fontSize: '12px', color: '#64748b' }}>
                                        {t(reading.mealContext)}
                                    </span>
                                </div>
                                <span style={{ fontSize: '11px', color: '#475569' }}>
                                    {new Date(reading.timestamp).toLocaleTimeString(
                                        language === 'ar' ? 'ar-SA' : 'en-US',
                                        { hour: '2-digit', minute: '2-digit' },
                                    )}
                                </span>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
