import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft, AlertCircle, Sprout, MapPin, ChevronRight
} from 'lucide-react';
import { api } from '../lib/axios';
import AdvisoryReport from '../components/AdvisoryReport';
import LoadingSpinner from '../components/LoadingSpinner';

export default function AdvisoryDetailPage() {
  const { id } = useParams();

  const { data: advisory, isLoading, error } = useQuery({
    queryKey: ['advisory', id],
    queryFn: () => api.get(`/advisory/${id}`),
    enabled: !!id,
  });

  // Fetch farm data to pass context to the report
  const { data: farm } = useQuery({
    queryKey: ['farm', advisory?.farm_id],
    queryFn: () => api.get(`/farms/${advisory.farm_id}`),
    enabled: !!advisory?.farm_id,
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <LoadingSpinner size="lg" message="Loading advisory report..." />
      </div>
    );
  }

  if (error || !advisory) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="card p-10 text-center">
          <AlertCircle className="h-14 w-14 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Advisory Not Found</h2>
          <p className="text-gray-500 text-sm mb-6">
            This advisory may have been deleted or you don't have permission to view it.
          </p>
          <Link to="/dashboard" className="btn-primary">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb navigation */}
      <nav className="flex items-center gap-2 text-sm mb-6">
        <Link
          to="/dashboard"
          className="text-gray-500 hover:text-primary-400 transition-colors"
        >
          Dashboard
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-gray-700" />
        {farm ? (
          <>
            <Link
              to={`/farms/${farm.id}`}
              className="text-gray-500 hover:text-primary-400 transition-colors flex items-center gap-1"
            >
              <Sprout className="h-3.5 w-3.5 text-primary-500" />
              {farm.farm_name}
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-gray-700" />
          </>
        ) : null}
        <span className="text-gray-400 font-medium">Advisory Report</span>
      </nav>

      {/* Back link */}
      {farm && (
        <Link
          to={`/farms/${farm.id}`}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-400 transition-colors mb-6 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to {farm.farm_name}
        </Link>
      )}

      {/* Farm context strip */}
      {farm && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-gray-800/40 border border-gray-700/50 flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-500/20 border border-primary-500/20 flex-shrink-0">
            <MapPin className="h-4 w-4 text-primary-400" />
          </div>
          <div className="flex items-center gap-2 flex-wrap text-sm">
            <span className="font-semibold text-white">{farm.farm_name}</span>
            <span className="text-gray-600">·</span>
            <span className="text-gray-400">{farm.location_region}</span>
            <span className="text-gray-600">·</span>
            <span className="text-gray-400">{farm.soil_type} soil</span>
            <span className="text-gray-600">·</span>
            <span className="text-gray-400">pH {farm.soil_ph}</span>
          </div>
        </div>
      )}

      {/* The advisory report */}
      <AdvisoryReport advisory={advisory} farm={farm} />
    </div>
  );
}
