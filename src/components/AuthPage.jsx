import { useState, useEffect } from 'react';
import { Car, Mail, Lock, Loader2, AlertCircle, Eye, EyeOff, Sparkles, ArrowLeft, KeyRound } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function AuthPage({ onAuth, onNavigate }) {
  const [mode, setMode] = useState(() => onAuth.isRecovery ? 'recovery' : 'signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'forgot') {
        const { error: resetError } = await onAuth.resetPassword(email);
        if (resetError) {
          setError(resetError.message || 'Failed to send reset email.');
          return;
        }
        setSent(true);
        return;
      }

      if (mode === 'recovery') {
        const { error: updateError } = await onAuth.updatePassword(password);
        if (updateError) {
          setError(updateError.message || 'Failed to update password.');
          return;
        }
        // Sign out of the temporary recovery session before showing sign-in form
        await onAuth.signOut();
        onAuth.clearRecovery();
        setMode('signin');
        setEmail('');
        setPassword('');
        setError('Password updated! Sign in with your new password.');
        return;
      }

      const { data, error: authError } = mode === 'signin'
        ? await onAuth.signIn(email, password)
        : await onAuth.signUp(email, password);

      if (authError) {
        if (authError.message?.includes('already registered')) {
          setError('An account with this email already exists. Try signing in.');
        } else if (authError.message?.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please try again.');
        } else {
          setError(authError.message || 'Authentication failed. Please try again.');
        }
        return;
      }

      if (mode === 'signup' && data?.user?.identities?.length === 0) {
        setError('An account with this email already exists.');
        return;
      }

      if (mode === 'signup') {
        if (data?.session) {
          onNavigate('dashboard');
          return;
        }
        setError('Check your email for a confirmation link!');
        setMode('signin');
        return;
      }

      // Sign-in success
      if (mode === 'signin' && data?.session) {
        onNavigate('dashboard');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await onAuth.signInWithGoogle();
    } catch (err) {
      setError('Failed to sign in with Google.');
      setLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await onAuth.signInWithApple();
    } catch (err) {
      setError('Failed to sign in with Apple.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Car className="w-5.5 h-5.5 text-white" />
          </div>
          <span className="font-bold text-2xl tracking-tight">
            <span className="text-white">MTX</span>
            <span className="text-blue-400">tr</span>
            <span className="text-cyan-400">kr</span>
          </span>
        </div>

        {/* Auth Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
          {mode === 'forgot' ? (
            <>
              <div className="flex items-center gap-3 mb-1">
                <button
                  onClick={() => { setMode('signin'); setError(''); setSent(false); }}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-400"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <h2 className="text-xl font-bold text-white">Reset Password</h2>
              </div>
              <p className="text-sm text-slate-400 mb-6">
                Enter your email and we'll send you a reset link.
              </p>

              {sent ? (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                  <Mail className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <p className="text-sm text-emerald-300 font-medium mb-1">Check your email</p>
                  <p className="text-xs text-slate-400">
                    We sent a password reset link to <span className="text-white">{email}</span>
                  </p>
                  <button
                    onClick={() => { setSent(false); setMode('signin'); }}
                    className="mt-4 text-xs text-blue-400 hover:text-blue-300"
                  >
                    Back to Sign In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5 font-medium">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Send Reset Link'
                    )}
                  </button>
                </form>
              )}

              {error && !sent && (
                <div className="mt-4 p-3 px-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-2 text-xs text-red-300">
                  <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </>
          ) : mode === 'recovery' ? (
            <>
              <h2 className="text-xl font-bold text-white mb-1">Set New Password</h2>
              <p className="text-sm text-slate-400 mb-6">
                Choose a new password for your account.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-medium">New Password</label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                      minLength={6}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Update Password'
                  )}
                </button>
              </form>

              {error && (
                <div className={`mt-4 p-3 px-4 rounded-xl border flex items-start gap-2 text-xs ${
                  error.includes('successfully')
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                    : 'bg-red-500/10 border-red-500/20 text-red-300'
                }`}>
                  <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold text-white mb-1">
                {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-sm text-slate-400 mb-6">
                {mode === 'signin' ? 'Sign in to manage your vehicles' : 'Join 12,000+ drivers who never worry about their next oil change.'}
              </p>

              {error && (
                <div className={`p-3 px-4 rounded-xl border flex items-start gap-2 text-xs mb-4 ${
                  error.includes('successfully')
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                    : 'bg-red-500/10 border-red-500/20 text-red-300'
                }`}>
                  <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-medium">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-medium">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder={mode === 'signup' ? 'At least 6 characters' : 'Your password'}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                      minLength={6}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {/* Forgot Password Link — only on sign-in mode */}
                  {mode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => { setMode('forgot'); setError(''); setSent(false); }}
                      className="mt-1.5 text-xs text-blue-400 hover:text-blue-300 float-right"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : mode === 'signin' ? 'Sign In' : 'Create Account'}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-800" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-slate-900 px-3 text-slate-500">or continue with</span>
                </div>
              </div>

              {/* Google Sign In */}
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-2.5 rounded-xl border border-slate-700 text-slate-300 text-sm font-medium hover:bg-slate-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>

              {/* Apple Sign In */}
              <button
                onClick={handleAppleSignIn}
                disabled={loading}
                className="w-full py-2.5 rounded-xl border border-slate-700 text-slate-300 text-sm font-medium hover:bg-slate-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.49-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.3.74 3.09.8 1.12-.2 2.2-.85 3.38-.78 1.4.07 2.46.67 3.15 1.64-2.83 1.7-2.12 5.84.38 6.96-.37 1.25-.86 2.48-1.55 3.56-.3.47-.64.93-1.45.78l.02.01Z"/>
                  <path d="M12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.22-1.64 4.14-3.74 4.25Z"/>
                </svg>
                Sign in with Apple
              </button>

              {/* Toggle mode */}
              <p className="mt-5 text-center text-xs text-slate-500">
                {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}{' '}
                <button
                  onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); }}
                  className="text-blue-400 hover:text-blue-300 font-medium"
                >
                  {mode === 'signin' ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </>
          )}
        </div>

        {/* Premium Teaser */}
        <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-blue-600/5 to-cyan-600/5 border border-blue-500/20 text-center">
          <p className="text-[10px] text-slate-500">
            <Sparkles className="w-3 h-3 inline-block mr-1 text-blue-400" />
            Premium users get unlimited vehicles & AI-powered insights.
            <button onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'premium' }))} className="text-blue-400 hover:text-blue-300 ml-1">Learn more →</button>
          </p>
        </div>
      </div>
    </div>
  );
}