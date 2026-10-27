const { createClient } = require('@supabase/supabase-js');

const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    req.user = data.user;
    next();
  } catch (err) {
    console.error('Authentication error:', err);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = { authenticateUser };
