import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Button, Card } from '../components';

export function AuthPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const handleAuth = async (ev: React.FormEvent) => {
        ev.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMsg(null);

        const emailLower = email.trim().toLowerCase();

        try {
            // Try sign in
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: emailLower,
                password,
            });

            if (signInError) {
                // If sign in failed because user doesn't exist, try sign up
                const { error: signUpError } = await supabase.auth.signUp({
                    email: emailLower,
                    password,
                });
                if (signUpError) throw signUpError;

                // After successful sign up, sign in once more
                const { error: signInError2 } = await supabase.auth.signInWithPassword({
                    email: emailLower,
                    password,
                });
                if (signInError2) throw signInError2;
            }

            setSuccessMsg('Successfully signed in!');

        } catch (err: any) {
            setError(err.message || 'An error occurred during authentication.');
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-htech-bg p-4">
            <div className="w-full max-w-md">
                <Card>
                    <div className="p-6">
                        <h1 className="text-2xl font-bold text-htech-text text-center mb-6">
                            Welcome to Htech
                        </h1>

                        <form onSubmit={handleAuth} className="space-y-4">
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
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-htech-text-muted mb-1">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-htech-surface border border-htech-border rounded-lg px-4 py-2 text-htech-text focus:outline-none focus:ring-2 focus:ring-htech-primary"
                                    placeholder="Enter a secure password"
                                />
                            </div>

                            {error && (
                                <div className="p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200 text-sm">
                                    {error}
                                </div>
                            )}

                            {successMsg && (
                                <div className="p-3 bg-green-900/50 border border-green-500 rounded-lg text-green-200 text-sm">
                                    {successMsg}
                                </div>
                            )}

                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full"
                                disabled={loading}
                            >
                                {loading ? 'Processing...' : 'Enter App'}
                            </Button>
                        </form>
                    </div>
                </Card>
            </div>
        </div>
    );
}
