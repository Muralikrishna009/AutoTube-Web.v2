const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.VITE_SUPABASE_ANON_KEY || '',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      redirectTo: 'https://auto-tube-web-v2.vercel.app'
    }
  }
)

// Add this to handle auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    // Check if we're already on the correct domain
    if (window.location.hostname === 'auto-tube-web-v2.vercel.app') {
      // Just refresh the page if we're already on the correct domain
      window.location.reload()
    } else {
      // Redirect to the main page after sign in
      window.location.href = 'https://auto-tube-web-v2.vercel.app'
    }
  }
})

export { supabase } 