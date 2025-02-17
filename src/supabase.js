import { createClient } from '@supabase/supabase-js'

const isProduction = window.location.hostname === 'auto-tube.vercel.app';
const redirectUrl = isProduction 
  ? import.meta.env.VITE_PRODUCTION_URL || 'https://auto-tube.vercel.app'
  : import.meta.env.VITE_DEV_URL || 'http://localhost:3000';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      redirectTo: redirectUrl
    }
  }
)

// Add this to handle auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    // Check if we're already on the correct domain
    if (isProduction) {
      if (window.location.hostname === 'auto-tube.vercel.app') {
        window.location.reload()
      } else {
        window.location.href = 'https://auto-tube.vercel.app'
      }
    } else {
      // In development, redirect to localhost
      if (window.location.hostname === 'localhost') {
        window.location.reload()
      } else {
        window.location.href = 'http://localhost:3000'
      }
    }
  }
})

export { supabase } 
