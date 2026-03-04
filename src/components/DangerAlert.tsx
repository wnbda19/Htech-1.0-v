// ─────────────────────────────────────────────────
// Htech · DangerAlert Component
// Displays danger alerts for glucose readings
// ─────────────────────────────────────────────────

import type { DangerResult } from '../types';
import { useLanguage } from '../hooks';

interface DangerAlertProps {
    readonly danger: DangerResult;
}

const levelStyles: Record<string, { bg: string; border: string; icon: string }> = {
    critical: {
        bg: 'rgba(220, 38, 38, 0.15)',
        border: 'rgba(220, 38, 38, 0.4)',
        icon: '🚨',
    },
    high: {
        bg: 'rgba(239, 68, 68, 0.12)',
        border: 'rgba(239, 68, 68, 0.3)',
        icon: '⚠️',
    },
    low: {
        bg: 'rgba(245, 158, 11, 0.12)',
        border: 'rgba(245, 158, 11, 0.3)',
        icon: '⚠️',
    },
    none: {
        bg: 'rgba(34, 197, 94, 0.12)',
        border: 'rgba(34, 197, 94, 0.3)',
        icon: '✅',
    },
};

export function DangerAlert({ danger }: DangerAlertProps) {
    const { t } = useLanguage();
    const style = levelStyles[danger.level] ?? levelStyles.none;

    return (
        <div
            id="danger-alert"
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 16px',
                borderRadius: '12px',
                background: style.bg,
                border: `1px solid ${style.border}`,
                animation: danger.isDangerous ? 'pulse 2s ease-in-out infinite' : 'none',
            }}
        >
            <span style={{ fontSize: '24px', flexShrink: 0 }}>{style.icon}</span>
            <p
                style={{
                    fontSize: '13px',
                    lineHeight: 1.5,
                    color: '#f1f5f9',
                    fontWeight: 500,
                }}
            >
                {t(danger.message)}
            </p>
        </div>
    );
}
