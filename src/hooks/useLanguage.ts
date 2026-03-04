// ─────────────────────────────────────────────────
// Htech · useLanguage Hook
// Safe accessor for LanguageContext
// ─────────────────────────────────────────────────

import { useContext } from 'react';
import { LanguageContext, type LanguageContextValue } from '../contexts/LanguageContext';

/**
 * Access the LanguageContext from any component inside
 * `<LanguageProvider>`.
 *
 * @throws if called outside of the provider tree.
 */
export function useLanguage(): LanguageContextValue {
    const ctx = useContext(LanguageContext);
    if (ctx === null) {
        throw new Error(
            '[Htech] useLanguage() must be used inside <LanguageProvider>.',
        );
    }
    return ctx;
}
