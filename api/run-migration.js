// TEMPORARY: Create missing Supabase tables (fuel_logs, modifications)
// Usage: curl https://myautolog-app.vercel.app/api/run-migration
// Delete this file after successful execution!

export default async function handler(req, res) {
  const results = {};
  
  // List all env var names (not values) for debugging
  const envKeys = Object.keys(process.env).sort();
  results.envKeys = envKeys;
  
  // Try each known Supabase-related env var
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY;

  results.found = {
    VITE_SUPABASE_URL: !!process.env.VITE_SUPABASE_URL,
    SUPABASE_URL: !!process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    SUPABASE_SERVICE_KEY: !!process.env.SUPABASE_SERVICE_KEY,
    VITE_SUPABASE_ANON_KEY: !!process.env.VITE_SUPABASE_ANON_KEY,
  };

  if (!supabaseUrl && !serviceRoleKey) {
    // Try to determine Supabase URL from the existing API setup
    results.error = 'No Supabase credentials found in env';
    return res.status(200).json(results);
  }

  const { createClient } = await import('@supabase/supabase-js');
  
  if (supabaseUrl && serviceRoleKey) {
    const supabase = createClient(supabaseUrl, serviceRoleKey);
    const projectRef = supabaseUrl.match(/https:\/\/(.+)\.supabase\.co/)[1];
    
    // Try executing SQL via the /sql endpoint
    try {
      const sqlResponse = await fetch(`${supabaseUrl}/sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': serviceRoleKey,
          'Authorization': `Bearer ${serviceRoleKey}`
        },
        body: JSON.stringify({
          query: `SELECT 1 AS test`
        })
      });
      const sqlText = await sqlResponse.text();
      results['/sql-test'] = { status: sqlResponse.status, body: sqlText.substring(0, 300) };
    } catch (err) {
      results['/sql-test'] = { error: err.message.substring(0, 200) };
    }

    // Try PostgREST RPC call
    try {
      const rpcResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': serviceRoleKey,
          'Authorization': `Bearer ${serviceRoleKey}`
        }
      });
      const rpcText = await rpcResponse.text();
      results['/rest/v1/rpc'] = { status: rpcResponse.status, body: rpcText.substring(0, 300) };
    } catch (err) {
      results['/rest/v1/rpc'] = { error: err.message.substring(0, 200) };
    }

    // Try querying existing tables to verify connectivity
    try {
      const { data, error } = await supabase.from('vehicles').select('id').limit(1);
      results['supabase-connect'] = { ok: !error, error: error?.message?.substring(0, 200) };
    } catch (err) {
      results['supabase-connect'] = { error: err.message.substring(0, 200) };
    }
  }

  res.status(200).json(results);
}