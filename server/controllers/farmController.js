const { createClient } = require('@supabase/supabase-js');
const { z } = require('zod');

const FarmSchema = z.object({
  farm_name: z.string().min(2, 'Farm name must be at least 2 characters'),
  location_region: z.string().min(2, 'Location must be at least 2 characters'),
  farm_size_acres: z.number().positive('Farm size must be positive'),
  soil_type: z.enum(['Clay', 'Sandy', 'Silty', 'Peaty', 'Chalky', 'Loamy']),
  soil_ph: z.number().min(1, 'pH must be between 1 and 14').max(14, 'pH must be between 1 and 14'),
  climate_zone: z.enum(['Tropical', 'Dry', 'Temperate', 'Continental', 'Polar']),
  water_source: z.enum(['Rainfed', 'Groundwater', 'Canal', 'Mixed'])
});

const getSupabase = () =>
  createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const createFarm = async (req, res) => {
  try {
    const validation = FarmSchema.safeParse(req.body);

    if (!validation.success) {
      const messages = validation.error.errors.map(e => e.message);
      return res.status(400).json({ error: 'Validation failed', details: messages });
    }

    const supabase = getSupabase();

    const { data, error } = await supabase
      .from('farms')
      .insert({
        user_id: req.user.id,
        ...validation.data
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: 'Failed to create farm' });
    }

    return res.status(201).json(data);
  } catch (err) {
    console.error('createFarm error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const getUserFarms = async (req, res) => {
  try {
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from('farms')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase query error:', error);
      return res.status(500).json({ error: 'Failed to fetch farms' });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('getUserFarms error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const getFarmById = async (req, res) => {
  try {
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from('farms')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Farm not found' });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('getFarmById error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const updateFarm = async (req, res) => {
  try {
    const validation = FarmSchema.safeParse(req.body);

    if (!validation.success) {
      const messages = validation.error.errors.map(e => e.message);
      return res.status(400).json({ error: 'Validation failed', details: messages });
    }

    const supabase = getSupabase();

    const { data, error } = await supabase
      .from('farms')
      .update(validation.data)
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error || !data) {
      console.error('Supabase update error:', error);
      return res.status(500).json({ error: 'Failed to update farm' });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('updateFarm error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteFarm = async (req, res) => {
  try {
    const supabase = getSupabase();

    const { error } = await supabase
      .from('farms')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);

    if (error) {
      console.error('Supabase delete error:', error);
      return res.status(500).json({ error: 'Failed to delete farm' });
    }

    return res.status(200).json({ message: 'Farm deleted successfully' });
  } catch (err) {
    console.error('deleteFarm error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createFarm,
  getUserFarms,
  getFarmById,
  updateFarm,
  deleteFarm
};
