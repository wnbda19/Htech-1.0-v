// ─────────────────────────────────────────────────
// Htech · Caregiver Dashboard Page
// Monitor patients' glucose levels
// ─────────────────────────────────────────────────

import { useState, useMemo, useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

// ── Mock patient data ──────────────────────────

interface PatientRecord {
    readonly id: string;
    readonly nameEn: string;
    readonly nameAr: string;
    readonly lastValue: number | null;
    readonly lastTimestamp: string | null;
    readonly diabetesType: 'TYPE_1' | 'TYPE_2';
    readonly readings7d: number;
    readonly averageGlucose: number | null;
}

function timeAgo(timestamp: string, t: (k: string) => string): string {
    const diff = Date.now() - new Date(timestamp).getTime();
    const mins = Math.floor(diff / 60_000);
    if (mins < 60) return `${mins} ${t('minutes')} ${t('time_ago')}`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} ${t('hours')} ${t('time_ago')}`;
    const days = Math.floor(hrs / 24);
    return `${days} ${t('days')} ${t('time_ago')}`;
}

function getPatientStatus(value: number | null): 'normal' | 'warning' | 'critical' {
    if (value === null) return 'normal';
    if (value <= 54 || value >= 300) return 'critical';
    if (value <= 70 || value > 180) return 'warning';
    return 'normal';
}

const statusColors: Record<string, string> = {
    normal: '#22c55e',
    warning: '#f59e0b',
    critical: '#dc2626',
};

export function CaregiverPage() {
    const { t, language, isRTL } = useLanguage();
    const { user, signOut } = useAuth();
    const [showAddPatient, setShowAddPatient] = useState(false);
    const [patientNameInput, setPatientNameInput] = useState('');
    const [patientPhoneInput, setPatientPhoneInput] = useState('');
    const [addedPatients, setAddedPatients] = useState<PatientRecord[]>([]);
    const [showPatientSuccess, setShowPatientSuccess] = useState(false);
    const [showPatientError, setShowPatientError] = useState(false);

    const [realPatients, setRealPatients] = useState<PatientRecord[]>([]);

    // Toggle whether the current user is shown in the dashboard list
    const [isCaregiverMode, setIsCaregiverMode] = useState(() => {
        return localStorage.getItem('caregiverMode') === 'true';
    });

    useEffect(() => {
        localStorage.setItem('caregiverMode', String(isCaregiverMode));
    }, [isCaregiverMode]);

    useEffect(() => {
        const fetchAllPatients = async () => {
            // Because we added "SELECT USING (true)" policies, we can now read ALL profiles and ALL readings.
            const { data: profiles, error: profileErr } = await supabase.from('profiles').select('*');
            if (profileErr) {
                console.error('Error fetching profiles:', profileErr);
                return;
            }

            const { data: readings, error: readingErr } = await supabase.from('readings').select('*');
            if (readingErr) {
                console.error('Error fetching readings:', readingErr);
                return;
            }

            const now = new Date().getTime();
            const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

            const fetchedPatients: PatientRecord[] = (profiles || []).map((prof: any) => {
                const userReadings = (readings || [])
                    .filter((r: any) => r.user_id === prof.id)
                    .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

                const latestReading = userReadings[0];

                const readings7d = userReadings.filter((r: any) => new Date(r.timestamp).getTime() >= sevenDaysAgo);

                let avg = null;
                if (readings7d.length > 0) {
                    const sum = readings7d.reduce((acc: number, curr: any) => acc + curr.value, 0);
                    avg = Math.round(sum / readings7d.length);
                }

                // Parse email to create a display name
                const emailPrefix = prof.email ? prof.email.split('@')[0] : 'Unknown';
                const displayName = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);

                return {
                    id: prof.id,
                    nameEn: displayName,
                    nameAr: displayName,
                    lastValue: latestReading ? latestReading.value : null,
                    lastTimestamp: latestReading ? latestReading.timestamp : null,
                    diabetesType: (prof.diabetes_type as 'TYPE_1' | 'TYPE_2') || 'TYPE_2',
                    readings7d: readings7d.length,
                    averageGlucose: avg,
                };
            });

            setRealPatients(fetchedPatients);
        };

        fetchAllPatients();

        // Polling every 30 seconds for live updates
        const interval = setInterval(fetchAllPatients, 30000);
        return () => clearInterval(interval);
    }, []);

    // Build patient list from actual data
    const patients: PatientRecord[] = useMemo(() => {
        const all = [...addedPatients, ...realPatients];
        if (isCaregiverMode && user) {
            return all.filter((p) => p.id !== user.id);
        }
        return all;
    }, [realPatients, addedPatients, isCaregiverMode, user]);

    const criticalCount = patients.filter(
        (p) => getPatientStatus(p.lastValue) === 'critical',
    ).length;
    const warningCount = patients.filter(
        (p) => getPatientStatus(p.lastValue) === 'warning',
    ).length;

    return (
        <div className="page" id="caregiver-page" style={{ paddingBottom: '80px' }}>
            {/* ── Header ──────────────────────────── */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h1
                    style={{
                        fontSize: '24px',
                        fontWeight: 800,
                        background: 'linear-gradient(135deg, #00d4aa, #6366f1)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    👥 {t('caregiver_dashboard')}
                </h1>
                <Button variant="danger" size="sm" onClick={signOut}>
                    Logout
                </Button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <p
                    style={{
                        fontSize: '13px',
                        color: '#94a3b8',
                        flex: 1,
                    }}
                >
                    {t('caregiver_info')}
                </p>
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsCaregiverMode(!isCaregiverMode)}
                >
                    {isCaregiverMode ? '👁️ Caregiver Mode' : '👤 Patient Mode'}
                </Button>
            </div>

            {/* ── Overview Stats ───────────────────── */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '12px',
                    marginBottom: '24px',
                }}
            >
                <Card style={{ textAlign: 'center', padding: '16px 12px' }}>
                    <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>
                        {language === 'ar' ? 'المرضى' : 'Patients'}
                    </p>
                    <p style={{ fontSize: '28px', fontWeight: 800, color: '#a5b4fc' }}>
                        {patients.length}
                    </p>
                </Card>
                <Card style={{ textAlign: 'center', padding: '16px 12px' }}>
                    <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>
                        {t('warning')}
                    </p>
                    <p style={{ fontSize: '28px', fontWeight: 800, color: '#f59e0b' }}>
                        {warningCount}
                    </p>
                </Card>
                <Card
                    style={{
                        textAlign: 'center',
                        padding: '16px 12px',
                        boxShadow:
                            criticalCount > 0
                                ? '0 0 20px rgba(220, 38, 38, 0.2)'
                                : undefined,
                    }}
                >
                    <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>
                        {t('critical')}
                    </p>
                    <p
                        style={{
                            fontSize: '28px',
                            fontWeight: 800,
                            color: criticalCount > 0 ? '#dc2626' : '#22c55e',
                        }}
                    >
                        {criticalCount}
                    </p>
                </Card>
            </div>

            {/* ── Patient Cards ────────────────────── */}
            <h3
                style={{
                    fontSize: '15px',
                    fontWeight: 700,
                    marginBottom: '12px',
                    color: '#e2e8f0',
                }}
            >
                {t('patient_overview')}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                {patients.map((patient, i) => {
                    const status = getPatientStatus(patient.lastValue);
                    const statusColor = statusColors[status];
                    const name = language === 'ar' ? patient.nameAr : patient.nameEn;

                    return (
                        <Card
                            key={patient.id}
                            style={{
                                padding: '16px',
                                borderInlineStart: `3px solid ${statusColor}`,
                                animation: `slideUp 0.3s ease ${i * 0.05}s both`,
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    marginBottom: '12px',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    {/* Avatar */}
                                    <div
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            background: `linear-gradient(135deg, ${statusColor}30, ${statusColor}10)`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '18px',
                                            border: `2px solid ${statusColor}40`,
                                        }}
                                    >
                                        {name[0]}
                                    </div>
                                    <div>
                                        <p
                                            style={{
                                                fontSize: '15px',
                                                fontWeight: 700,
                                                color: '#f1f5f9',
                                            }}
                                        >
                                            {name}
                                        </p>
                                        <p
                                            style={{
                                                fontSize: '11px',
                                                color: '#64748b',
                                            }}
                                        >
                                            {patient.diabetesType === 'TYPE_1'
                                                ? t('type_1_short')
                                                : t('type_2_short')}
                                        </p>
                                    </div>
                                </div>

                                {/* Status Badge */}
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '4px 10px',
                                        borderRadius: '20px',
                                        background: `${statusColor}15`,
                                        border: `1px solid ${statusColor}30`,
                                    }}
                                >
                                    <span
                                        className={`status-dot ${status}`}
                                        style={{ width: '6px', height: '6px' }}
                                    />
                                    <span
                                        style={{
                                            fontSize: '11px',
                                            fontWeight: 600,
                                            color: statusColor,
                                        }}
                                    >
                                        {t(status)}
                                    </span>
                                </div>
                            </div>

                            {/* Readings info */}
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(3, 1fr)',
                                    gap: '8px',
                                }}
                            >
                                <div
                                    style={{
                                        textAlign: 'center',
                                        padding: '10px 8px',
                                        borderRadius: '10px',
                                        background: 'rgba(255, 255, 255, 0.03)',
                                    }}
                                >
                                    <p style={{ fontSize: '10px', color: '#64748b', marginBottom: '4px' }}>
                                        {t('last_reading')}
                                    </p>
                                    <p
                                        style={{
                                            fontSize: '18px',
                                            fontWeight: 700,
                                            color: patient.lastValue
                                                ? statusColor
                                                : '#334155',
                                        }}
                                    >
                                        {patient.lastValue ?? '—'}
                                    </p>
                                </div>
                                <div
                                    style={{
                                        textAlign: 'center',
                                        padding: '10px 8px',
                                        borderRadius: '10px',
                                        background: 'rgba(255, 255, 255, 0.03)',
                                    }}
                                >
                                    <p style={{ fontSize: '10px', color: '#64748b', marginBottom: '4px' }}>
                                        {t('average')}
                                    </p>
                                    <p
                                        style={{
                                            fontSize: '18px',
                                            fontWeight: 700,
                                            color: '#a5b4fc',
                                        }}
                                    >
                                        {patient.averageGlucose ?? '—'}
                                    </p>
                                </div>
                                <div
                                    style={{
                                        textAlign: 'center',
                                        padding: '10px 8px',
                                        borderRadius: '10px',
                                        background: 'rgba(255, 255, 255, 0.03)',
                                    }}
                                >
                                    <p style={{ fontSize: '10px', color: '#64748b', marginBottom: '4px' }}>
                                        {t('readings_count')}
                                    </p>
                                    <p
                                        style={{
                                            fontSize: '18px',
                                            fontWeight: 700,
                                            color: '#94a3b8',
                                        }}
                                    >
                                        {patient.readings7d}
                                    </p>
                                </div>
                            </div>

                            {/* Timestamp */}
                            {patient.lastTimestamp && (
                                <p
                                    style={{
                                        fontSize: '11px',
                                        color: '#475569',
                                        marginTop: '10px',
                                        textAlign: isRTL ? 'right' : 'left',
                                    }}
                                >
                                    🕐 {timeAgo(patient.lastTimestamp, t)}
                                </p>
                            )}
                        </Card>
                    );
                })}
            </div>

            {/* ── Add Patient ────────────────────── */}
            {showPatientSuccess && (
                <div
                    style={{
                        padding: '14px 16px',
                        borderRadius: '12px',
                        background: 'rgba(34, 197, 94, 0.12)',
                        border: '1px solid rgba(34, 197, 94, 0.3)',
                        marginBottom: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        animation: 'slideUp 0.3s ease forwards',
                    }}
                >
                    <span style={{ fontSize: '20px' }}>✅</span>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#86efac' }}>
                        {t('patient_added')}
                    </p>
                </div>
            )}

            {showAddPatient && (
                <Card
                    style={{
                        marginBottom: '16px',
                        animation: 'scaleIn 0.3s ease',
                    }}
                >
                    <h3
                        style={{
                            fontSize: '15px',
                            fontWeight: 700,
                            marginBottom: '16px',
                            color: '#e2e8f0',
                        }}
                    >
                        {t('add_patient')}
                    </h3>

                    {/* Patient Name Input */}
                    <div style={{ marginBottom: '12px' }}>
                        <label
                            style={{
                                display: 'block',
                                fontSize: '12px',
                                fontWeight: 600,
                                color: '#94a3b8',
                                marginBottom: '6px',
                            }}
                        >
                            👤 {t('patient_full_name')}
                        </label>
                        <input
                            id="patient-name-input"
                            value={patientNameInput}
                            onChange={(e) => {
                                setPatientNameInput(e.target.value);
                                setShowPatientError(false);
                            }}
                            placeholder={t('enter_patient_name')}
                            style={{
                                background: 'rgba(15, 22, 41, 0.8)',
                                borderRadius: '12px',
                            }}
                        />
                    </div>

                    {/* Phone Number Input */}
                    <div style={{ marginBottom: '16px' }}>
                        <label
                            style={{
                                display: 'block',
                                fontSize: '12px',
                                fontWeight: 600,
                                color: '#94a3b8',
                                marginBottom: '6px',
                            }}
                        >
                            📱 {t('patient_phone')}
                        </label>
                        <input
                            id="patient-phone-input"
                            type="tel"
                            inputMode="tel"
                            value={patientPhoneInput}
                            onChange={(e) => {
                                setPatientPhoneInput(e.target.value);
                                setShowPatientError(false);
                            }}
                            placeholder={t('enter_phone')}
                            style={{
                                background: 'rgba(15, 22, 41, 0.8)',
                                borderRadius: '12px',
                                direction: 'ltr',
                            }}
                        />
                    </div>

                    {/* Error Message */}
                    {showPatientError && (
                        <p
                            style={{
                                fontSize: '12px',
                                color: '#ef4444',
                                marginBottom: '12px',
                                textAlign: 'center',
                            }}
                        >
                            ⚠️ {t('fill_all_fields')}
                        </p>
                    )}

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <Button
                            variant="ghost"
                            size="sm"
                            fullWidth
                            onClick={() => {
                                setShowAddPatient(false);
                                setPatientNameInput('');
                                setPatientPhoneInput('');
                                setShowPatientError(false);
                            }}
                        >
                            {t('cancel')}
                        </Button>
                        <Button
                            variant="primary"
                            size="sm"
                            fullWidth
                            onClick={() => {
                                if (!patientNameInput.trim() || !patientPhoneInput.trim()) {
                                    setShowPatientError(true);
                                    return;
                                }
                                // Add the new patient
                                const newPatient: PatientRecord = {
                                    id: crypto.randomUUID(),
                                    nameEn: patientNameInput.trim(),
                                    nameAr: patientNameInput.trim(),
                                    lastValue: null,
                                    lastTimestamp: null,
                                    diabetesType: 'TYPE_2',
                                    readings7d: 0,
                                    averageGlucose: null,
                                };
                                setAddedPatients((prev) => [...prev, newPatient]);
                                setPatientNameInput('');
                                setPatientPhoneInput('');
                                setShowAddPatient(false);
                                setShowPatientError(false);
                                setShowPatientSuccess(true);
                                setTimeout(() => setShowPatientSuccess(false), 3000);
                            }}
                        >
                            {t('save')}
                        </Button>
                    </div>
                </Card>
            )}

            <Button
                id="add-patient-btn"
                variant="secondary"
                fullWidth
                onClick={() => setShowAddPatient(!showAddPatient)}
            >
                ➕ {t('add_patient')}
            </Button>
        </div>
    );
}
