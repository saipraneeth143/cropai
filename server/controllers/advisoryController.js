const { createClient } = require('@supabase/supabase-js');
const { z } = require('zod');
const Groq = require('groq-sdk');

const AdvisoryRequestSchema = z.object({
  farm_id: z.string().uuid()
});

const getSupabase = () =>
  createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const generateAdvisory = async (req, res) => {
  try {
    const validation = AdvisoryRequestSchema.safeParse(req.body);

    if (!validation.success) {
      const messages = validation.error.errors.map(e => e.message);
      return res.status(400).json({ error: 'Validation failed', details: messages });
    }

    const { farm_id } = validation.data;
    const supabase = getSupabase();

    // Fetch the farm
    const { data: farm, error: farmError } = await supabase
      .from('farms')
      .select('*')
      .eq('id', farm_id)
      .eq('user_id', req.user.id)
      .single();

    if (farmError || !farm) {
      return res.status(404).json({ error: 'Farm not found' });
    }

    // Build the prompt
    const systemPrompt = `You are an expert Agronomist and Agricultural Scientist. 
Analyze farm data and provide a highly specific, scientific, and actionable crop management plan.
You MUST respond with ONLY a valid raw JSON object — no markdown, no code fences, no explanation.
The JSON must exactly follow this structure:
{
  "recommended_crops": [
    {
      "crop_name": "string",
      "reasoning": "string",
      "expected_yield_per_acre": "string"
    }
  ],
  "nutrient_plan": ["string", "string"],
  "pest_warnings": [
    {
      "pest_name": "string",
      "mitigation_strategy": "string"
    }
  ],
  "irrigation_schedule": "string"
}`;

    const userPrompt = `Generate an agricultural advisory for the following farm:
- Location / Region: ${farm.location_region}
- Farm Size: ${farm.farm_size_acres} acres
- Soil Type: ${farm.soil_type}
- Soil pH: ${farm.soil_ph}
- Climate Zone: ${farm.climate_zone}
- Water Source: ${farm.water_source}

Provide at least 3 recommended crops with reasoning and expected yield per acre, at least 5 nutrient management steps, at least 3 pest warnings with mitigation strategies, and a detailed irrigation schedule.`;

    // Call Groq API
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const completion = await groq.chat.completions.create({
      model: 'qwen/qwen3.8-27b',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 2048,
    });

    const rawText = completion.choices[0]?.message?.content;

    if (!rawText) {
      return res.status(500).json({ error: 'AI returned empty response' });
    }

    let advisoryData;
    try {
      advisoryData = JSON.parse(rawText);
    } catch (parseErr) {
      console.error('JSON parse error:', parseErr, 'Raw:', rawText);
      return res.status(500).json({ error: 'AI response was not valid JSON' });
    }

    // Save to database
    const { data: advisory, error: insertError } = await supabase
      .from('advisories')
      .insert({
        farm_id: farm_id,
        user_id: req.user.id,
        advisory_data: advisoryData
      })
      .select()
      .single();

    if (insertError) {
      console.error('Supabase insert error:', insertError);
      return res.status(500).json({ error: 'Failed to save advisory' });
    }

    return res.status(201).json(advisory);
  } catch (err) {
    console.error('generateAdvisory error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
};

const getAdvisoriesByFarm = async (req, res) => {
  try {
    const farmId = req.params.farmId;
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from('advisories')
      .select('*')
      .eq('farm_id', farmId)
      .eq('user_id', req.user.id)
      .order('generated_at', { ascending: false });

    if (error) {
      console.error('Supabase query error:', error);
      return res.status(500).json({ error: 'Failed to fetch advisories' });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('getAdvisoriesByFarm error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const getAdvisoryById = async (req, res) => {
  try {
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from('advisories')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Advisory not found' });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('getAdvisoryById error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  generateAdvisory,
  getAdvisoriesByFarm,
  getAdvisoryById
};
