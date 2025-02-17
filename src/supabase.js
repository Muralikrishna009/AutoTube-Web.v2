const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.VITE_SUPABASE_ANON_KEY || '',
  {
    auth: {
      redirectTo: 'https://auto-tube-web-v2.vercel.app/'
    }
  }
) 