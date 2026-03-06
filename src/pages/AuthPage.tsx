import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Button, Card } from '../components';
import { useLanguage } from '../hooks/useLanguage';

export function AuthPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [isSigningUp, setIsSigningUp] = useState(false);

    const { t, toggleLanguage, language, isRTL } = useLanguage();

    const handleAuth = async (ev: React.FormEvent) => {
        ev.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMsg(null);

        const emailLower = email.trim().toLowerCase();

        try {
            if (isSigningUp) {
                if (password !== confirmPassword) {
                    throw new Error(
                        language === 'ar'
                            ? 'كلمتا المرور غير متطابقتين'
                            : 'Passwords do not match',
                    );
                }
                if (password.length < 6) {
                    throw new Error(
                        language === 'ar'
                            ? 'يجب أن تكون كلمة المرور 6 أحرف على الأقل'
                            : 'Password must be at least 6 characters',
                    );
                }

                const { error: signUpError } = await supabase.auth.signUp({
                    email: emailLower,
                    password,
                });
                if (signUpError) throw signUpError;

                setSuccessMsg(
                    language === 'ar'
                        ? 'تم إنشاء الحساب! يمكنك الآن تسجيل الدخول.'
                        : 'Account created! You can now sign in.',
                );
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setIsSigningUp(false);
            } else {
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email: emailLower,
                    password,
                });
                if (signInError) throw signInError;

                setSuccessMsg(
                    language === 'ar' ? 'تم تسجيل الدخول بنجاح!' : 'Successfully signed in!',
                );
            }
        } catch (err: any) {
            setError(
                err.message ||
                (language === 'ar'
                    ? 'حدث خطأ أثناء المصادقة.'
                    : 'An error occurred during authentication.'),
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="flex flex-col items-center justify-center min-h-screen bg-htech-bg p-4"
            dir={isRTL ? 'rtl' : 'ltr'}
        >
            {/* Language toggle — top corner */}
            <div className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'}`}>
                <button
                    type="button"
                    onClick={toggleLanguage}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-htech-surface border border-htech-border text-htech-text-muted hover:text-htech-primary hover:border-htech-primary transition-all duration-200 text-sm font-medium"
                    title={language === 'ar' ? 'Switch to English' : 'التبديل للعربية'}
                >
                    <span className="text-base">{language === 'ar' ? '🇺🇸' : '🇸🇦'}</span>
                    <span>{t('switch_language')}</span>
                </button>
            </div>

            <div className="w-full max-w-md">
                <Card>
                    <div className="p-6">
                        <h1 className="text-2xl font-bold text-htech-text text-center mb-6">
                            {t('welcome')} {t('app_name')}
                        </h1>

                        {/* Sign In / Sign Up tabs */}
                        <div className="flex gap-2 mb-6">
                            <Button
                                type="button"
                                variant={!isSigningUp ? 'primary' : 'secondary'}
                                className="flex-1"
                                onClick={() => setIsSigningUp(false)}
                            >
                                {t('login')}
                            </Button>
                            <Button
                                type="button"
                                variant={isSigningUp ? 'primary' : 'secondary'}
                                className="flex-1"
                                onClick={() => setIsSigningUp(true)}
                            >
                                {t('register')}
                            </Button>
                        </div>

                        <form onSubmit={handleAuth} className="space-y-4">
                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-htech-text-muted mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-htech-surface border border-htech-border rounded-lg px-4 py-2 text-htech-text focus:outline-none focus:ring-2 focus:ring-htech-primary"
                                    placeholder="you@example.com"
                                    dir="ltr"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-htech-text-muted mb-1">
                                    {language === 'ar' ? 'كلمة المرور' : 'Password'}
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-htech-surface border border-htech-border rounded-lg px-4 py-2 text-htech-text focus:outline-none focus:ring-2 focus:ring-htech-primary"
                                    placeholder={
                                        language === 'ar'
                                            ? 'أدخل كلمة مرور آمنة'
                                            : 'Enter a secure password'
                                    }
                                    dir="ltr"
                                />
                            </div>

                            {/* Confirm Password (sign-up only) */}
                            {isSigningUp && (
                                <div>
                                    <label className="block text-sm font-medium text-htech-text-muted mb-1">
                                        {language === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full bg-htech-surface border border-htech-border rounded-lg px-4 py-2 text-htech-text focus:outline-none focus:ring-2 focus:ring-htech-primary"
                                        placeholder={
                                            language === 'ar'
                                                ? 'أعد إدخال كلمة المرور'
                                                : 'Confirm your password'
                                        }
                                        dir="ltr"
                                    />
                                </div>
                            )}

                            {/* Error message */}
                            {error && (
                                <div className="p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200 text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Success message */}
                            {successMsg && (
                                <div className="p-3 bg-green-900/50 border border-green-500 rounded-lg text-green-200 text-sm">
                                    {successMsg}
                                </div>
                            )}

                            {/* Submit */}
                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full"
                                disabled={loading}
                            >
                                {loading
                                    ? language === 'ar'
                                        ? 'جارٍ المعالجة...'
                                        : 'Processing...'
                                    : isSigningUp
                                        ? language === 'ar'
                                            ? 'إنشاء حساب'
                                            : 'Create Account'
                                        : t('login')}
                            </Button>
                        </form>
                    </div>
                </Card>
            </div>
        </div>
    );
}
