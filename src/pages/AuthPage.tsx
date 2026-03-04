import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Button, Card } from '../components';

export function AuthPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [isSigningUp, setIsSigningUp] = useState(false);

    const handleAuth = async (ev: React.FormEvent) => {
        ev.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMsg(null);

        const emailLower = email.trim().toLowerCase();

        try {
            if (isSigningUp) {
                // Validate password confirmation
                if (password !== confirmPassword) {
                    throw new Error('Passwords do not match');
                }
                if (password.length < 6) {
                    throw new Error('Password must be at least 6 characters');
                }

                // Sign up mode
                const { error: signUpError } = await supabase.auth.signUp({
                    email: emailLower,
                    password,
                });
                if (signUpError) throw signUpError;
                setSuccessMsg('Account created! You can now sign in.');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setIsSigningUp(false);
            } else {
                // Sign in mode
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email: emailLower,
                    password,
                });
                if (signInError) throw signInError;
                setSuccessMsg('Successfully signed in!');
            }
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

                        <div className="flex gap-2 mb-6">
                            <Button
                                type="button"
                                variant={!isSigningUp ? 'primary' : 'secondary'}
                                className="flex-1"
                                onClick={() => setIsSigningUp(false)}
                            >
                                Sign In
                            </Button>
                            <Button
                                type="button"
                                variant={isSigningUp ? 'primary' : 'secondary'}
                                className="flex-1"
                                onClick={() => setIsSigningUp(true)}
                            >
                                Sign Up
                            </Button>
                        </div>

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

                            {isSigningUp && (
                                <div>
                                    <label className="block text-sm font-medium text-htech-text-muted mb-1">
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full bg-htech-surface border border-htech-border rounded-lg px-4 py-2 text-htech-text focus:outline-none focus:ring-2 focus:ring-htech-primary"
                                        placeholder="Confirm your password"
                                    />
                                </div>
                            )}

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
                                {loading ? 'Processing...' : (isSigningUp ? 'Create Account' : 'Sign In')}
                            </Button>
                        </form>
                    </div>
                </Card>
            </div>
        </div>
    );
}
