import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin, Layers, Droplets, Thermometer, Ruler,
  ChevronRight, Sprout, FlaskConical
} from 'lucide-react';

const soilColorMap = {
  Clay: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  Sandy: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Silty: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  Peaty: 'bg-lime-500/20 text-lime-400 border-lime-500/30',
  Chalky: 'bg-gray-400/20 text-gray-300 border-gray-400/30',
  Loamy: 'bg-primary-500/20 text-primary-400 border-primary-500/30',
};

const climateColorMap = {
  Tropical: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  Dry: 'bg-amber-600/20 text-amber-500 border-amber-600/30',
  Temperate: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Continental: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  Polar: 'bg-sky-400/20 text-sky-300 border-sky-400/30',
};

const waterColorMap = {
  Rainfed: 'bg-blue-400/20 text-blue-300 border-blue-400/30',
  Groundwater: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  Canal: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
  Mixed: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
};

function InfoPill({ icon: Icon, label, value, colorClass }) {
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${colorClass}`}>
      <Icon className="h-3 w-3 flex-shrink-0" />
      <span className="truncate">{label ? `${label}: ${value}` : value}</span>
    </div>
  );
}

export default function FarmCard({ farm }) {
  const soilClass = soilColorMap[farm.soil_type] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  const climateClass = climateColorMap[farm.climate_zone] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  const waterClass = waterColorMap[farm.water_source] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';

  const createdDate = new Date(farm.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // pH color
  const phColor = farm.soil_ph < 5.5
    ? 'text-red-400'
    : farm.soil_ph > 7.5
    ? 'text-blue-400'
    : 'text-primary-400';

  return (
    <Link
      to={`/farms/${farm.id}`}
      className="group card block hover:border-primary-500/40 hover:shadow-xl hover:shadow-primary-900/20 transition-all duration-300 hover:-translate-y-0.5"
    >
      {/* Card header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5 w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500/20 to-emerald-600/20 border border-primary-500/20 flex items-center justify-center group-hover:from-primary-500/30 group-hover:to-emerald-600/30 transition-all duration-300">
            <Sprout className="h-5 w-5 text-primary-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white group-hover:text-primary-300 transition-colors duration-200 leading-tight">
              {farm.farm_name}
            </h3>
            <div className="flex items-center gap-1 mt-1">
              <MapPin className="h-3 w-3 text-gray-500" />
              <span className="text-xs text-gray-500 truncate max-w-[160px]">{farm.location_region}</span>
            </div>
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-gray-600 group-hover:text-primary-400 group-hover:translate-x-0.5 transition-all duration-200 mt-1 flex-shrink-0" />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-xl bg-gray-800/50 border border-gray-700/50 p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Ruler className="h-3 w-3 text-gray-500" />
            <span className="text-xs text-gray-500">Size</span>
          </div>
          <span className="text-sm font-bold text-white">
            {Number(farm.farm_size_acres).toLocaleString()}
            <span className="text-xs font-normal text-gray-400 ml-1">acres</span>
          </span>
        </div>
        <div className="rounded-xl bg-gray-800/50 border border-gray-700/50 p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <FlaskConical className="h-3 w-3 text-gray-500" />
            <span className="text-xs text-gray-500">Soil pH</span>
          </div>
          <span className={`text-sm font-bold ${phColor}`}>
            {farm.soil_ph}
          </span>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border ${soilClass}`}>
          <Layers className="h-3 w-3" />
          {farm.soil_type}
        </span>
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border ${climateClass}`}>
          <Thermometer className="h-3 w-3" />
          {farm.climate_zone}
        </span>
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border ${waterClass}`}>
          <Droplets className="h-3 w-3" />
          {farm.water_source}
        </span>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-gray-800 flex items-center justify-between">
        <span className="text-xs text-gray-600">Added {createdDate}</span>
        <span className="text-xs font-medium text-primary-500 group-hover:text-primary-400 transition-colors">
          View Details →
        </span>
      </div>
    </Link>
  );
}
