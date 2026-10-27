import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout, ArrowRight, Zap, Shield, TrendingUp,
  Leaf, Droplets, Bug, FlaskConical, ChevronRight,
  Star, BarChart3, Globe, CheckCircle
} from 'lucide-react';

const FEATURES = [
  {
    icon: Sprout,
    title: 'AI Crop Recommendations',
    description: 'Get optimal crop selections based on your soil composition, pH levels, and regional climate patterns.',
    color: 'text-primary-400',
    bg: 'bg-primary-500/10 border-primary-500/20',
  },
  {
    icon: FlaskConical,
    title: 'Nutrient Management',
    description: 'Precision NPK fertilizer schedules with application timelines to maximize yield and minimize waste.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20',
  },
  {
    icon: Bug,
    title: 'Pest & Disease Control',
    description: 'Proactive threat detection with organic and chemical mitigation strategies tailored to your crops.',
    color: 'text-red-400',
    bg: 'bg-red-500/10 border-red-500/20',
  },
  {
    icon: Droplets,
    title: 'Water Management',
    description: 'Smart irrigation schedules optimized for crop type, growth stage, and available water sources.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
  },
];

const STATS = [
  { value: '10K+', label: 'Farms Advised', icon: Leaf },
  { value: '94%', label: 'Yield Improvement', icon: TrendingUp },
  { value: '50+', label: 'Crop Varieties', icon: Sprout },
  { value: '30%', label: 'Water Saved', icon: Droplets },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Create Farm Profile', desc: 'Input your soil type, pH, climate zone, and water source.' },
  { step: '02', title: 'AI Analysis', desc: 'Gemini AI analyzes your data using agronomic science models.' },
  { step: '03', title: 'Get Action Plan', desc: 'Receive structured crop, nutrient, pest, and irrigation recommendations.' },
  { step: '04', title: 'Track Progress', desc: 'Store advisory history and compare strategies over time.' },
];

const TESTIMONIALS = [
  {
    name: 'Rajesh Kumar',
    role: 'Wheat Farmer, Punjab',
    text: 'CropAI increased my wheat yield by 35% in just one season. The fertilizer schedule was spot on.',
    rating: 5,
  },
  {
    name: 'Maria Santos',
    role: 'Organic Farmer, Brazil',
    text: 'The pest early warnings saved my tomato crop. I prevented a blight outbreak before it spread.',
    rating: 5,
  },
  {
    name: 'Aisha Okonkwo',
    role: 'Rice Farmer, Nigeria',
    text: 'Finally, agricultural advice tailored to my specific region and soil. Game-changer for small farmers.',
    rating: 5,
  },
];

function FeatureCard({ feature, index }) {
  const { icon: Icon, title, description, color, bg } = feature;
  return (
    <div
      className={`card p-6 hover:border-gray-700 hover:-translate-y-1 transition-all duration-300 animate-fade-in-up`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl border ${bg} mb-4`}>
        <Icon className={`h-6 w-6 ${color}`} />
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}

export default function LandingPage() {
  return (
    <main className="overflow-hidden">
      {/* ── Hero ── */}
      <section className="relative min-h-[92vh] flex items-center bg-grid-pattern">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-900/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-8 animate-fade-in-up">
            <Zap className="h-3.5 w-3.5" />
            Powered by Google Gemini AI
            <span className="px-2 py-0.5 rounded-full bg-primary-500/20 text-xs font-bold">NEW</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight mb-6 animate-fade-in-up delay-100">
            Farm Smarter with{' '}
            <span className="gradient-text text-glow-green">AI-Powered</span>
            <br />
            Crop Advisories
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-10 animate-fade-in-up delay-200">
            Transform your farm data into actionable intelligence. Get AI-generated crop recommendations,
            fertilizer schedules, pest warnings, and irrigation plans — all in seconds.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
            <Link
              to="/auth"
              className="btn-primary px-8 py-4 text-base shadow-xl shadow-primary-900/40 glow-green"
            >
              Start Free Today
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/auth"
              className="btn-secondary px-8 py-4 text-base"
            >
              <Globe className="h-4 w-4" />
              See How It Works
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600 animate-fade-in-up delay-400">
            {['No credit card required', 'Secure data storage', 'AI-powered insights'].map((item) => (
              <div key={item} className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-primary-500" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16 border-y border-gray-800/50 bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map(({ value, label, icon: Icon }) => (
              <div key={label} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-500/10 border border-primary-500/20 mb-3">
                  <Icon className="h-5 w-5 text-primary-400" />
                </div>
                <div className="text-3xl font-black gradient-text">{value}</div>
                <div className="text-sm text-gray-500 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-800 border border-gray-700 text-gray-400 text-sm font-medium mb-4">
              <BarChart3 className="h-3.5 w-3.5 text-primary-400" />
              Core Capabilities
            </div>
            <h2 className="text-4xl font-black text-white mb-4">
              Everything a Farmer Needs,{' '}
              <span className="gradient-text">AI-Delivered</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Four specialized analysis domains working in concert to give you the most comprehensive
              agronomic advisory available.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature, index) => (
              <FeatureCard key={feature.title} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-24 bg-gray-900/40 border-y border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4">How CropAI Works</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              From farm data to actionable plan in four simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connector line */}
            <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-primary-500/40 to-transparent" />

            {HOW_IT_WORKS.map(({ step, title, desc }, i) => (
              <div
                key={step}
                className={`relative card p-6 text-center animate-fade-in-up`}
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500/30 to-emerald-600/20 border border-primary-500/30 mb-4 mx-auto animate-pulse-glow">
                  <span className="text-xl font-black gradient-text">{step}</span>
                </div>
                <h3 className="font-bold text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4">
              Trusted by Farmers <span className="gradient-text">Worldwide</span>
            </h2>
            <p className="text-gray-400">Real results from real farmers using CropAI.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, role, text, rating }, i) => (
              <div
                key={name}
                className={`card p-6 animate-fade-in-up`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex mb-3">
                  {Array.from({ length: rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-4 italic">"{text}"</p>
                <div className="flex items-center gap-3 pt-3 border-t border-gray-800">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-emerald-600 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                    {name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{name}</p>
                    <p className="text-xs text-gray-500">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card-glass p-12 text-center relative overflow-hidden">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary-500/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl" />
            <div className="relative">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-emerald-600 mb-6 animate-float shadow-xl shadow-primary-900/50">
                <Sprout className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                Ready to Transform Your Farm?
              </h2>
              <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                Join thousands of farmers already using CropAI to make smarter, science-backed agricultural decisions.
              </p>
              <Link
                to="/auth"
                className="btn-primary px-10 py-4 text-base shadow-xl shadow-primary-900/40 glow-green"
              >
                Start Growing Smarter
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-800/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-emerald-600">
                <Sprout className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-gray-400">
                Crop<span className="text-primary-400">AI</span>
              </span>
            </div>
            <p className="text-xs text-gray-600">
              © {new Date().getFullYear()} CropAI. All rights reserved. Powered by Google Gemini.
            </p>
            <div className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-gray-600" />
              <span className="text-xs text-gray-600">Enterprise-grade security</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
