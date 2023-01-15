import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://leqnpjeylyqdbnxlthqu.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlcW5wamV5bHlxZGJueGx0aHF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzI0MTMyNzgsImV4cCI6MTk4Nzk4OTI3OH0.y7I4m42RvcpYAEAFT7ScTWZ-hxJGzemVrIfmw_sHbhI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})