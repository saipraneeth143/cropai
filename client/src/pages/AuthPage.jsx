import React from 'react';
import AuthForm from '../components/AuthForm';
import { Sprout, Leaf, Droplets, Bug, FlaskConical } from 'lucide-react';

const FEATURES = [
  { icon: Leaf, text: 'AI-powered crop selection' },
  { icon: FlaskConical, text: 'Precision nutrient plans' },
  { icon: Bug, text: 'Proactive pest warnings' },
  { icon: Droplets, text: 'Smart irrigation schedules' },
];

export default function AuthPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-stretch">
      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-center w-1/2 bg-gradient-to-br from-gray-900 to-gray-950 border-r border-gray-800 p-16 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-grid-pattern opacity-50" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-emerald-500/5 rounded-full blur-3xl" />

        <div className="relative">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-emerald-600 shadow-xl shadow-primary-900/50 animate-pulse-glow">
              <Sprout className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-black">
              <span className="text-white">Crop</span>
              <span className="gradient-text">AI</span>
            </span>
          </div>

          <h2 className="text-4xl font-black text-white leading-tight mb-4">
            Your AI-Powered
            <br />
            <span className="gradient-text">Agronomist</span>
          </h2>
          <p className="text-gray-400 leading-relaxed mb-10 text-lg">
            Science-backed crop advisories tailored to your unique farm profile, soil, and climate conditions.
          </p>

          {/* Feature list */}
          <div className="space-y-4">
            {FEATURES.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-500/20 border border-primary-500/20 flex-shrink-0">
                  <Icon className="h-4 w-4 text-primary-400" />
                </div>
                <span className="text-gray-300 text-sm">{text}</span>
              </div>
            ))}
          </div>

          {/* Bottom badge */}
          <div className="mt-12 px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 inline-flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
            <span className="text-xs text-gray-400">Powered by Google Gemini 2.5 Flash</span>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-emerald-600">
              <Sprout className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-black">
              <span className="text-white">Crop</span>
              <span className="gradient-text">AI</span>
            </span>
          </div>
          <AuthForm />
        </div>
      </div>
    </div>
  );
}
