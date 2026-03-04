// ─────────────────────────────────────────────────
// Htech · App — Root Layout + Routing
// ─────────────────────────────────────────────────

import { Routes, Route } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { BottomNav } from './components/BottomNav';
import { HomePage } from './pages/HomePage';
import { LogReadingPage } from './pages/LogReadingPage';
import { AskDoctorPage } from './pages/AskDoctorPage';
import { CaregiverPage } from './pages/CaregiverPage';
import { AuthPage } from './pages/AuthPage';

export default function App() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-htech-bg flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-4 border-htech-primary border-t-transparent animate-spin"></div>
            </div>
        );
    }

    if (!user) {
        return <AuthPage />;
    }

    return (
        <>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/log" element={<LogReadingPage />} />
                <Route path="/ask" element={<AskDoctorPage />} />
                <Route path="/caregiver" element={<CaregiverPage />} />
            </Routes>
            <BottomNav />
        </>
    );
}
