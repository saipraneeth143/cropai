import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  PlusCircle, Sprout, ClipboardList, LayoutDashboard,
  TrendingUp, Leaf, AlertCircle, ChevronRight, Clock,
  Layers, MapPin
} from 'lucide-react';
import { api } from '../lib/axios';
import { useAuth } from '../lib/useAuth';
import FarmCard from '../components/FarmCard';
import LoadingSpinner from '../components/LoadingSpinner';

function StatCard({ icon: Icon, value, label, color = 'text-primary-400', bg = 'bg-primary-500/10 border-primary-500/20' }) {
  return (
    <div className="card p-5 flex items-center gap-4">
      <div className={`flex items-center justify-center w-12 h-12 rounded-xl border ${bg}`}>
        <Icon className={`h-5 w-5 ${color}`} />
      </div>
      <div>
        <div className="text-2xl font-black text-white">{value}</div>
        <div className="text-xs text-gray-500 mt-0.5">{label}</div>
      </div>
    </div>
  );
}

function RecentAdvisoryRow({ advisory }) {
  const date = new Date(advisory.generated_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });
  const cropCount = advisory.advisory_data?.recommended_crops?.length ?? 0;

  return (
    <Link
      to={`/advisory/${advisory.id}`}
      className="flex items-center justify-between px-4 py-3.5 rounded-xl bg-gray-800/40 border border-gray-700/50 hover:border-primary-500/30 hover:bg-gray-800/60 transition-all duration-200 group"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-primary-500/20 border border-primary-500/20">
          <ClipboardList className="h-4 w-4 text-primary-400" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-200 truncate group-hover:text-white transition-colors">
            Advisory — {advisory.farm_id?.slice(0, 8) ?? 'Farm'}
          </p>
          <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
            <Clock className="h-3 w-3" />
            {date}
            <span className="text-gray-700 mx-1">·</span>
            <Leaf className="h-3 w-3 text-primary-600" />
            {cropCount} crop{cropCount !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
      <ChevronRight className="h-4 w-4 text-gray-600 group-hover:text-primary-400 flex-shrink-0 ml-2 group-hover:translate-x-0.5 transition-all" />
    </Link>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();

  const { data: farms = [], isLoading: farmsLoading, error: farmsError } = useQuery({
    queryKey: ['farms'],
    queryFn: () => api.get('/farms'),
  });

  // Fetch recent advisories for each farm (we'll merge them)
  const { data: allAdvisories = [], isLoading: advisoriesLoading } = useQuery({
    queryKey: ['all-advisories', farms.map(f => f.id)],
    queryFn: async () => {
      if (!farms.length) return [];
      const results = await Promise.all(
        farms.slice(0, 3).map(f => api.get(`/advisory/farm/${f.id}`).catch(() => []))
      );
      return results.flat().sort((a, b) => new Date(b.generated_at) - new Date(a.generated_at)).slice(0, 5);
    },
    enabled: farms.length > 0,
  });

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <LayoutDashboard className="h-5 w-5 text-primary-400" />
            <span className="text-sm font-medium text-primary-400 uppercase tracking-wider">Dashboard</span>
          </div>
          <h1 className="text-3xl font-black text-white">
            {greeting()}, {user?.email?.split('@')[0] ?? 'Farmer'} 👋
          </h1>
          <p className="text-gray-500 mt-1 text-sm">Here's an overview of your agricultural operation.</p>
        </div>
        <Link to="/farms/new" className="btn-primary flex-shrink-0">
          <PlusCircle className="h-4 w-4" />
          Add Farm
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={Sprout}
          value={farmsLoading ? '–' : farms.length}
          label="Total Farms"
          color="text-primary-400"
          bg="bg-primary-500/10 border-primary-500/20"
        />
        <StatCard
          icon={ClipboardList}
          value={advisoriesLoading ? '–' : allAdvisories.length}
          label="Recent Advisories"
          color="text-blue-400"
          bg="bg-blue-500/10 border-blue-500/20"
        />
        <StatCard
          icon={TrendingUp}
          value={farmsLoading ? '–' : farms.reduce((a, f) => a + Number(f.farm_size_acres || 0), 0).toFixed(0)}
          label="Total Acres"
          color="text-emerald-400"
          bg="bg-emerald-500/10 border-emerald-500/20"
        />
        <StatCard
          icon={Layers}
          value={farmsLoading ? '–' : [...new Set(farms.map(f => f.soil_type))].length}
          label="Soil Types"
          color="text-amber-400"
          bg="bg-amber-500/10 border-amber-500/20"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Farms grid */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sprout className="h-5 w-5 text-primary-400" />
              Your Farms
            </h2>
            {farms.length > 0 && (
              <span className="text-xs text-gray-500">{farms.length} farm{farms.length !== 1 ? 's' : ''} registered</span>
            )}
          </div>

          {farmsLoading ? (
            <LoadingSpinner message="Loading your farms..." />
          ) : farmsError ? (
            <div className="card p-6 flex items-center gap-3 text-red-400">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm">Failed to load farms. Please refresh the page.</p>
            </div>
          ) : farms.length === 0 ? (
            <div className="card p-12 text-center">
              <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-primary-500/10 border border-primary-500/20 mx-auto mb-5">
                <Sprout className="h-10 w-10 text-primary-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">No Farms Yet</h3>
              <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">
                Start by adding your first farm profile to get AI-powered crop advisories.
              </p>
              <Link to="/farms/new" className="btn-primary">
                <PlusCircle className="h-4 w-4" />
                Add Your First Farm
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {farms.map((farm) => (
                <FarmCard key={farm.id} farm={farm} />
              ))}
              {/* Add farm tile */}
              <Link
                to="/farms/new"
                className="card flex flex-col items-center justify-center p-6 border-dashed border-gray-700 hover:border-primary-500/50 hover:bg-primary-500/5 transition-all duration-300 min-h-[180px] group"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gray-800 border border-gray-700 group-hover:bg-primary-500/20 group-hover:border-primary-500/30 transition-all duration-300 mb-3">
                  <PlusCircle className="h-6 w-6 text-gray-600 group-hover:text-primary-400 transition-colors" />
                </div>
                <p className="text-sm font-medium text-gray-500 group-hover:text-primary-400 transition-colors">
                  Add Another Farm
                </p>
              </Link>
            </div>
          )}
        </div>

        {/* Recent advisories sidebar */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-blue-400" />
              Recent Advisories
            </h2>
          </div>

          {advisoriesLoading ? (
            <LoadingSpinner size="sm" />
          ) : allAdvisories.length === 0 ? (
            <div className="card p-6 text-center">
              <ClipboardList className="h-8 w-8 text-gray-600 mx-auto mb-3" />
              <p className="text-sm text-gray-500">
                {farms.length === 0
                  ? 'Add a farm to generate your first advisory.'
                  : 'No advisories yet. Visit a farm and click "Generate Advisory".'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {allAdvisories.map((advisory) => (
                <RecentAdvisoryRow key={advisory.id} advisory={advisory} />
              ))}
            </div>
          )}

          {/* Quick tip */}
          <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-primary-900/40 to-emerald-900/20 border border-primary-500/20">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5 flex items-center justify-center w-8 h-8 rounded-lg bg-primary-500/20">
                <TrendingUp className="h-4 w-4 text-primary-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-primary-300 mb-1">Pro Tip</p>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Generate advisories regularly as seasons change. Crop recommendations shift with climate and soil conditions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
