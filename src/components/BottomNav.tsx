// ─────────────────────────────────────────────────
// Htech · BottomNav Component
// Mobile bottom navigation — RTL/LTR safe
// ─────────────────────────────────────────────────

import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks';

interface NavItem {
    readonly path: string;
    readonly labelKey: string;
    readonly icon: string;
}

const NAV_ITEMS: readonly NavItem[] = [
    { path: '/', labelKey: 'home', icon: '🏠' },
    { path: '/log', labelKey: 'log_reading', icon: '📊' },
    { path: '/ask', labelKey: 'ask_doctor', icon: '🩺' },
    { path: '/caregiver', labelKey: 'caregiver', icon: '👥' },
];

export function BottomNav() {
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useLanguage();

    return (
        <nav
            id="bottom-nav"
            style={{
                position: 'fixed',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '100%',
                maxWidth: '430px',
                height: 'var(--nav-height)',
                background: 'rgba(10, 15, 28, 0.92)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
                padding: '0 8px',
                zIndex: 1000,
            }}
        >
            {NAV_ITEMS.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                    <button
                        key={item.path}
                        id={`nav-${item.labelKey}`}
                        onClick={() => navigate(item.path)}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '8px 12px',
                            borderRadius: '12px',
                            transition: 'all 0.2s ease',
                            background: isActive
                                ? 'rgba(0, 212, 170, 0.1)'
                                : 'transparent',
                            minWidth: '64px',
                        }}
                    >
                        <span
                            style={{
                                fontSize: '22px',
                                filter: isActive ? 'none' : 'grayscale(0.5)',
                                transition: 'all 0.2s ease',
                                transform: isActive ? 'scale(1.15)' : 'scale(1)',
                            }}
                        >
                            {item.icon}
                        </span>
                        <span
                            style={{
                                fontSize: '11px',
                                fontWeight: isActive ? 700 : 400,
                                color: isActive ? '#00d4aa' : '#64748b',
                                transition: 'color 0.2s ease',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {t(item.labelKey)}
                        </span>
                    </button>
                );
            })}
        </nav>
    );
}
