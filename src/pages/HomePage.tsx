// ─────────────────────────────────────────────────
// Htech · Home Page (Dashboard + Chart)
// Greeting, stats cards, glucose chart, recent readings
// ─────────────────────────────────────────────────

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { useDiabetes } from '../hooks/useDiabetes';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { GlucoseChart } from '../components/GlucoseChart';
import { DangerAlert } from '../components/DangerAlert';
import type { StatsPeriod } from '../types';

const periods: { key: StatsPeriod; label: string }[] = [
    { key: '7d', label: 'last_7_days' },
    { key: '14d', label: 'last_14_days' },
    { key: '30d', label: 'last_30_days' },
    { key: '90d', label: 'last_90_days' },
];

function getGreeting(t: (k: string) => string): string {
    const hour = new Date().getHours();
    if (hour < 12) return t('good_morning');
    if (hour < 18) return t('good_afternoon');
    return t('good_evening');
}

export function HomePage() {
    const { t, toggleLanguage, language, isRTL } = useLanguage();
    const { state, getLatestReading, getStats, detectDanger } = useDiabetes();
    const navigate = useNavigate();
    const [selectedPeriod, setSelectedPeriod] = useState<StatsPeriod>('7d');

    const latestReading = useMemo(() => getLatestReading(), [getLatestReading]);
    const stats = useMemo(() => getStats(selectedPeriod), [getStats, selectedPeriod]);
    const danger = useMemo(
        () => (latestReading ? detectDanger(latestReading.value) : null),
        [latestReading, detectDanger],
    );

    const todaysReadings = useMemo(() => {
        const today = new Date().toDateString();
        return state.readings.filter(
            (r) => new Date(r.timestamp).toDateString() === today,
        );
    }, [state.readings]);

    const recentReadings = state.readings.slice(0, 5);

    // Color helper for glucose values
    const getValueColor = (value: number) => {
        if (value <= 54) return '#dc2626';
        if (value <= 70) return '#f59e0b';
        if (value <= 180) return '#00d4aa';
        if (value >= 300) return '#dc2626';
        return '#ef4444';
    };

    return (
        <div className="page" id="home-page">
            {/* ── Header ──────────────────────────── */}
            <header
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '24px',
                }}
            >
                <div>
                    <p style={{ fontSize: '14px', color: '#94a3b8' }}>
                        {getGreeting(t)} 👋
                    </p>
                    <h1
                        style={{
                            fontSize: '26px',
                            fontWeight: 800,
                            background: 'linear-gradient(135deg, #00d4aa, #6366f1)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            marginTop: '4px',
                        }}
                    >
                        {t('app_name')}
                    </h1>
                </div>
                <button
                    id="lang-toggle"
                    onClick={toggleLanguage}
                    style={{
                        padding: '8px 16px',
                        borderRadius: '20px',
                        background: 'rgba(99, 102, 241, 0.15)',
                        color: '#a5b4fc',
                        fontSize: '13px',
                        fontWeight: 600,
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                        transition: 'all 0.2s ease',
                    }}
                >
                    {t('switch_language')}
                </button>
            </header>

            {/* ── Diabetes Type Selector ───────────── */}
            {!state.diabetesType && (
                <Card
                    glow
                    style={{
                        marginBottom: '20px',
                        animation: 'slideUp 0.4s ease forwards',
                    }}
                >
                    <h2
                        style={{
                            fontSize: '18px',
                            fontWeight: 700,
                            marginBottom: '16px',
                            textAlign: 'center',
                        }}
                    >
                        {t('select_diabetes_type')}
                    </h2>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <Button
                            variant="secondary"
                            fullWidth
                            onClick={() =>
                                navigate('/log', { state: { type: 'TYPE_1' } })
                            }
                        >
                            {t('type_1_short')}
                        </Button>
                        <Button
                            variant="primary"
                            fullWidth
                            onClick={() =>
                                navigate('/log', { state: { type: 'TYPE_2' } })
                            }
                        >
                            {t('type_2_short')}
                        </Button>
                    </div>
                </Card>
            )}

            {/* ── Danger Alert ─────────────────────── */}
            {danger && danger.isDangerous && (
                <div style={{ marginBottom: '20px' }}>
                    <DangerAlert danger={danger} />
                </div>
            )}

            {/* ── Latest Reading Hero ──────────────── */}
            <Card
                glow={!!latestReading}
                style={{
                    marginBottom: '20px',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Decorative gradient orb */}
                <div
                    style={{
                        position: 'absolute',
                        top: '-40px',
                        [isRTL ? 'left' : 'right']: '-40px',
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(0, 212, 170, 0.12), transparent)',
                        pointerEvents: 'none',
                    }}
                />
                <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '8px' }}>
                    {t('latest_reading')}
                </p>
                {latestReading ? (
                    <>
                        <p
                            style={{
                                fontSize: '48px',
                                fontWeight: 800,
                                color: getValueColor(latestReading.value),
                                lineHeight: 1.1,
                            }}
                        >
                            {latestReading.value}
                        </p>
                        <p style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>
                            {t('mg_dl')} · {t(latestReading.mealContext)}
                        </p>
                        <p style={{ fontSize: '12px', color: '#475569', marginTop: '8px' }}>
                            {new Date(latestReading.timestamp).toLocaleString(
                                language === 'ar' ? 'ar-SA' : 'en-US',
                                {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    month: 'short',
                                    day: 'numeric',
                                },
                            )}
                        </p>
                    </>
                ) : (
                    <div>
                        <p
                            style={{
                                fontSize: '48px',
                                fontWeight: 800,
                                color: '#334155',
                                lineHeight: 1.1,
                            }}
                        >
                            ---
                        </p>
                        <p style={{ fontSize: '14px', color: '#64748b', marginTop: '8px' }}>
                            {t('no_readings')}
                        </p>
                    </div>
                )}
            </Card>

            {/* ── Today's Summary ──────────────────── */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '12px',
                    marginBottom: '20px',
                }}
            >
                <Card style={{ textAlign: 'center', padding: '16px 12px' }}>
                    <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '6px' }}>
                        {t('total_readings')}
                    </p>
                    <p style={{ fontSize: '24px', fontWeight: 700, color: '#a5b4fc' }}>
                        {todaysReadings.length}
                    </p>
                </Card>
                <Card style={{ textAlign: 'center', padding: '16px 12px' }}>
                    <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '6px' }}>
                        {t('avg_glucose')}
                    </p>
                    <p style={{ fontSize: '24px', fontWeight: 700, color: '#00d4aa' }}>
                        {stats?.average ?? '—'}
                    </p>
                </Card>
                <Card style={{ textAlign: 'center', padding: '16px 12px' }}>
                    <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '6px' }}>
                        {t('in_range')}
                    </p>
                    <p style={{ fontSize: '24px', fontWeight: 700, color: '#22c55e' }}>
                        {stats ? `${stats.inRangePercentage}%` : '—'}
                    </p>
                </Card>
            </div>

            {/* ── Period Selector ──────────────────── */}
            <div
                style={{
                    display: 'flex',
                    gap: '8px',
                    marginBottom: '16px',
                    overflowX: 'auto',
                    paddingBottom: '4px',
                }}
            >
                {periods.map((p) => (
                    <button
                        key={p.key}
                        onClick={() => setSelectedPeriod(p.key)}
                        style={{
                            padding: '8px 14px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                            background:
                                selectedPeriod === p.key
                                    ? 'rgba(0, 212, 170, 0.15)'
                                    : 'rgba(255, 255, 255, 0.04)',
                            color:
                                selectedPeriod === p.key ? '#00d4aa' : '#64748b',
                            border: `1px solid ${selectedPeriod === p.key
                                    ? 'rgba(0, 212, 170, 0.3)'
                                    : 'rgba(255, 255, 255, 0.06)'
                                }`,
                            transition: 'all 0.2s ease',
                        }}
                    >
                        {t(p.label)}
                    </button>
                ))}
            </div>

            {/* ── Glucose Chart ────────────────────── */}
            <Card style={{ marginBottom: '20px', padding: '16px' }}>
                <h3
                    style={{
                        fontSize: '15px',
                        fontWeight: 700,
                        marginBottom: '12px',
                        color: '#e2e8f0',
                    }}
                >
                    {t('glucose_trend')} 📈
                </h3>
                <GlucoseChart readings={state.readings} height={200} />
                <p
                    style={{
                        fontSize: '11px',
                        color: '#475569',
                        marginTop: '8px',
                        textAlign: 'center',
                    }}
                >
                    {t('safe_range')}
                </p>
            </Card>

            {/* ── Stats Cards ──────────────────────── */}
            {stats && (
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '12px',
                        marginBottom: '20px',
                    }}
                >
                    <Card style={{ padding: '16px' }}>
                        <p style={{ fontSize: '11px', color: '#94a3b8' }}>{t('min')}</p>
                        <p
                            style={{
                                fontSize: '22px',
                                fontWeight: 700,
                                color: getValueColor(stats.min),
                                marginTop: '4px',
                            }}
                        >
                            {stats.min}
                            <span style={{ fontSize: '12px', color: '#64748b', marginInlineStart: '4px' }}>
                                {t('mg_dl')}
                            </span>
                        </p>
                    </Card>
                    <Card style={{ padding: '16px' }}>
                        <p style={{ fontSize: '11px', color: '#94a3b8' }}>{t('max')}</p>
                        <p
                            style={{
                                fontSize: '22px',
                                fontWeight: 700,
                                color: getValueColor(stats.max),
                                marginTop: '4px',
                            }}
                        >
                            {stats.max}
                            <span style={{ fontSize: '12px', color: '#64748b', marginInlineStart: '4px' }}>
                                {t('mg_dl')}
                            </span>
                        </p>
                    </Card>
                </div>
            )}

            {/* ── Recent Readings ──────────────────── */}
            {recentReadings.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
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
                        {recentReadings.map((reading, i) => (
                            <Card
                                key={reading.id}
                                style={{
                                    padding: '14px 16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    animationDelay: `${i * 0.05}s`,
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div
                                        style={{
                                            width: '8px',
                                            height: '8px',
                                            borderRadius: '50%',
                                            background: getValueColor(reading.value),
                                            boxShadow: `0 0 8px ${getValueColor(reading.value)}50`,
                                        }}
                                    />
                                    <div>
                                        <p style={{ fontSize: '15px', fontWeight: 700, color: getValueColor(reading.value) }}>
                                            {reading.value}
                                            <span style={{ fontSize: '11px', color: '#64748b', marginInlineStart: '4px' }}>
                                                {t('mg_dl')}
                                            </span>
                                        </p>
                                        <p style={{ fontSize: '11px', color: '#64748b' }}>
                                            {t(reading.mealContext)}
                                        </p>
                                    </div>
                                </div>
                                <p style={{ fontSize: '11px', color: '#475569' }}>
                                    {new Date(reading.timestamp).toLocaleString(
                                        language === 'ar' ? 'ar-SA' : 'en-US',
                                        {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            month: 'short',
                                            day: 'numeric',
                                        },
                                    )}
                                </p>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Quick Action ─────────────────────── */}
            <Button
                id="add-reading-btn"
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => navigate('/log')}
                style={{ marginTop: '8px' }}
            >
                ➕ {t('add_reading')}
            </Button>
        </div>
    );
}
