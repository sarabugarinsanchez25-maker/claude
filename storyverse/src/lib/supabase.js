import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Cliente de Supabase para interactuar con la base de datos
export const supabase = createClient(supabaseUrl, supabaseKey)
