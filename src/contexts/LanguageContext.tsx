// ─────────────────────────────────────────────────
// Htech · LanguageContext
// Arabic / English with RTL / LTR switching
// ─────────────────────────────────────────────────

import {
    createContext,
    useState,
    useEffect,
    useCallback,
    useMemo,
    type ReactNode,
} from 'react';

import type { Language, Direction } from '../types/common';
import { getItem, setItem, STORAGE_KEYS } from '../utils/storage';

import arTranslations from '../locales/ar.json';
import enTranslations from '../locales/en.json';

// ── Translation dictionaries ────────────────────

type TranslationKey = keyof typeof enTranslations;
type Translations = Record<TranslationKey, string>;

const dictionaries: Record<Language, Translations> = {
    ar: arTranslations as Translations,
    en: enTranslations as Translations,
};

// ── Direction map ───────────────────────────────

const directionMap: Record<Language, Direction> = {
    ar: 'rtl',
    en: 'ltr',
};

// ── Context value shape ─────────────────────────

export interface LanguageContextValue {
    /** Current language code */
    readonly language: Language;
    /** Current text direction */
    readonly dir: Direction;
    /** Is the current language RTL? */
    readonly isRTL: boolean;

    /**
     * Translate a key to the current language.
     * Returns the key itself as fallback if no translation exists.
     */
    t: (key: string) => string;

    /** Toggle between Arabic and English */
    toggleLanguage: () => void;

    /** Set a specific language */
    setLanguage: (lang: Language) => void;
}

// ── Create Context ──────────────────────────────

export const LanguageContext = createContext<LanguageContextValue | null>(null);

// ── Default language ────────────────────────────

const DEFAULT_LANGUAGE: Language = 'ar';

// ── Provider ────────────────────────────────────

interface LanguageProviderProps {
    readonly children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
    const [language, setLanguageState] = useState<Language>(() => {
        const stored = getItem<Language>(STORAGE_KEYS.LANGUAGE);
        return stored ?? DEFAULT_LANGUAGE;
    });

    const dir = directionMap[language];
    const isRTL = dir === 'rtl';

    // ── Sync <html> attributes on every change ──
    useEffect(() => {
        const html = document.documentElement;
        html.setAttribute('dir', dir);
        html.setAttribute('lang', language);
    }, [language, dir]);

    // ── Persist to localStorage ─────────────────
    useEffect(() => {
        setItem(STORAGE_KEYS.LANGUAGE, language);
    }, [language]);

    // ── Translation function ────────────────────
    const t = useCallback(
        (key: string): string => {
            const dict = dictionaries[language];
            return (dict as Record<string, string>)[key] ?? key;
        },
        [language],
    );

    // ── Language setters ────────────────────────
    const setLanguage = useCallback((lang: Language) => {
        setLanguageState(lang);
    }, []);

    const toggleLanguage = useCallback(() => {
        setLanguageState((prev) => (prev === 'ar' ? 'en' : 'ar'));
    }, []);

    // ── Memoised value ─────────────────────────
    const contextValue = useMemo<LanguageContextValue>(
        () => ({
            language,
            dir,
            isRTL,
            t,
            toggleLanguage,
            setLanguage,
        }),
        [language, dir, isRTL, t, toggleLanguage, setLanguage],
    );

    return (
        <LanguageContext.Provider value={contextValue}>
            {children}
        </LanguageContext.Provider>
    );
}
