// TEMPORARY: Create missing Supabase tables (fuel_logs, modifications)
// Usage: curl https://myautolog-app.vercel.app/api/run-migration
// Delete this file after successful execution!

import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return res.status(500).json({ error: 'Missing env vars' });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const results = [];

  // SQL statements to execute
  const sqlStatements = [
    `CREATE TABLE IF NOT EXISTS fuel_logs (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
      date DATE NOT NULL DEFAULT CURRENT_DATE,
      mileage INTEGER NOT NULL DEFAULT 0,
      gallons DECIMAL(6,2) NOT NULL DEFAULT 0,
      cost DECIMAL(8,2) NOT NULL DEFAULT 0,
      is_full_tank BOOLEAN NOT NULL DEFAULT true,
      octane TEXT DEFAULT 'regular',
      notes TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );`,
    `ALTER TABLE fuel_logs ENABLE ROW LEVEL SECURITY;`,
    `CREATE TABLE IF NOT EXISTS modifications (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'Other',
      cost DECIMAL(8,2) NOT NULL DEFAULT 0,
      mileage_at_install INTEGER NOT NULL DEFAULT 0,
      date DATE NOT NULL DEFAULT CURRENT_DATE,
      notes TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );`,
    `ALTER TABLE modifications ENABLE ROW LEVEL SECURITY;`
  ];

  for (const sql of sqlStatements) {
    try {
      // Use fetch to call the PostgREST root endpoint with service_role key
      // This allows executing raw SQL via the REST API
      const response = await fetch(supabaseUrl + '/rest/v1/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': serviceRoleKey,
          'Authorization': `Bearer ${serviceRoleKey}`,
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify({ query: sql })
      });
      const text = await response.text();
      results.push({
        sql: sql.substring(0, 50) + '...',
        status: response.status,
        body: text.substring(0, 200)
      });
    } catch (err) {
      results.push({ sql: sql.substring(0, 50) + '...', error: err.message });
    }
  }

  // Also verify tables exist by querying information_schema
  try {
    const { data: fuelLogsTable, error: fuelErr } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_name', 'fuel_logs')
      .single();
    
    const { data: modsTable, error: modsErr } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_name', 'modifications')
      .single();

    results.push({
      verification: true,
      fuel_logs_exists: !!fuelLogsTable,
      modifications_exists: !!modsTable,
      fuel_err: fuelErr?.message,
      mods_err: modsErr?.message
    });
  } catch (err) {
    results.push({ verification: true, error: err.message });
  }

  res.status(200).json({
    message: 'Migration attempt complete',
    serviceRoleConfigured: !!serviceRoleKey,
    results
  });
}