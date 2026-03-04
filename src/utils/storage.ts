// ─────────────────────────────────────────────────
// Htech · LocalStorage Wrapper
// Type-safe, JSON-serialised persistence layer
// ─────────────────────────────────────────────────

const STORAGE_PREFIX = 'htech_' as const;

/**
 * Build a prefixed key so Htech data can't collide
 * with other apps sharing the same origin.
 */
function prefixed(key: string): string {
    return `${STORAGE_PREFIX}${key}`;
}

/**
 * Persist a value to localStorage.
 * The value is JSON-serialised before writing.
 */
export function setItem<T>(key: string, value: T): void {
    try {
        const serialised = JSON.stringify(value);
        window.localStorage.setItem(prefixed(key), serialised);
    } catch {
        // Quota exceeded or serialisation error — fail silently.
        // In production this would push to an error-reporting service.
        console.error(`[Htech Storage] Failed to write key "${key}"`);
    }
}

/**
 * Read a value from localStorage.
 * Returns `null` if the key doesn't exist or parsing fails.
 */
export function getItem<T>(key: string): T | null {
    try {
        const raw = window.localStorage.getItem(prefixed(key));
        if (raw === null) return null;
        return JSON.parse(raw) as T;
    } catch {
        console.error(`[Htech Storage] Failed to read key "${key}"`);
        return null;
    }
}

/**
 * Remove a single key from localStorage.
 */
export function removeItem(key: string): void {
    window.localStorage.removeItem(prefixed(key));
}

/**
 * Remove ALL Htech-prefixed keys from localStorage.
 */
export function clearAll(): void {
    const keysToRemove: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
        const k = window.localStorage.key(i);
        if (k?.startsWith(STORAGE_PREFIX)) {
            keysToRemove.push(k);
        }
    }
    keysToRemove.forEach((k) => window.localStorage.removeItem(k));
}

// ── Storage Keys (constants so they're never misspelt) ──

export const STORAGE_KEYS = {
    LANGUAGE: 'language',
    DIABETES_TYPE: 'diabetes_type',
    GLUCOSE_READINGS: 'glucose_readings',
    AUTH_TOKEN: 'auth_token',
    THEME: 'theme',
} as const;
