import React, { useState } from 'react';
import {
  Sprout, FlaskConical, Bug, Droplets, TrendingUp,
  ChevronDown, ChevronUp, AlertTriangle, CheckCircle2,
  Download, Calendar, Leaf
} from 'lucide-react';

/* ─────────────────────────── Helper Components ─────────────────────────── */

function SectionHeader({ icon: Icon, title, count, colorClass = 'text-primary-400', bgClass = 'bg-primary-500/20 border-primary-500/20' }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className={`flex items-center justify-center w-10 h-10 rounded-xl border ${bgClass}`}>
        <Icon className={`h-5 w-5 ${colorClass}`} />
      </div>
      <div>
        <h3 className="text-lg font-bold text-white">{title}</h3>
        {count !== undefined && (
          <p className="text-xs text-gray-500">{count} item{count !== 1 ? 's' : ''} found</p>
        )}
      </div>
    </div>
  );
}

function CropCard({ crop, index }) {
  const [expanded, setExpanded] = useState(false);

  const cropColors = [
    { badge: 'bg-primary-500/20 border-primary-500/30 text-primary-300', dot: 'bg-primary-500' },
    { badge: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300', dot: 'bg-emerald-500' },
    { badge: 'bg-teal-500/20 border-teal-500/30 text-teal-300', dot: 'bg-teal-500' },
    { badge: 'bg-cyan-500/20 border-cyan-500/30 text-cyan-300', dot: 'bg-cyan-500' },
    { badge: 'bg-lime-500/20 border-lime-500/30 text-lime-300', dot: 'bg-lime-500' },
  ];
  const color = cropColors[index % cropColors.length];

  return (
    <div className={`rounded-xl border ${color.badge} bg-opacity-10 p-4 transition-all duration-200 hover:shadow-lg hover:shadow-black/20`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className={`mt-1 flex-shrink-0 w-2.5 h-2.5 rounded-full ${color.dot} shadow-lg shadow-current/40`} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-bold text-white text-base">{crop.crop_name}</h4>
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${color.badge}`}>
                #{index + 1} Recommended
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <TrendingUp className="h-3.5 w-3.5 text-primary-400" />
              <span className="text-sm text-primary-400 font-semibold">
                Expected yield: {crop.expected_yield_per_acre}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex-shrink-0 p-1.5 rounded-lg hover:bg-white/5 text-gray-500 hover:text-gray-300 transition-all"
          aria-label={expanded ? 'Collapse' : 'Expand'}
        >
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-white/10 animate-fade-in-up">
          <p className="text-sm text-gray-300 leading-relaxed">{crop.reasoning}</p>
        </div>
      )}
    </div>
  );
}

function NutrientItem({ item, index }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-800/40 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-200">
      <div className="flex-shrink-0 mt-0.5 flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/30">
        <span className="text-xs font-bold text-amber-400">{index + 1}</span>
      </div>
      <p className="text-sm text-gray-300 leading-relaxed">{item}</p>
    </div>
  );
}

function PestCard({ pest, index }) {
  const [expanded, setExpanded] = useState(false);
  const severityLevels = ['High Risk', 'Moderate Risk', 'Low Risk'];
  const severity = severityLevels[index % 3];
  const severityColors = {
    'High Risk': 'bg-red-500/20 border-red-500/30 text-red-400',
    'Moderate Risk': 'bg-orange-500/20 border-orange-500/30 text-orange-400',
    'Low Risk': 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400',
  };

  return (
    <div className="rounded-xl border border-red-900/30 bg-red-950/20 p-4 hover:border-red-700/40 transition-all duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="flex-shrink-0 mt-0.5 flex items-center justify-center w-8 h-8 rounded-lg bg-red-500/20 border border-red-500/30">
            <AlertTriangle className="h-4 w-4 text-red-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-bold text-white">{pest.pest_name}</h4>
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${severityColors[severity]}`}>
                {severity}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">Click to view mitigation strategy</p>
          </div>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex-shrink-0 p-1.5 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-300 transition-all"
          aria-label={expanded ? 'Collapse' : 'Expand'}
        >
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-red-900/30 animate-fade-in-up">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-primary-400 mb-1 uppercase tracking-wide">Mitigation Strategy</p>
              <p className="text-sm text-gray-300 leading-relaxed">{pest.mitigation_strategy}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────── Main Component ─────────────────────────── */

export default function AdvisoryReport({ advisory, farm }) {
  const data = advisory?.advisory_data;

  if (!data) {
    return (
      <div className="card p-8 text-center">
        <p className="text-gray-500">No advisory data available.</p>
      </div>
    );
  }

  const generatedDate = new Date(advisory.generated_at).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleExport = () => {
    const exportData = {
      farm_name: farm?.farm_name,
      generated_at: advisory.generated_at,
      advisory: data,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `advisory-${farm?.farm_name?.replace(/\s+/g, '-').toLowerCase() ?? advisory.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Report header */}
      <div className="card-glass p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500/30 to-emerald-600/30 border border-primary-500/30 animate-pulse-glow">
              <Leaf className="h-7 w-7 text-primary-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">AI Advisory Report</h2>
              {farm && (
                <p className="text-sm text-gray-400 mt-0.5">
                  <span className="font-medium text-primary-400">{farm.farm_name}</span>
                  {' · '}{farm.location_region}
                </p>
              )}
              <div className="flex items-center gap-1.5 mt-1.5">
                <Calendar className="h-3.5 w-3.5 text-gray-500" />
                <span className="text-xs text-gray-500">Generated on {generatedDate}</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleExport}
            className="btn-secondary text-sm flex-shrink-0"
            title="Export advisory as JSON"
          >
            <Download className="h-4 w-4" />
            Export JSON
          </button>
        </div>

        {/* Summary badges */}
        <div className="mt-5 flex flex-wrap gap-2">
          <span className="badge-green">
            <Sprout className="h-3.5 w-3.5" />
            {data.recommended_crops?.length ?? 0} Crops Recommended
          </span>
          <span className="badge-yellow">
            <FlaskConical className="h-3.5 w-3.5" />
            {data.nutrient_plan?.length ?? 0} Nutrient Steps
          </span>
          <span className="badge-red">
            <Bug className="h-3.5 w-3.5" />
            {data.pest_warnings?.length ?? 0} Pest Warnings
          </span>
          <span className="badge-blue">
            <Droplets className="h-3.5 w-3.5" />
            Irrigation Scheduled
          </span>
        </div>
      </div>

      {/* 1. Crop Recommendations */}
      <div className="card p-6">
        <SectionHeader
          icon={Sprout}
          title="Recommended Crops"
          count={data.recommended_crops?.length}
          colorClass="text-primary-400"
          bgClass="bg-primary-500/20 border-primary-500/20"
        />
        {data.recommended_crops?.length > 0 ? (
          <div className="space-y-3">
            {data.recommended_crops.map((crop, i) => (
              <CropCard key={i} crop={crop} index={i} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">No crop recommendations available.</p>
        )}
      </div>

      {/* 2. Nutrient Management */}
      <div className="card p-6">
        <SectionHeader
          icon={FlaskConical}
          title="Nutrient Management Plan"
          count={data.nutrient_plan?.length}
          colorClass="text-amber-400"
          bgClass="bg-amber-500/20 border-amber-500/20"
        />
        {data.nutrient_plan?.length > 0 ? (
          <div className="space-y-2">
            {data.nutrient_plan.map((item, i) => (
              <NutrientItem key={i} item={item} index={i} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">No nutrient plan available.</p>
        )}
      </div>

      {/* 3. Pest Warnings */}
      <div className="card p-6">
        <SectionHeader
          icon={Bug}
          title="Pest & Disease Warnings"
          count={data.pest_warnings?.length}
          colorClass="text-red-400"
          bgClass="bg-red-500/20 border-red-500/20"
        />
        {data.pest_warnings?.length > 0 ? (
          <div className="space-y-3">
            {data.pest_warnings.map((pest, i) => (
              <PestCard key={i} pest={pest} index={i} />
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-primary-500/10 border border-primary-500/20">
            <CheckCircle2 className="h-4 w-4 text-primary-400" />
            <p className="text-sm text-primary-400">No significant pest threats identified for this farm profile.</p>
          </div>
        )}
      </div>

      {/* 4. Irrigation Schedule */}
      <div className="card p-6">
        <SectionHeader
          icon={Droplets}
          title="Irrigation Schedule"
          colorClass="text-blue-400"
          bgClass="bg-blue-500/20 border-blue-500/20"
        />
        {data.irrigation_schedule ? (
          <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-900/40">
            <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
              {data.irrigation_schedule}
            </p>
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">No irrigation schedule available.</p>
        )}
      </div>
    </div>
  );
}
