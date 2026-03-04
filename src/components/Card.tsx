// ─────────────────────────────────────────────────
// Htech · Card Component
// Glassmorphism card with optional glow
// ─────────────────────────────────────────────────

import type { CSSProperties, ReactNode } from 'react';

interface CardProps {
    readonly children: ReactNode;
    readonly style?: CSSProperties;
    readonly glow?: boolean;
    readonly onClick?: () => void;
    readonly className?: string;
}

export function Card({ children, style, glow = false, onClick, className }: CardProps) {
    return (
        <div
            className={className}
            onClick={onClick}
            style={{
                background: 'rgba(26, 34, 54, 0.7)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '16px',
                padding: '20px',
                transition: 'all 0.25s ease',
                cursor: onClick ? 'pointer' : 'default',
                boxShadow: glow
                    ? '0 0 20px rgba(0, 212, 170, 0.15), 0 4px 16px rgba(0, 0, 0, 0.4)'
                    : '0 4px 16px rgba(0, 0, 0, 0.4)',
                ...style,
            }}
        >
            {children}
        </div>
    );
}
