import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sprout, CheckCircle2, AlertCircle } from 'lucide-react';
import useAuth from '../lib/useAuth';

export default function AuthForm() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const isRegister = mode === 'register';

  const validate = () => {
    if (!email.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email address';
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    if (isRegister && password !== confirmPassword) return 'Passwords do not match';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      if (isRegister) {
        await signUp(email, password);
        setSuccessMessage('Account created! Check your email for a verification link.');
      } else {
        await signIn(email, password);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMode = () => {
    setMode(isRegister ? 'login' : 'register');
    setError('');
    setSuccessMessage('');
    setConfirmPassword('');
  };

  return (
    <div className="w-full max-w-md mx-auto animate-scale-in">
      {/* Card */}
      <div className="card-glass overflow-hidden">
        {/* Header */}
        <div className="relative px-8 py-8 text-center overflow-hidden bg-gradient-to-br from-primary-900/50 to-emerald-900/30 border-b border-white/10">
          {/* Decorative circles */}
          <div className="absolute -top-8 -left-8 h-32 w-32 rounded-full bg-primary-500/10 blur-2xl" />
          <div className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl" />

          <div className="relative">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-emerald-600 mb-4 shadow-xl shadow-primary-900/50 animate-pulse-glow">
              <Sprout className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              {isRegister ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-gray-400 mt-1 text-sm">
              {isRegister
                ? 'Join CropAI and get AI-powered farming insights'
                : 'Sign in to access your farm dashboard'}
            </p>
          </div>
        </div>

        {/* Form body */}
        <div className="px-8 py-8">
          {/* Error alert */}
          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-start gap-2.5 animate-fade-in-up">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Success alert */}
          {successMessage && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-primary-500/10 border border-primary-500/30 text-primary-400 text-sm flex items-start gap-2.5 animate-fade-in-up">
              <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="auth-email" className="input-label">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                <input
                  id="auth-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="farmer@example.com"
                  className="input-field pl-10"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="auth-password" className="input-label">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                <input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pl-10 pr-11"
                  autoComplete={isRegister ? 'new-password' : 'current-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            {isRegister && (
              <div className="animate-fade-in-up">
                <label htmlFor="auth-confirm-password" className="input-label">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                  <input
                    id="auth-confirm-password"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-field pl-10"
                    autoComplete="new-password"
                  />
                </div>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full py-3 mt-2"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  {isRegister ? 'Creating Account...' : 'Signing In...'}
                </>
              ) : (
                <>
                  {isRegister ? 'Create Account' : 'Sign In'}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle mode */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={toggleMode}
                className="font-semibold text-primary-400 hover:text-primary-300 transition-colors"
              >
                {isRegister ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
