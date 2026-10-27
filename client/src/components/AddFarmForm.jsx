import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sprout, MapPin, Ruler, Layers, FlaskConical,
  Thermometer, Droplets, AlertCircle, CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { api } from '../lib/axios';

const SOIL_TYPES = ['Clay', 'Sandy', 'Silty', 'Peaty', 'Chalky', 'Loamy'];
const CLIMATE_ZONES = ['Tropical', 'Dry', 'Temperate', 'Continental', 'Polar'];
const WATER_SOURCES = ['Rainfed', 'Groundwater', 'Canal', 'Mixed'];

const SOIL_DESCRIPTIONS = {
  Clay: 'Heavy, nutrient-rich, water-retentive',
  Sandy: 'Light, well-drained, low nutrients',
  Silty: 'Fertile, smooth, moisture-retentive',
  Peaty: 'High organic matter, acidic',
  Chalky: 'Alkaline, free-draining, rocky',
  Loamy: 'Ideal mix — fertile & well-drained',
};

const CLIMATE_DESCRIPTIONS = {
  Tropical: 'Year-round warmth, heavy rainfall',
  Dry: 'Low precipitation, arid or semi-arid',
  Temperate: 'Moderate temps, seasonal rain',
  Continental: 'Cold winters, warm summers',
  Polar: 'Extreme cold, permafrost',
};

const WATER_DESCRIPTIONS = {
  Rainfed: 'Entirely dependent on rainfall',
  Groundwater: 'Wells or bore holes',
  Canal: 'Irrigation canals or rivers',
  Mixed: 'Combination of sources',
};

function FieldSection({ icon: Icon, title, children }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-gray-800">
        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary-500/20 border border-primary-500/20">
          <Icon className="h-3.5 w-3.5 text-primary-400" />
        </div>
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function SelectCard({ value, label, description, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(value)}
      className={`w-full text-left p-3 rounded-xl border transition-all duration-200 ${
        selected
          ? 'bg-primary-500/15 border-primary-500/50 shadow-lg shadow-primary-900/20'
          : 'bg-gray-800/40 border-gray-700 hover:border-gray-600 hover:bg-gray-800/60'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div>
          <span className={`text-sm font-semibold ${selected ? 'text-primary-300' : 'text-gray-200'}`}>
            {label}
          </span>
          {description && (
            <p className="text-xs text-gray-500 mt-0.5">{description}</p>
          )}
        </div>
        <div className={`flex-shrink-0 w-4 h-4 rounded-full border-2 transition-all ${
          selected ? 'border-primary-500 bg-primary-500' : 'border-gray-600'
        }`}>
          {selected && <div className="w-full h-full rounded-full bg-white scale-50" />}
        </div>
      </div>
    </button>
  );
}

export default function AddFarmForm() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    farm_name: '',
    location_region: '',
    farm_size_acres: '',
    soil_type: '',
    soil_ph: '',
    climate_zone: '',
    water_source: '',
  });

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const validate = () => {
    if (!form.farm_name.trim() || form.farm_name.trim().length < 2) return 'Farm name must be at least 2 characters.';
    if (!form.location_region.trim() || form.location_region.trim().length < 2) return 'Location must be at least 2 characters.';
    const size = parseFloat(form.farm_size_acres);
    if (!form.farm_size_acres || isNaN(size) || size <= 0) return 'Farm size must be a positive number.';
    if (!form.soil_type) return 'Please select a soil type.';
    const ph = parseFloat(form.soil_ph);
    if (!form.soil_ph || isNaN(ph) || ph < 1 || ph > 14) return 'Soil pH must be between 1 and 14.';
    if (!form.climate_zone) return 'Please select a climate zone.';
    if (!form.water_source) return 'Please select a water source.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const payload = {
        ...form,
        farm_size_acres: parseFloat(form.farm_size_acres),
        soil_ph: parseFloat(form.soil_ph),
      };
      const farm = await api.post('/farms', payload);
      navigate(`/farms/${farm.id}`);
    } catch (err) {
      const details = err?.details;
      setError(
        Array.isArray(details) ? details.join(', ') : err?.error || 'Failed to create farm. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isComplete = form.farm_name && form.location_region && form.farm_size_acres &&
    form.soil_type && form.soil_ph && form.climate_zone && form.water_source;

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto">
      {/* Error banner */}
      {error && (
        <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm animate-fade-in-up">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Basic Info */}
      <FieldSection icon={Sprout} title="Farm Information">
        <div>
          <label htmlFor="farm_name" className="input-label">Farm Name *</label>
          <input
            id="farm_name"
            type="text"
            value={form.farm_name}
            onChange={(e) => handleChange('farm_name', e.target.value)}
            placeholder="e.g. Green Valley Farm"
            className="input-field"
            maxLength={100}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="location_region" className="input-label">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                Location / Region *
              </span>
            </label>
            <input
              id="location_region"
              type="text"
              value={form.location_region}
              onChange={(e) => handleChange('location_region', e.target.value)}
              placeholder="e.g. Karnataka, India"
              className="input-field"
              maxLength={100}
            />
          </div>
          <div>
            <label htmlFor="farm_size_acres" className="input-label">
              <span className="flex items-center gap-1.5">
                <Ruler className="h-3.5 w-3.5" />
                Farm Size (acres) *
              </span>
            </label>
            <input
              id="farm_size_acres"
              type="number"
              value={form.farm_size_acres}
              onChange={(e) => handleChange('farm_size_acres', e.target.value)}
              placeholder="e.g. 25"
              className="input-field"
              min="0.1"
              step="0.1"
            />
          </div>
        </div>
      </FieldSection>

      {/* Soil Information */}
      <FieldSection icon={Layers} title="Soil Information">
        <div>
          <label className="input-label">
            <span className="flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5" />
              Soil Type *
            </span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {SOIL_TYPES.map((type) => (
              <SelectCard
                key={type}
                value={type}
                label={type}
                description={SOIL_DESCRIPTIONS[type]}
                selected={form.soil_type === type}
                onClick={(v) => handleChange('soil_type', v)}
              />
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="soil_ph" className="input-label">
            <span className="flex items-center gap-1.5">
              <FlaskConical className="h-3.5 w-3.5" />
              Soil pH Level * (1–14)
            </span>
          </label>
          <div className="flex items-center gap-4">
            <input
              id="soil_ph"
              type="range"
              min="1"
              max="14"
              step="0.1"
              value={form.soil_ph || 7}
              onChange={(e) => handleChange('soil_ph', e.target.value)}
              className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
            />
            <div className="w-16">
              <input
                type="number"
                value={form.soil_ph}
                onChange={(e) => handleChange('soil_ph', e.target.value)}
                placeholder="7.0"
                className="input-field text-center py-2"
                min="1"
                max="14"
                step="0.1"
              />
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>Acidic (1)</span>
            <span className="text-primary-500 font-medium">Neutral (7)</span>
            <span>Alkaline (14)</span>
          </div>
        </div>
      </FieldSection>

      {/* Climate & Water */}
      <FieldSection icon={Thermometer} title="Climate & Water">
        <div>
          <label className="input-label">
            <span className="flex items-center gap-1.5">
              <Thermometer className="h-3.5 w-3.5" />
              Climate Zone *
            </span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {CLIMATE_ZONES.map((zone) => (
              <SelectCard
                key={zone}
                value={zone}
                label={zone}
                description={CLIMATE_DESCRIPTIONS[zone]}
                selected={form.climate_zone === zone}
                onClick={(v) => handleChange('climate_zone', v)}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="input-label">
            <span className="flex items-center gap-1.5">
              <Droplets className="h-3.5 w-3.5" />
              Water Source *
            </span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {WATER_SOURCES.map((source) => (
              <SelectCard
                key={source}
                value={source}
                label={source}
                description={WATER_DESCRIPTIONS[source]}
                selected={form.water_source === source}
                onClick={(v) => handleChange('water_source', v)}
              />
            ))}
          </div>
        </div>
      </FieldSection>

      {/* Submit */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting || !isComplete}
          className="btn-primary w-full py-3.5 text-base"
        >
          {isSubmitting ? (
            <>
              <div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Creating Farm Profile...
            </>
          ) : (
            <>
              <CheckCircle2 className="h-5 w-5" />
              Create Farm Profile
              <ChevronRight className="h-4 w-4 ml-auto" />
            </>
          )}
        </button>
        {!isComplete && !isSubmitting && (
          <p className="text-center text-xs text-gray-600 mt-2">Fill in all fields to continue</p>
        )}
      </div>
    </form>
  );
}
