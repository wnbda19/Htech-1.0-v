// ─────────────────────────────────────────────────
// Htech · useDiabetes Hook
// Safe accessor for ReadingsContext
// ─────────────────────────────────────────────────

import { useContext } from 'react';
import { ReadingsContext, type ReadingsContextValue } from '../contexts/ReadingsContext';

/**
 * Access the ReadingsContext from any component inside
 * `<ReadingsProvider>`.
 *
 * @throws if called outside of the provider tree.
 */
export function useDiabetes(): ReadingsContextValue {
    const ctx = useContext(ReadingsContext);
    if (ctx === null) {
        throw new Error(
            '[Htech] useDiabetes() must be used inside <ReadingsProvider>.',
        );
    }
    return ctx;
}
