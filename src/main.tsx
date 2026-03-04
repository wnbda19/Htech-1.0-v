// ─────────────────────────────────────────────────
// Htech · Application Entry Point
// Providers: Language → Readings → Router → App
// ─────────────────────────────────────────────────

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { ReadingsProvider } from './contexts/ReadingsContext';
import { AuthProvider } from './contexts/AuthContext';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AuthProvider>
            <LanguageProvider>
                <ReadingsProvider>
                    <BrowserRouter>
                        <App />
                    </BrowserRouter>
                </ReadingsProvider>
            </LanguageProvider>
        </AuthProvider>
    </StrictMode>,
);
