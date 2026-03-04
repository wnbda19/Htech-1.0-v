// ─────────────────────────────────────────────────
// Htech · Button Component
// Variants: primary, secondary, danger, ghost
// ─────────────────────────────────────────────────

import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    readonly variant?: ButtonVariant;
    readonly size?: ButtonSize;
    readonly fullWidth?: boolean;
    readonly children: ReactNode;
    readonly isLoading?: boolean;
}

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
    primary: {
        background: 'linear-gradient(135deg, #00d4aa, #00b894)',
        color: '#0a0f1c',
        fontWeight: 700,
        boxShadow: '0 4px 16px rgba(0, 212, 170, 0.3)',
    },
    secondary: {
        background: 'rgba(99, 102, 241, 0.15)',
        color: '#a5b4fc',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        fontWeight: 600,
    },
    danger: {
        background: 'rgba(239, 68, 68, 0.15)',
        color: '#fca5a5',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        fontWeight: 600,
    },
    ghost: {
        background: 'transparent',
        color: '#94a3b8',
        fontWeight: 500,
    },
};

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
    sm: { padding: '8px 16px', fontSize: '13px', borderRadius: '8px' },
    md: { padding: '12px 24px', fontSize: '15px', borderRadius: '12px' },
    lg: { padding: '16px 32px', fontSize: '16px', borderRadius: '14px' },
};

export function Button({
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    isLoading = false,
    children,
    style,
    disabled,
    ...rest
}: ButtonProps) {
    return (
        <button
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
                opacity: disabled || isLoading ? 0.5 : 1,
                transition: 'all 0.2s ease',
                width: fullWidth ? '100%' : 'auto',
                border: 'none',
                letterSpacing: '0.02em',
                ...variantStyles[variant],
                ...sizeStyles[size],
                ...style,
            }}
            disabled={disabled || isLoading}
            {...rest}
        >
            {isLoading && (
                <span
                    style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid currentColor',
                        borderTopColor: 'transparent',
                        borderRadius: '50%',
                        animation: 'spin 0.6s linear infinite',
                    }}
                />
            )}
            {children}
        </button>
    );
}
