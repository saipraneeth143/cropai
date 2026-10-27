import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, ArrowLeft, Sprout } from 'lucide-react';
import AddFarmForm from '../components/AddFarmForm';

export default function NewFarmPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back nav */}
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-400 transition-colors mb-6 group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to Dashboard
      </Link>

      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500/30 to-emerald-600/20 border border-primary-500/30 animate-pulse-glow">
            <PlusCircle className="h-5 w-5 text-primary-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">New Farm Profile</h1>
            <p className="text-sm text-gray-500">Step 1 of 2 — Configure your farm parameters</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-gray-800 rounded-full mt-4">
          <div className="h-full w-1/2 bg-gradient-to-r from-primary-500 to-emerald-500 rounded-full transition-all duration-500" />
        </div>
      </div>

      {/* Info banner */}
      <div className="mb-8 p-4 rounded-xl bg-blue-950/30 border border-blue-900/40 flex items-start gap-3">
        <Sprout className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-blue-300">AI Advisory Precision</p>
          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
            The more accurate your farm data, the more precise your AI crop recommendations will be.
            Fill in all fields for the best results.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="card p-6 sm:p-8">
        <AddFarmForm />
      </div>
    </div>
  );
}
