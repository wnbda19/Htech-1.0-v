// ─────────────────────────────────────────────────
// Htech · Shared Common Types
// ─────────────────────────────────────────────────

/** Supported UI languages */
export type Language = 'ar' | 'en';

/** Text direction */
export type Direction = 'rtl' | 'ltr';

/** Generic async-operation state */
export interface AsyncState {
    readonly isLoading: boolean;
    readonly error: string | null;
}
