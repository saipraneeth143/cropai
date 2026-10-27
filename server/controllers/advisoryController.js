const { createClient } = require('@supabase/supabase-js');
const { z } = require('zod');
const { GoogleGenAI, Type } = require('@google/genai');

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

    // Build the AI prompt
    const systemInstruction = 'You are an expert Agronomist and Agricultural Scientist. Your objective is to analyze farm data (soil, climate, size, water) and provide a highly specific, scientific, and actionable crop management plan. You must strictly output valid JSON matching the requested schema. Do not include markdown formatting like ```json or any conversational text. Respond ONLY with the raw JSON object.';

    const userPrompt = `Analyze the following farm data and provide a comprehensive crop advisory plan:

- Location / Region: ${farm.location_region}
- Farm Size: ${farm.farm_size_acres} acres
- Soil Type: ${farm.soil_type}
- Soil pH: ${farm.soil_ph}
- Climate Zone: ${farm.climate_zone}
- Water Source: ${farm.water_source}

Provide recommended crops with reasoning and expected yield per acre, a nutrient management plan, pest warnings with mitigation strategies, and an irrigation schedule.`;

    const advisorySchema = {
      type: Type.OBJECT,
      properties: {
        recommended_crops: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              crop_name: { type: Type.STRING },
              reasoning: { type: Type.STRING },
              expected_yield_per_acre: { type: Type.STRING }
            },
            required: ['crop_name', 'reasoning', 'expected_yield_per_acre']
          }
        },
        nutrient_plan: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        },
        pest_warnings: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              pest_name: { type: Type.STRING },
              mitigation_strategy: { type: Type.STRING }
            },
            required: ['pest_name', 'mitigation_strategy']
          }
        },
        irrigation_schedule: { type: Type.STRING }
      },
      required: ['recommended_crops', 'nutrient_plan', 'pest_warnings', 'irrigation_schedule']
    };

    // Call Gemini
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: userPrompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: advisorySchema
      },
      systemInstruction: systemInstruction
    });

    const advisoryData = JSON.parse(response.text);

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
    return res.status(500).json({ error: 'Internal server error' });
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
