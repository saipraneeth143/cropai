import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sprout, Menu, X, LogOut, LayoutDashboard, PlusCircle, ChevronDown } from 'lucide-react';
import useAuth from '../lib/useAuth';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive(path)
        ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
        : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
    }`;

  const handleSignOut = async () => {
    await signOut();
    setMobileOpen(false);
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-gray-950/95 backdrop-blur-md border-b border-gray-800 shadow-lg shadow-black/30'
          : 'bg-gray-950/80 backdrop-blur-sm border-b border-gray-800/50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-emerald-600 text-white shadow-lg shadow-primary-900/50 group-hover:shadow-primary-700/50 transition-all duration-300 animate-pulse-glow">
              <Sprout className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold">
              <span className="text-white">Crop</span>
              <span className="gradient-text">AI</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {user ? (
              <>
                <Link to="/dashboard" className={linkClass('/dashboard')}>
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                <Link to="/farms/new" className={linkClass('/farms/new')}>
                  <PlusCircle className="h-4 w-4" />
                  Add Farm
                </Link>
                <div className="ml-3 h-6 w-px bg-gray-700" />
                <div className="ml-2 flex items-center gap-2">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800/60 border border-gray-700">
                    <div className="h-6 w-6 rounded-full bg-gradient-to-br from-primary-500 to-emerald-600 flex items-center justify-center text-xs font-bold text-white">
                      {user.email?.[0]?.toUpperCase() ?? 'U'}
                    </div>
                    <span className="text-sm text-gray-300 max-w-[120px] truncate">
                      {user.email?.split('@')[0]}
                    </span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-200"
                    title="Sign out"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="sr-only sm:not-sr-only">Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/auth"
                className="btn-primary text-sm px-5 py-2"
              >
                Get Started
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200 border border-transparent hover:border-gray-700"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-800 bg-gray-950/98 backdrop-blur-md">
          <div className="px-4 py-3 space-y-1">
            {user ? (
              <>
                <div className="flex items-center gap-3 px-3 py-3 mb-2 rounded-xl bg-gray-800/50 border border-gray-700">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-500 to-emerald-600 flex items-center justify-center text-sm font-bold text-white">
                    {user.email?.[0]?.toUpperCase() ?? 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{user.email?.split('@')[0]}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive('/dashboard') ? 'bg-primary-500/20 text-primary-400' : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                <Link
                  to="/farms/new"
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive('/farms/new') ? 'bg-primary-500/20 text-primary-400' : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <PlusCircle className="h-4 w-4" />
                  Add Farm
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="block btn-primary w-full text-center"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
