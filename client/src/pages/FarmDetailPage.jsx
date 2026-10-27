import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft, Sprout, Zap, MapPin, Layers, Droplets, Thermometer,
  Ruler, FlaskConical, ClipboardList, AlertCircle, Trash2,
  ChevronRight, Clock, TrendingUp, RefreshCw
} from 'lucide-react';
import { api } from '../lib/axios';
import LoadingSpinner from '../components/LoadingSpinner';

function DetailRow({ icon: Icon, label, value, colorClass = 'text-gray-300' }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0">
      <div className="flex items-center gap-2.5 text-gray-500">
        <Icon className="h-4 w-4 flex-shrink-0" />
        <span className="text-sm">{label}</span>
      </div>
      <span className={`text-sm font-semibold ${colorClass}`}>{value}</span>
    </div>
  );
}

export default function FarmDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [generateError, setGenerateError] = useState('');

  const { data: farm, isLoading: farmLoading, error: farmError } = useQuery({
    queryKey: ['farm', id],
    queryFn: () => api.get(`/farms/${id}`),
  });

  const { data: advisories = [], isLoading: advisoriesLoading } = useQuery({
    queryKey: ['advisories', id],
    queryFn: () => api.get(`/advisory/farm/${id}`),
    enabled: !!id,
  });

  const generateMutation = useMutation({
    mutationFn: () => api.post('/advisory/generate', { farm_id: id }),
    onSuccess: (advisory) => {
      queryClient.invalidateQueries({ queryKey: ['advisories', id] });
      navigate(`/advisory/${advisory.id}`);
    },
    onError: (err) => {
      setGenerateError(err?.error || 'Failed to generate advisory. Please try again.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => api.delete(`/farms/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farms'] });
      navigate('/dashboard');
    },
    onError: (err) => {
      alert(err?.error || 'Failed to delete farm.');
      setShowDeleteConfirm(false);
    },
  });

  const phColor = farm
    ? farm.soil_ph < 5.5 ? 'text-red-400' : farm.soil_ph > 7.5 ? 'text-blue-400' : 'text-primary-400'
    : 'text-gray-300';

  if (farmLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <LoadingSpinner size="lg" message="Loading farm details..." />
      </div>
    );
  }

  if (farmError || !farm) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="card p-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-white mb-2">Farm Not Found</h2>
          <p className="text-gray-500 text-sm mb-6">This farm may have been deleted or you don't have access to it.</p>
          <Link to="/dashboard" className="btn-primary">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back */}
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-400 transition-colors mb-6 group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to Dashboard
      </Link>

      {/* Farm header */}
      <div className="card p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500/30 to-emerald-600/20 border border-primary-500/30 animate-pulse-glow flex-shrink-0">
              <Sprout className="h-7 w-7 text-primary-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">{farm.farm_name}</h1>
              <div className="flex items-center gap-1.5 mt-1 text-gray-500">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{farm.location_region}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-1 text-gray-600">
                <Clock className="h-3.5 w-3.5" />
                <span className="text-xs">
                  Added {new Date(farm.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="btn-danger text-sm px-3 py-2"
              title="Delete farm"
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Delete</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Farm details */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card p-5">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Farm Details</h2>
            <DetailRow icon={Ruler} label="Size" value={`${Number(farm.farm_size_acres).toLocaleString()} acres`} />
            <DetailRow icon={Layers} label="Soil Type" value={farm.soil_type} colorClass="text-amber-400" />
            <DetailRow icon={FlaskConical} label="Soil pH" value={farm.soil_ph} colorClass={phColor} />
            <DetailRow icon={Thermometer} label="Climate" value={farm.climate_zone} colorClass="text-blue-400" />
            <DetailRow icon={Droplets} label="Water Source" value={farm.water_source} colorClass="text-cyan-400" />
          </div>

          {/* Generate advisory CTA */}
          <div className="card p-5 bg-gradient-to-br from-primary-900/30 to-emerald-900/20 border-primary-500/30">
            <div className="flex items-start gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-500/20 border border-primary-500/30 flex-shrink-0">
                <Zap className="h-5 w-5 text-primary-400" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Generate Advisory</h3>
                <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                  Get AI-powered crop recommendations, pest warnings, and irrigation plans for this farm.
                </p>
              </div>
            </div>

            {generateError && (
              <div className="mb-3 flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                <AlertCircle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                {generateError}
              </div>
            )}

            <button
              onClick={() => {
                setGenerateError('');
                generateMutation.mutate();
              }}
              disabled={generateMutation.isPending}
              className="btn-primary w-full"
            >
              {generateMutation.isPending ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  Generate AI Advisory
                </>
              )}
            </button>

            {generateMutation.isPending && (
              <p className="text-center text-xs text-gray-500 mt-2 animate-pulse">
                Consulting Gemini AI — this may take 10–20 seconds...
              </p>
            )}
          </div>
        </div>

        {/* Advisories history */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-blue-400" />
              Advisory History
            </h2>
            {advisories.length > 0 && (
              <span className="text-xs text-gray-500">{advisories.length} report{advisories.length !== 1 ? 's' : ''}</span>
            )}
          </div>

          {advisoriesLoading ? (
            <LoadingSpinner size="sm" message="Loading advisories..." />
          ) : advisories.length === 0 ? (
            <div className="card p-8 text-center">
              <ClipboardList className="h-10 w-10 text-gray-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-2">No Advisories Yet</h3>
              <p className="text-sm text-gray-500 max-w-xs mx-auto">
                Click "Generate AI Advisory" to get your first science-backed crop plan.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {advisories.map((advisory, i) => {
                const date = new Date(advisory.generated_at).toLocaleDateString('en-US', {
                  weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
                });
                const cropCount = advisory.advisory_data?.recommended_crops?.length ?? 0;
                const pestCount = advisory.advisory_data?.pest_warnings?.length ?? 0;

                return (
                  <Link
                    key={advisory.id}
                    to={`/advisory/${advisory.id}`}
                    className={`card flex items-center justify-between p-4 hover:border-primary-500/30 hover:shadow-lg hover:shadow-primary-900/10 transition-all duration-200 group animate-fade-in-up`}
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/20 group-hover:bg-blue-500/30 transition-all">
                        <ClipboardList className="h-4 w-4 text-blue-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors">
                          Advisory Report
                          {i === 0 && (
                            <span className="ml-2 px-1.5 py-0.5 rounded text-xs bg-primary-500/20 text-primary-400 border border-primary-500/20">Latest</span>
                          )}
                        </p>
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />{date}
                          </span>
                          <span className="text-xs text-primary-500 flex items-center gap-1">
                            <Sprout className="h-3 w-3" />{cropCount} crops
                          </span>
                          {pestCount > 0 && (
                            <span className="text-xs text-red-500 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />{pestCount} pest{pestCount !== 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-600 group-hover:text-primary-400 flex-shrink-0 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-scale-in">
          <div className="card p-6 max-w-sm w-full">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/30 mx-auto mb-4">
              <Trash2 className="h-6 w-6 text-red-400" />
            </div>
            <h3 className="text-lg font-bold text-white text-center mb-2">Delete Farm?</h3>
            <p className="text-sm text-gray-400 text-center mb-6 leading-relaxed">
              This will permanently delete <span className="text-white font-semibold">"{farm.farm_name}"</span> and all its advisories. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn-secondary flex-1"
                disabled={deleteMutation.isPending}
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate()}
                className="btn-danger flex-1"
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? (
                  <><div className="h-4 w-4 rounded-full border-2 border-red-400/30 border-t-red-400 animate-spin" />Deleting...</>
                ) : (
                  <><Trash2 className="h-4 w-4" />Delete</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
